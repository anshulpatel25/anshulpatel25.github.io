+++
author = "Anshul Patel"
date = 2016-10-23
showthedate = true
title = "Apache Mesos: Basic Performance Metrics"
tags = [
    "monitoring",
    "grafana",
    "mesos",
    "docker",
    "metrics",
    "performance"
]
+++

Apache Mesos abstracts CPU, memory, storage and other compute resources from machines(physical or virtual), providing resource management and scheduling across entire data centers and cloud environment.

<!--more-->

For smooth operations and up-time of Apache Mesos, collecting the right data can play crucial role in business up-time and debugging process. We will be classifying basic Apache Mesos metrics into following categories for alerting:

**1) Work Metrics** - It indicates top-level health of your system. It describes the overall efficiency and performance of the Apache Mesos cluster. Alerting should be done if any of the below mentioned metrics crosses a predefined threshold.

* Tasks Failed

* Tasks Error

* Tasks Lost

* Tasks Running

**2) Resource Metrics** - It describes the cluster-level resource consumption and utilization. Starvation of resources can affect the up-time of the system. Alerting should be done if the below mentioned metrics crosses predefined threshold.

* Cluster CPU

* Cluster Disk

* Cluster Memory

**3) Events** - It describes the changes in system's behavior, like agents disconnecting or becoming inactive. If the majority of agent fails, then it can result in increased cluster load and unacceptable user experience. Alerting should be done if the below mentioned metrics crosses predefined threshold.

* Slaves_Disconnected

* Slaves_Inactive

* Slaves_Active


![apache_mesos_grafana](/img/apache_mesos_grafana.png)
