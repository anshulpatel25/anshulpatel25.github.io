+++
author = "Anshul Patel"
date = 2018-01-21
showthedate = true
title = "CloudNative: Tracing requests across Microservices with Opentracing"
tags = [
    "devops",
    "cloudnative",
    "microservices",
    "containers",
    "docker",
    "python",
    "opentracing"
    ]
+++

Engineering organizations are trading the old monoliths with Microservices for scalability, reliability and agility, but debugging the system calls across the Microservices is not straight-forward. Opentracing provides framework to debug and trace the system calls across the Microservices.

<!--more-->

![opentracing_meme](/img/opentracing_meme.jpg)

__Major debugging issues which engineering teams face after splitting the monolith into microservices are following:__

* User-Facing latency optimization
* Root Cause Analysis of backend errors
* Communication issues between the distinct components



__Famous distributed tracing systems__

* Zipkin
* Dapper
* Jaeger
* Appdash
* Opentracing


## Why Opentracing?

* It offers consistent, expressive, vendor-neutral APIs for popular platforms(GoKit, Flask, GRPC, django, dropwizard, etc)
* It makes it easy for engineering teams to switch implementations with just a configuration change.(Appdash, Jaeger, Instana, Zipkin, Datadog, etc)


## Opentracing Concepts

* __Trace__ : It is directed acyclic graph of spans which represents the transaction/workflow propagating through the system.
* __Span__ : Span is encapsulation of operation-time, start timestamp, finish timestamp, tags and context. It represents a segment of work performed in the trace.


## Example

Lets say we have 3 Microservices

* __PaymentService__ : It performs the payment action.
* __OrderService__ : It performs the order action.
* __MyService__ : It calls the payment and order actions.

__*Source Code*__ : https://github.com/anshulpatel25/distributed_tracing

We will be using above source code to get the execution time for PaymentService and OrderService, when they are called from the MyService.

### Output

![opentracing](/img/opentracing.png)


__From the above Gantt chart we can observe the following:__

* __Total execution time:__ 14.03s
* __Time taken by OrderService:__ 4.01s
* __Response code from OrderService:__ 200 OK
* __Time taken by PaymentService:__ 10.02s
* __Response code from PaymentService:__ 200 OK


### Reference(s)

* [Opentracing](http://opentracing.io/documentation/)
* [ScoutApp](http://blog.scoutapp.com/articles/2018/01/15/tutorial-tracing-python-flask-requests-with-opentracing)
