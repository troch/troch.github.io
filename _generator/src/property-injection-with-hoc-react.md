---
title: Property injection with higher-order components in React
lunr: true
draft: true
date: 2015-12-31 16:00:00
author: Thomas Roch
metaTags: react,functional,stateless,components,higher-order,property injection
tags: javascript,react,functional programming
image: https://raw.githubusercontent.com/gulpjs/artwork/master/gulp.png
---

# Property injection with higher-order components in React

React 0.14 introduced functional stateless components: components written as pure functions, returning vDOM elements as an expression of their props. For most components, functional stateless components will do, but is it possible to write an entire application (i.e. tree of components) with them? what happens when lifecycle methods are needed? Do we need to couple lifecycle and rendering logic?


## Functional stateless components

For many developers, when discovering and learning react, what very quickly feels good is its declarative nature: you only focus on what to render given a particular map of props, without having to think about any updating logic and component lifecycle. At the heart of React is functional programming -_if you have missed it I encourage you to read [Understanding the functional revolution in front-end applications](/posts/2015/09/15/understanding-the-functional-revolution/)_-, but yet components themselves are not functional in the way they are written.

Functional stateless components were introduced in React 0.14 and they are a much more desirable and natural way to write components:

```javascript
import React from 'react';

export default function MyComponent(props) {
    const { firstName } = props;

    return <div>Hello { firstName }</div>;
}
```

They have two main advantages:
- The first one is their nature: they are written as pure functions, increasing predictability and testability. By being stateless, they encourage you to separate data from presentation, preventing React to become more than a view layer.
- The second will be performance: according to React's doc, performance optimizations around those type of components will be possible in the future. No much more details are given, but performance will probably come from immutability (shallow comparing props, memoizing render functions).


### Functional stateless application?

Now, let's imagine we want to build an entire application with functional stateless components. It makes our application a functional component itself, but is it possible?

Yes, it is. Except... props at the top need to come from somewhere. But let's forget about that for a moment, and let's focus on the practicality of a functional stateless component as an app.

On each data update, we have to re-render from the top node. This is actually OK, depending on the complexity of your app or if we are able to optimize re-computation of the entier virtual DOM tree. Unfortunately, with functional stateless components we cannot implement `shouldComponentUpdate` and therefore we are unable to skip entire subtrees of our application during a rendering phase.

However, since the DOM will only be patched if something has really changed, performance is less an issue than you might think. In fact, the real issue with an application made only of functional stateless components is that you have to explicitly pass properties from the root node all the way down:
- It is likely some data will have to travel a few nodes down before being consumed, forcing components to be aware of data they don't need: it harms reusability and composability of components.
- As you incrementally develop your application, refactoring data names and components will cause you to back and forth components in order to maintain your application


### Functional stateless subtrees!

When developing a product and therefore a User Interface, we always slice our data and UI in small business logic units. Think about the different stores of a Flux application, the different combined reducers of a redux tree, etc...

In practice an application is made of subtrees of components, defining portions of your view and depending on different slices of data. Those subtrees can be made of functional stateless components, but how do we connect them to the data they need?


## Higher-order components

The first thing we could think of is to modify the top component of a tree or subtree and make it a traditional React component using `createClass` or defining a class extending `React.Component`, so we can have access to lifecycle hooks and `setState`. By doing so we introduce a couple of overheads:
- Refactoring from stateless to non-stateless: what if we need to do it multiple times as our subtree evolves?
- We are coupling rendering logic with non-rendering logic, decreasing re-usability.

You already know the solution since you've read the title of this blog article: higher-order components. But what are they? In functional programming, a higher-order function is a function which takes another function and / or returns a function. Replace function by component and you have the definition of a higher-order component.

> A higher-order component doesn't exist on its own. It is used to create a new component out of another component, called base component.

A functional stateless component (either a leaf, a subtree or an entire tree) defines the rendering logic. A higher-order component brings data dependencies, behaviour, lifecycle management and updating logic to that component. Coupled together, they form an _enhanced_, _smarter_ component that you can include in your application tree. This pattern is sometimes incorrectly referred as smart vs dumb components: all our components are dumb in the sense that they receive data from their owner. The nature of their owner cannot make them smart.

A higher-order component can grab any data (application state, route, `window` properties, etc...) and hands them as properties to their instantiated their base component, alongside the properties it itself receives: this is what __property injection__ is, it is a way to perform __sideways data loading__.


### Anatomy of a higher-order component

In practice, the easiest way to use higher-order components is with factory functions: using a closure, a function takes a base component and returns the combo higher-order component + base component.

Within your HOC, you should tie your data subscribing / listening logic to the component mounting and unmounting hooks, and define its initial state in its constructor. This will guarantee its compatibility with server-side rendering (for univeral / isomorphic apps).

```javascript
import { createElement, Component } from 'react';

export default myHoc(BaseComponent) {
    class MyHoc extends Component {
        constructor(props) {
            super(props);
            // Define initial state
            this.state = {
                /* ... */
            };
        }

        componentWillMount() {
            // Subscribe / listen to the data
            // call setState with new data
            when changes are detected
        }

        componentWillUnmount() {
            // Teardown any subscribtions and listeners
        }

        render() {
            const { props, state } = this;
            return createElement(BaseComponent, { ...props, ...state });
        }
    }

    return MyHoc;
}
```

You can use the higher-order component above as follow: create your functional stateless component and export it as a named export for testing purposes, then export your enhanced component for using in your app.

```javascript
import React from 'react';
import myHoc from './my-hoc';

export function MyComponent(props) {
    /* Render component */
}

export default myHoc(MyComponent);
```

### Making your subtree "pure"

We've talked about our subtrees being an unit of business logic, sharing the same data dependency and made of functional stateless components. On a render, if the next properties or state are no different than the current one, there is no reason to re-compute your entire subtree. The top of your subtree is therefore the perfect place for implementing `shouldComponentUpdate`: this can be done inside your higher-order component, or you can use the `pure` HOC from [recompose](https://github.com/acdlite/recompose).

In your higher-order component:

```javascript
import { createElement, Component } from 'react';

export default myHoc(BaseComponent) {
    class MyHoc extends Component {
        /* ... */

        shouldComponentUpdate(nextProp, nextState) {
            // You can make it "pure":
            // Shallow compare this.props with nextProps
            // and this.state with nextState
            // Return true if different, false otherwise
        }

        /* ... */
    }

    return MyHoc;
}
```

With `pure` (more DRY and composable):

```javascript
import React from 'react';
import myHoc from './my-hoc';

export function MyComponent(props) {
    /* Render component */
}

export default myHoc(pure(MyComponent));
```


## Applications

Flux store, state slice, abstracting state, time-based contents
