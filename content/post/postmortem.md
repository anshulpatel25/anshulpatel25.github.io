+++
author = "Anshul Patel"
date = 2016-12-23
showthedate = true
title = "Site Reliability: Postmortem Culture"
tags = [
    "devops",
    "sitereliability",
    "postmortem",
    "continuousintegration",
    "continuousdelivery",
    "continuousdeployment",
    "scalability"
]
+++

[Continuous Integration](http://martinfowler.com/articles/continuousIntegration.html) and [Continuous Delivery](http://martinfowler.com/bliki/ContinuousDelivery.html) enabled the frequent release and deployment of software platforms and services.

Such frequency of updates and introduction of new Software, have made the failure inevitable.

<!--more-->

# What is Postmortem Report ?

Definition from *Google SRE Team* :

A postmortem is a written record of an incident, its impact, the actions taken to mitigate  or resolve it, the root cause, and follow-up actions to prevent the incident from recurring.

# When to create Postmortem Report ?

* Service Downtime.

* Service Degradation beyond acceptable threshold.

* Data loss.

* Monitoring System Failure.

* Release Rollback.

# Characteristics of Postmortem Report

* Reports should be blameless.

* Focus should be on identifying the cause and solution of the incident without pointing out any individual or team.

* Report should not be seen as weakness but as an opportunity to make the Software Architecture more resilient to failure.

# Minimal Postmortem Report


**Issue** : *R2D2APIGateway* down for 5 minutes (Github Issue : #2592)

**Date** : 24-12-2016

**Authors** : Anshul Patel

**Impact** : 50K API requests lost

**Root Cause** : Increased Traffic triggered kernel OOM.

**Resolution** :
1. Updated the Machine family from t2.large to m4.xlarge. *R2D2APIGateway* now has capacity to handle 5X traffic surge. (Github Issue: #2595)

**Detection** : Monitoring System detected timeouts for queries to *R2D2APIGateway*.

**Follow-Up Actions**: Update the machine family in the Infrastructure-as-code scripts to prevent the same in future. (Github Issue: #2598)
