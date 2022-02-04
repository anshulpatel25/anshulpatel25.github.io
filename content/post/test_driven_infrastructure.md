+++
author = "Anshul Patel"
date = 2017-02-14
showthedate = true
title = "DevOps: Test Driven Infrastructure using Serverspec"
tags = [
    "devops",
    "serverspec",
    "github",
    "travisci",
    "tdd"
]
+++

Infrastructure-as-code provides a mechanism to apply changes to the system in a comprehensive manner so that the system reaches a desirable state.

<!--more-->

## Advantages of Infra-as-Code

* Quick provisioning of new servers.
* Quick recovery from critical events.
* No more Snowflake servers.
* Version control for server environments.
* Like traditional code, it also requires testing to maintain its quality and integrity.
* Auditable Infrastructure.

## Serverspec

Serverspec provides a way to write RSpec test cases to validate the configuration of the system. It tests the server against its actual state by executing command locally, via SSH, via WinRM, via Docker API, etc.

Serverspec doesn't require any agent software on the system, providing flexibility to use any of the configuration management systems like Puppet, Chef, Ansible, BASH, etc.

### Advantages of TDI

* Higher Code Quality
* Regression Test suite
* Feedback and Confidence

## Architecture

![Architecture](/img/test_driven_infrastructure.png)

Explanation

* Configuration management (Puppet, Chef, Salt, Ansible, BASH, etc) script is checked into GitHub repository.
* GitHub initiates CI process and spawns a VM (AWS EC2, Vagrant, VirtualBox, VMware). It applies the configuration management script to the VM and executes the test cases defined as per Serverspec.
* If the test cases are successful, then CI process is marked as Passed.
