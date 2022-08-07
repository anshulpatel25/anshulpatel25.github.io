---
title: "Semantic Versioning Simplified"
date: 2016-12-11T00:00:00+05:30
tags:
  - "devops"
---

Software Versioning makes it easy and convenient to track, test, deploy, patch,
and rollback features, enhancements and bug/fixes across variety of
environmentsin [Software Supply Chain](https://youtu.be/XM1HRy7aJxE).

Semantic Versioning provides an efficient and effective framework to version
the software products, so that the infamous
[Dependency Hell](https://en.wikipedia.org/wiki/Dependency_hell)
can be avoided.

<!--more-->

## What is Semantic Versioning ?

Semantic Versioning uses MAJOR.MINOR.PATCH number scheme
for software products . For Eg: 2.0.5

![Semantic Versioning](/images/semantic_versioning.png)

## How to decide when to update the version numbers ?

Increment PATCH number during:

- Backward Compatible Bug Fix.
- Backward Compatible Maintenance Release.
- Backward Compatible Hot Fix.

Increment MINOR number during:

- Backward Compatible new Framework Adoption.
- Backward Compatible new Functionality Implementation.
- Backward Compatible Framework Enhancement.
- Backward Compatible Functionality Enhancement.

Note: PATCH should be reset to 0 when MINOR is incremented.

Increment MAJOR number during:

- Any Backward Incompatible change.
- MAJOR zero (0.Y.Z) should be considered for development.
  Product shouldn't be considered stable and shouldn't be
  deployed on Production.

Note: PATH, MINOR both should be reset to 0 when MAJOR is incremented.

## What about versioning during Continuous Integrations (CI) ?

Pre-release numbers with Semantic Versioning can tackle the problem of
versioning during CI.

For Eg: X.Y.Z-${CI_BUILD_NUMBER}, 2.0.5-1992

Once the software product is ready for prime time, pre-release number
should be removed and product should be published/released to
external repository.

Note: Once the package is released/published, it MUST NOT be modified.
Any modifications MUST be released as a new version.
