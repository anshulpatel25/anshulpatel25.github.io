+++
author = "Anshul Patel"
date = 2018-04-24
showthedate = true
title = "Site Reliability: Fault Tolerance, High Availability & Disaster Recovery"
tags = [
    "devops",
    "sitereliability",
    "postmortem",
    "scalability",
    "highavailability",
    "faulttolerance",
    "disasterrecovery"
]
+++

This article discusses the subtle differences between fault tolerance, disaster recovery and high availability.

<!--more-->

## Fault Tolerance

* Fault tolerant system continues to operate either in optimal or degraded state even after facing single or multiple failures.
* Fault tolerant system strives for zero downtime.
* Replicating same component is not enough to achieve fault tolerance, rather multiple components make the overall system fault tolerant.

![Fault Tolerance](/img/airplane-fault-tolerance.jpg)



## High Availability

* Highly available system doesn't prevent outages. 
* Highly available system does guarantee that outages will be brief, because it will not take much time to redeploy the required component. Generally failover from outage is automatic.
* Multiple components can be designed to be highly available to make the overall system fault tolerant.

![High Availability](/img/jeep-ha.jpg)



## Disaster Recovery

* Murphy's law `whatever can go wrong, will go wrong`. If failures of system are not addressed, it will eventually lead to system outage.
* Disaster Recovery is about set of policies and procedures about recovering data from failed infrastructure caused by disruptive events such as power outage, flood or cyberattack. 
* Recovered/Backedup data is generally migrated/moved to new infrastructure.

![Disaster Recovery](/img/disaster-recovery-ejection.jpg)