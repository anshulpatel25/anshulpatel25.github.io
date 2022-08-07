---
title: "Designing a Chaos Engineering Experiment"
date: 2018-01-01T00:00:00+05:30
tags:
  - "sitereliability"
  - "scalability"
  - "chaosengineering"
  - "highavailability"
  - "continuousdelivery"
---

Chaos engineering is the discipline of experimenting on a distributed system,
in order to build confidence in the system’s capability to withstand turbulent
conditions in production.

<!--more-->

![keep_calm_chaos_reign](/images/keep_calm.png)

Following things should be kept in mind while designing a **Chaos Experiment**:

## 1. Pick a Hypothesis

This step involves the selection of hypothesis which is required to be tested.

**For eg:**

- Verifying that terminating/shutting half of the EC2 instances belonging to
  Auto-Scaling Group of particular service won't cause service outage.

## 2. Identify the metrics to monitor for the experiment

This steps discusses about the metrics which will enable you to evaluate the
outcome of the experiment.

**For eg:**

- Terminating half of the instances in Auto-Scaling group of the service might
  result in the following scenarios:

  - 25% increase in response latency of the service.

  - 30% increase in CPU utilization of existing machines.

## 3. Notify the involved Business Units

This is an important step which discusses about notifying the
**Service Business Unit** so that all the teams around that service
are aware of following:

- What is that you will be performing on the service?
- Why are you performing it on the service?
- When you will be peforming it on the service?

## 4. Run the experiment

This step involves to run the chaos experiment and observe the metrics.

If you're running the experiment in the production, ability to abort/stop the
experiment could help in preventing unnecessary harm if experiment
doesn't execute as per the plan.

## 5. Analyze the results

In this step, you gather the metrics to answer the following question:

- Was the hypothesis correct?
- Was the service resilient to the chaos/failure events that were
  injected/exposed to it?
- Did anything happen that shouldn't happen?

## 6. Automate the process

Once you've confidence in manually running your chaos experiments, automating
the same with scripts and workflow engine can help you run the experiments
regularly and automatically.

## Famous Chaos Engineering Tools

- [Chaos Monkey](https://github.com/Netflix/chaosmonkey)
- [Blockade](https://github.com/worstcase/blockade)
- [Chaos Lambda](https://github.com/bbc/chaos-lambda)
- [Chaos Lemur](https://github.com/strepsirrhini-army/chaos-lemur)

## References

- [Awesome-Chaos-Engineering](https://github.com/dastergon/awesome-chaos-engineering)
