---
title: "How Linux calculates CPU utilization"
date: 2019-05-17T00:00:00+05:30
tags:
  - "linux"
  - "performance"
---

This article discusses the internals about how Linux calculates CPU utilization
for a process.

<!--more-->

## What is Real time and Process time?

**Real Time**: It is an actual elapsed time that we observe on the wall clock.

**Process Time**: It is the amount of CPU time used by a process.

## What are Jiffies?

- Process Time in Linux is measured in Jiffies. Jiffies are measured in _"HZ"_.
- Jiffies value can be fetched via `sysconf(_SC_CLK_TCK)` system call.

```python
#!/usr/bin/env python3
import os
print(os.sysconf(os.sysconf_names['SC_CLK_TCK']))

# 100

# 1 second = 100 Jiffies
```

## How to fetch Jiffies in Linux?

- Total Jiffies for all CPU(s) and individual CPU can be fetched from
  `/proc/stat`.

```bash
$ cat /proc/stat | grep cpu

# CPU user nice system idle iowait irq softirq steal guest guest_nice

cpu 365430 546 105481 2862563 1252 0 10568 0 0 0
cpu0 47076 48 15238 743800 329 0 2116 0 0 0
cpu1 43550 43 14460 303602 26 0 1584 0 0 0
cpu2 46679 39 12309 302736 21 0 1053 0 0 0
cpu3 46041 72 12112 303436 15 0 636 0 0 0
cpu4 46400 90 13997 300582 568 0 661 0 0 0
cpu5 46818 16 13045 301880 188 0 2931 0 0 0
cpu6 44507 31 12307 302683 64 0 1213 0 0 0
cpu7 44356 58 12010 303840 38 0 370 0 0 0
```

- Jiffies for a particular process can be fetched from `/proc/{pid}/stat`.

```bash
cat /proc/3465/stat | awk '{print $14, $15, $16, $17}'

# User System User(Waited for Children) System(Waited for Children)

59175 13926 52717 10318
```

- Total and Process CPU time (User + System) can be sampled across pre-defined
  time interval to obtain the utilization.

_For eg_: If Total CPU time (User + System) across 8 cores is 450 Jiffies
_(sampled per second)_ and Process CPU time (User + System + User of Children +
System of Children) is 50 Jiffies _(sampled per second)_, then utilization in
percentage can be calculated as follows:

```bash
# Percentage = (100 * Process Jiffies)/Total CPU Jiffies

(100 * 50)/450 = 11.111%
```

- Jiffies can be converted to Real Time (seconds) via
  `(Jiffies/100) as 1 second = 100 Jiffies`, it may be greater than Real Time if
  a Process utilizes more than one CPU or Core.

## Golang Snippet

This Golang snippet samples CPU utilization per second.

{{<gist anshulpatel25 c596e322d8e64b2bd547d5bfa7bd59f2>}}

## Output

```bash
$ go run main.go

Enter the PID:3465

Logging CPU % for PID 3465
2.564103%
3.947368%
0.000000%
0.000000%
4.166667%
0.000000%
1.190476%
3.773585%
```
