+++
author = "Anshul Patel"
date = 2019-08-09
showthedate = true
title = "What are cloud-native applications?"
tags = [
 "scalability",
 "highavailability",
 "cloud"
 ]
+++


To understand the cloud-native, we should first understand the definition of the cloud.

[NIST](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-145.pdf) defines cloud computing characteristics as follows:

- Rapid elasticity
- On-demand self-service
- Broad network access
- Resource pooling
- Measured service

<!--more-->

![sla_meme](/img/cloud_native_meme.jpg)

Cloud-Native applications should be the applications which are designed and implemented to use and take advantage of the above cloud computing characteristics.

Cloud-Native applications should have the following characteristics:

### Immutable Packaging & Execution

- Machine Images (For eg: AMI) and Container Images (For eg: Docker Image) allows us to bake the library dependencies along with the application. This allows the development to take advantage of `Rapid Elasticity`.
- Containers can be much more efficient than VMs as multiple containers can be executed on a single VM, hence further optimizing `Resource Pooling` characteristics.
- Functions as service (For eg: Lambda) can further optimize `Resource Pooling`.

### Decoupled Configurations & Secrets

- Immutability and elasticity make it difficult to add configuration as part of code, hence centralized K/V store (For eg: Hashicorp Consul) and secrets engine (For eg: Hashicorp Vault, AWS KMS) should be implemented.
- The application should fetch the secrets and K/V from the above engines, providing on-demand flexibility to append, update secrets and K/V.

### Statelessness & Statefulness

- `Rapid Elasticity` makes it somewhat difficult to couple data with the applications. The stateful landscape is still work-in-progress and unstable. Till the time it becomes stable, applications should use external storage, queuing and search engine systems (For eg: Redis, RabbitMQ, Kafka, MySQL, Cassandra, Elasticsearch, etc).

### Modular Applications

- Problem with monoliths was that even if we need to scale only one module ( For eg: Payment), we need to replicate/scale the whole monolith which defeats the purpose of `Resource Pooling`
- Microservices and MicroFrontends can provide better `Resource Pooling` by running containers/functions on the same VMs. Also scaling Microservices becomes easy as it is independent/loosely coupled and performs single functionality of the domain. (For eg: In Ecommerce domain, single functionality can be Payment, Checkout, Carts, Orders, Shipping, etc). Most of the modern-day storage systems are multi-tenant, hence multiple applications can take advantage of this multi-tenancy (`Resource Pooling`)characteristics.

### Polyglot Paradigm

- Probably the best thing of using this paradigm. As dependencies are packaged along with the application and are isolated from the underlying execution environment, the development team can use their language of choice to write their modules and achieve their use case.

### Centralized Logging

- Due to `Rapid Elasticity`, it can be difficult for the development team to track down the problematic machine and view its logs, as it wouldn't be secure as well as convenient to hand out production machine access (For eg: SSH) to different development teams.
- Almost all major cloud providers provide a service which can ingest log or log-like data. (For eg: Cloudwatch logs, ELK)
- Applications should forward their logs to centralized logging service.
- `On-demand self-service` centralized logging solution can be used by development teams to securely and conveniently access the production logs.

### Managed via DevOps & SRE processes

- Apps should use Continuous Integration
- Apps should use Continuous Delivery & Deployment via declarative infrastructure-as-code, configuration management.
- Important metrics should be `Measured` for monitoring and observing application.
- Deployment patterns such as Rolling, Blue/Green, Canary should be practiced.
- Blameless postmortem should be promoted during application outage to make the application more resilient and robust.

### Automation

- All the processes, tools which are used for development, deployment and maintenance of the apps should be automated or have API(s) for automation via custom scripts.

### API centric

- Applications use well defined lightweight API on top of common protocols (For eg: REST, gRPC) for exchanging the data. The protocols used are intentionally language independent to support Polyglot Paradigm.
- API centric approach also promotes `Broad network access`, hence same API(s) can be consumed by Mobiles, IoT devices, Servers and Development teams which then can use it for their scenarios.
