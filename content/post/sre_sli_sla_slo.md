+++
author = "Anshul Patel"
date = 2017-10-30
showthedate = true
title = "Site Reliability: SLI, SLO & SLA"
tags = [
    "devops",
    "sitereliability",
    "clustering",
    "highavailability",
    "scalability"
]
+++

Service Level Indicator(**SLI**), Service Level Object(**SLO**) & Service Level Agreement(**SLA**) are parameters with which reliability, availability and performance of the service are measured.

<!--more-->

![sla_meme](/img/sla_meme.jpg)

## Service Level Indicator

SLI are the parameters which indicates the successful transactions, requests served by the service over the predefined intervals of time. These parameters allows to measure much required performance and availability of the service. Measuring these parameters also enables to improve them gradually.

Key Examples are:

* Availability/Uptime of the service.
* Number of successful transactions/requests.
* Consistency and durability of the data.


## Service Level Objective

SLO defines the acceptable downtime of the service. For multiple components of the service, there can be different parameters which defines the acceptable downtime. It is common pattern to start with low SLO and gradually increase it.

Key Examples are:

  * Durability of disks should be 99.9%.
  * Availability of service should be 99.95%
  * Service should successfully serve 99.999% requests/transactions.


## Service Level Agreement

SLA defines the penalty that service provider should pay in an event of service unavailability for pre-defined period of time. Service provider should clearly define the failure factors for which they will be accountable(Domain of responsibility). It is common pattern to have loose SLA than SLO, for instance: SLA is 99% and SLO is 99.5%. If the service is overly available, then SLA/SLO can be used as error budget to deploy complex releases to production.

Key Examples of Penalty are:

* Partial refund of service subscription fee.
* Additional subscription time added for free.

## Insightful References

* [Google CRE Life Lessons](https://cloudplatform.googleblog.com/2017/01/availability-part-deux--CRE-life-lessons.html)


* {{< youtube LKpIirL8f-I >}}
