---
title: "Postmortem Culture"
date: 2016-12-23T00:00:00+05:30
tags:
  - "sitereliability"
---

[Continuous Integration](http://martinfowler.com/articles/continuousIntegration.html)
and [Continuous Delivery](http://martinfowler.com/bliki/ContinuousDelivery.html)
enabled the frequent release and deployment of software platforms and services.

Such frequency of updates and introduction of new Software, have made the
failure inevitable.

<!--more-->

## What is Postmortem Report ?

Definition from _Google SRE Team_ :

A postmortem is a written record of an incident, its impact, the actions taken
to mitigate or resolve it, the root cause, and follow-up actions to prevent
the incident from recurring.

## When to create Postmortem Report ?

- Service Downtime.

- Service Degradation beyond acceptable threshold.

- Data loss.

- Monitoring System Failure.

- Release Rollback.

## Characteristics of Postmortem Report

- Reports should be blameless.

- Focus should be on identifying the cause and solution of the incident without
  pointing out any individual or team.

- Report should not be seen as weakness but as an opportunity to make the
  Software Architecture more resilient to failure.

## Minimal Postmortem Report

**Issue** : _R2D2APIGateway_ down for 5 minutes (Github Issue : #2592)

**Date** : 24-12-2016

**Authors** : Anshul Patel

**Impact** : 50K API requests lost

**Root Cause** : Increased Traffic triggered kernel OOM.

**Resolution** :

Updated the Machine family from t2.large to m4.xlarge. _R2D2APIGateway_ now
has capacity to handle 5X traffic surge. (Github Issue: #2595)

**Detection** : Monitoring System detected timeouts for queries to
_R2D2APIGateway_.

**Follow-Up Actions**: Update the machine family in the Infrastructure-as-code
scripts to prevent the same in future. (Github Issue: #2598)
