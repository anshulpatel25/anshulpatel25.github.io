---
title: "Linux CPU Terminologies Explained"
date: 2017-04-11T00:00:00+05:30
tags:
  - "linux"
  - "performance"
---

Linux based systems uses defined terminologies for different components of
processors.

<!--more-->

**Chip**: Chip or CPU chip is Integrated Circuit (IC) which encompasses single
or multiple cores.

**Sockets**: Socket is a physical connector on Motherboard that accepts
the chip. Motherboards can have multiple sockets.

**Core**: A core is basic computation unit of CPU capable of running
single program context.

**HyperThreading**: Hyperthreading is the capability of a Core to run
multiple program context. It makes single core appear
logically as multiple cores on the same chip.

**Processor**: Processor can be defined as either single core or multicore chip.

**Processes**: A process is a program running on the computer.
It has memory stack associated with it.

**Threads**: A thread is a process that doesn't have memory stack associated
with it. A thread is tied to a parent process.
Threads can execute simultaneously on separate cores.

![cpu_single_multi_core](/images/cpu_single_multi_core.png)
