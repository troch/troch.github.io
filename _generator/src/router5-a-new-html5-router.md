---
title: Router 5 a new framework-agnostic HTML5 router
lunr: true
draft: false
date: 2015-07-11 00:00:00
author: Thomas Roch
metaTags: router,html5,nested,routes,path,tree,component,reactive,react,framework-agnostic
tags: javascript,router,HTML5,front-end
image: https://raw.githubusercontent.com/router5/router5.github.io/master/logo/r5_128.png
---

# Router5: a new HTML5 router

I imagine a lot of developers who will see for the first time [router5](http://router5.github.io) will ask themselves the following question:
is it yet another router? is it any good? Why oh why do people keep writing new routers all the time?

It is not always easy to see the potential of something straight away, or understand the motivations behind. I therefore decided
to try to tell you more about router5, why I decided to develop an entire new routing solution, and what problems it tries to solve.


## Being reactive

Observable patterns and functional reactive programming are becoming more and more popular. So I started to use React. Before React,
I have heavily used Angular. I still do, and I'll probably continue to do so with Angular2. Coming from Angular, I started to look
for a routing solution in React and used the most popular one: [react-router](https://github.com/rackt/react-router).
React-router is a great tool, and it is easy to use: like in [ui-router](https://github.com/angular-ui/ui-router) or ngRoute,
I can simply tell it what component / view to render for each route.

I became increasingly keen on using more observables and observers in my application, testing Flux patterns.
Very soon, I found my application disjointed: using nice observable patterns for data with sideways data loading,
but giving away control on routing.

I realised that in order to treat route changes like data changes, I would need a router which would favour __convention over
configuration__.


## Existing routers are black boxes

The most popular routers those days are tied to frameworks (or libraries) and are fairly large pieces of software, tightly coupled together.
Angular2 and Aurelia, for example, include their own routing solution with exciting new functionalities: activation / deactivation, use
of pipelines, etc...

Routers in Angular1, Angular2, Aurelia, Ember, React... have all something in common: they implement everything from path recognition
to navigation and history management. They all share similar concepts or technical hurdles, but share very little code or conventions.


## Making the same mistakes?

I came across [routington](https://github.com/pillarjs/routington) thanks to the late [DailyJS](http://dailyjs.com/).
It is a trie-based URL router: it organises URLs in a tree. The concept is great, and I thought it could be enhanced by organising
named routes in a tree rather than URL segments. That way, every branch of a named routes tree is a valid route.
From an application point of view, it also means it is more maintainable: you reference routes by name rather
than URL.

> Using a tree makes building and matching paths easy. It also goes hand in hand with a component tree. If one can do sideways data loading,
  why not do sideways route loading, or compose the two?

From routington came [route-node](https://github.com/troch/router5). I then needed to use a URL parsing library. I looked at
[route-parser](https://github.com/rcs/route-parser), [url-pattern](https://github.com/snd/url-pattern) and
[path-to-regexp](https://github.com/pillarjs/path-to-regexp). Having routes in a tree, I needed a library which could match
URLs fully or partially (going down the tree until a match is found), I also needed to generate URLs by passing parameters.

None of the libraries mentioned could do all of that, so I wrote [path-parser](https://github.com/troch/path-parser).

![Standards](https://imgs.xkcd.com/comics/standards.png)

## router5: framework-agnostic and reactive

_router5_ is built on tope of route-node and path-parser. It delegates route management and route matching / building
and focus on navigation, history and triggering listeners. Its strength comes from the three different types of listeners it can register:

- Listeners triggered for every route change
- Listeners listening to a specific route
- Listeners being triggered on the lowest common node between the previous and the current route: this listener is aimed at minimizing an application
re-render on a route change.

![Navigation from 'users.view' to 'orders.completed'](https://raw.githubusercontent.com/router5/router5.github.io/master/img/deactivation-activation-path.png)

When navigation from _users.view_ to _orders.completed_:

- &#x2713; `.addListener(fn)` will be called
- &#x2713; `.addNodeListener('', fn)` will be called
- &#x2713; `.addRouteListener('orders.completed', fn)` will be called


![Navigation from 'orders.completed' to 'orders.pending'](https://raw.githubusercontent.com/router5/router5.github.io/master/img/deactivation-activation-path-2.png)

When navigation from _orders.completed_ to _orders.pending_:

- &#x2713; `.addListener(fn)` will be called
- &#x2713; `.addNodeListener('orders', fn)` will be called
- &#x2713; `.addRouteListener('orders.pending', fn)` will be called


## Links

- [router5 on Github](https://github.com/router)
- [router5 website](http://router5.github.io)
- [Example with React](http://router5.github.io/docs/with-react.html)
- [Example with Deku](http://router5.github.io/docs/with-deku.html)
