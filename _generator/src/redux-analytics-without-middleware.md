---
title: Redux analytics, without middleware
lunr: true
draft: false
date: 2016-09-27 14:00:00
author: Thomas Roch
metaTags: react,functional,reactive,analytics,redux
tags: javascript,react,redux,functional programming,reactive programming
image: https://raw.githubusercontent.com/reactjs/redux/master/logo/logo.png
---

# Redux analytics, without middleware

A fews months ago I attended ReactEurope in Paris. There was a talk (a bit niche, from a conference sponsor) on analytics in redux. I'm working on a redux app at work, and like any apps it has analytics needs. At the time I had only scratched the surface of analytics in redux, and middlewares seemed the right place to start. But after a few iterations, I abandonned middlewares in favour of a better solution: __reactive analytics__. I would encourage you to watch [Andre Staltz' talk about reactive programming](https://www.youtube.com/watch?v=v68ppDlvHqs) during the last PolyConf, it inspired some of this work.


## Are middlewares suitable for analytics?

There are two ways you could use middlewares for analytics:
- You could atach metadata to your actions
- You could have a big switch statement on action types (or if / else if statements)

Those two solutions are in my opinion not great. For the first one, actions don't need to be aware of analytics side-effects they might trigger, and how to present their data to an analytics middleware. It adds complexity to your action creators and it isn't the best for separation of concerns.

Instead any analytics code should be observing actions and reacting to them, and this brings us to point 2: an analytics middleware with a big switch statement. First, this is hardly scalable as it will grow over time. But to understand why this is not suitable, let's consider a simple example.

Shortly after I started to use an analytics redux middleware, I needed to inform google analytics of the currently logged-in user (for session reconciliation). I have a reducer taking care of the piece of state containing the current user, with a few actions causing it to return a new state: when a user signs in, signs up, resets its password or logs out. Except when logging out, those actions contain an API response which itself contains a new session. My analytics middleware would need to have knowledge of those four actions! One could ask: "why do you not combine them into one action?", which is a valid question. And my answer would be: "what is the point of having actions?". If I were to combine those actions, I would move to action creators the responsibility to know the causes actions have on the state. And this isn't right because only reducers should have such knowledge. An action creator should not decide what actions to dispatch based on what parts of the state should be updated.

Middlewares are also static and cannot be added and removed after store creation.


## Observing state changes

In the example above, there is a quite obvious thing to do: observe the current user in state. Instead of looking at actions, we want to look at the effects they have on the appplication state. And redux already provides everything we need: `store.subscribe`. For our purpose, we can wrap `store.subscribe` with a function to which we provide a selector (a function of state returning a path of the state) and a callback to be executed when a change has been detected.


```javascript
const subscribe = (selector, callback, invokeImmediately = true) => (store) => {
    let previousValue;

    const invokeCallback = () => {
        const value = selector(state);

        if (value !== previousValue) {
            callback(value, previousValue, store.getState());
        }

        previousValue = value;
    }

    if (invokeImmediately) {
        invokeCallback();
    }

    return store.subscribe((state) => {
        invokeCallback();
    };
};
```
And then, observing the current user changing would look like this:

```javascript
const getUser = (state) => state.activeUser;
const setUserInGA = (user) => {
    window.ga('set', 'userId', user ? hash(user.id) : null);
}

const unsubscribe = subscribe(getUser, setUserInGA)(store);
```


## Listening to actions

Observing changes in state for analytics will get you there most of the time. However, sometimes reacting to an action being dispatched is what you need. Considering the same example, I also need to call an affiliate when a user has just signed up. I can't observe the current user value changing: I would have no idea if it changed because of an acquisition, a log in or a password reset. I just need to react to the action dispatched by a successful sign up.

Actions are like events, and the way we listen to events is by adding event listeners (`addEventListener(eventType, listener)`). Why not have an `addActionListener(actionType, listener)`? We just need to make use of an absolute brilliant feature of redux: store enhancers.

```javascript
function actionListenersStoreEnhancer(createStore) {
    return (reducer, initialState, enhancer) => {
        const actionListeners = {};
        const store = createStore(reducer, initialState, enhancer);
        const dispatch = store.dispatch;

        store.dispatch = (action) => {
            const result = dispatch(action);

            if (typeof action === 'object' && action.type && actionListeners[action.type]) {
                actionListeners[action.type].forEach((listener) => listener(action));
            }

            return result;
        };

        store.addActionListener = (actionType, listener) => {
            actionListeners[actionType] = (actionListeners[actionType] || []).concat(listener);

            return () => {
                actionListeners[actionType] = actionListeners[actionType].filter((l) => l !== listener);
            };
        };

        return store;
    };
}
```

And then, using it this way:

```javascript
const removeActionListener = store.addActionListener('USER_SIGNED_UP', () => {
    window.fbq('track', 'CompleteRegistration');
});
```

## Attaching analytics behaviours to components

Finally, we need to be able to add and remove analytics observers and action listeners during the lifetime of an application. Analytics can easily be organised by domain and attached to business-level views or components. Using a higher-order component, we can create components which will subscribe to your store and add action listeners when mounted, and which will unsubscribe / remove them when unmounted. This is a great approach: we have reactive analytics, but we are still able to organize our code at the component-level, wherever it makes sense for you. We don't imped our ability to do code splitting, we can A/B test variations of components with different analytics...

But first, we need to have a better subscribe method. Instead create a subscription for each value we want to observe, we can share the same subscription at the component level (a bit like the way connect works).

```javascript
const getValuesAndCallback(state, observers, previousValues) =>
    Object.keys(observers).reduce(
        (obj, key) => {
            const [ selector, callback ] = observers[key];

            const previousValue = previousValues[key];
            const value = selector(state);

            if (previousValue !== value) {
                callback(value, previousValue, store.getState());
                obj[key] = value;
            }
            return obj;
        },
        previousValues
    );

const subscribe = (observers, invokeImmediately = true) => (store) => {
    let values = {};

    if (invokeImmediately) {
        values = getValuesAndCallback(store, observers, values);
    }

    return store.subscribe((state) => {
        getValuesAndCallback(state, observers, values);
    });
};
```

And that would be use this way (not the prettiest, but it's the best API I've found so far):

```javascript
subscribe({
    user: [ getUser, (user) => { /* send hashed userId */ }
    route: [ getRoute, (route) => { /* send pageview event */ }
})(store);
```

Finally, we need an higher-order component, making use of your `subscribe` and `addActionListener` functions:

```javascript
const withAnalytics = (valueObservers, actionListeners, invokeImmediately = true) => (BaseComponent) => {
    class WithAnalytics extends Component {
        constructor(props, context) {
            super(props);

            this.store = context.store;
        }

        componentWillMount() {
            this.unsubscribe = subscribe(valueObservers, invokeImmediately)(this.store);
            this.removeActionListenerList = Object.keys(actionListeners)
                .map((actionType) => this.store.addActionListener(actionType, actionListeners[actionType]);
        }

        componentWillUnmount() {
            if (this.unsubscribe) {
                this.unsubscribe();
                this.removeActionListenerList.forEach((removeListener) => removeListener());
            }
        }

        render() {
            return React.createElement(BaseComponent, this.props);
        }
    }

    const displayName = BaseComponent.displayName || BaseComponent.name || 'Component';

    WithAnalytics.displayName = `WithAnalytics[${displayName}]`;

    WithAnalytics.contextTypes = {
        store: PropTypes.object.isRequired
    };

    return WithAnalytics;
};

export default withAnalytics;
```

And that's it! A fairly simple solution to bring reactive analytics to redux, observing state changes and listening to actions, and attaching analytics to components! All of that without a middleware.
