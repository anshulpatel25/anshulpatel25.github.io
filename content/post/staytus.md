+++
author = "Anshul Patel"
date = 2016-11-14
showthedate = true
title = "Site Reliability: Status Page for Cloud Services"
tags = [
    "sitereliability",
    "monitoring",
    "staytus",
    "postmortem",
    "scalability"
]
+++

Public cloud services are growing at [16% annually](http://www.gartner.com/newsroom/id/3188817). Cloud services can be directly used by end-user or are integrated into third-party applications. Due to this heavy reliance on Cloud services, effective downtime communication becomes top priority for keeping customers happy, building trust and creating customer transperancy.

<!--more-->

[Staytus.co](http://staytus.co/) provides simple and open-source way to create status page for your services and helps in keeping customers as well as development team informed.


**Characteristics of Staytus**

* Provides beautiful dashboard for conveying service status.

![Dashboard](/img/staytus_dashboard.png)

* Provides facility to add/update new services, users, email-templates and design.

![Admin](/img/staytus_admin_acl.png)

* Provides interface for creating, updating and publishing issues.

![Issue](/img/staytus_issue.png)

* Provides interface for creating, updating and publishing maintenance sessions.

![Maintenance](/img/staytus_maintenance.png)

* Provides facility to update the status of the services from external applications and monitoring systems via [JSON API](https://github.com/adamcooke/staytus/tree/master/doc/api).
