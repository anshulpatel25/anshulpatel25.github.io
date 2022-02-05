+++
author = "Anshul Patel"
date = 2018-12-09
showthedate = true
title = "Create Self-Signed CA and TLS certificates using Terraform"
tags = [
    "devops",
    "secops",
    "networking",
    "security",
    "terraform"
]
+++

This article discusses the creation of Self-signed CA and TLS certificates using Terrform

<!--more-->


## How TLS Works?

TLS is an industry standward way to add encryption for data in transist.

* Certificate Authority (CA) is an entity responsible for issuing TLS certificates to websites or services.

* Private CA is developed by creating public/private key pair. Public portion is then published which is called CA certificate. Private Key is kept securely else attacker can use the Private Key to issue invalide/malicious TLS certificates.

* TLS certificate is developed by creating another public/private key, the public key is then signed by CA's private key and this signed public key becomes the TLS certificate. The private key will be used to decrypt the initial message encrypted by the TLS certificate and it should be kept securely.



## Why Private TLS?

* Generating private CA and TLS certificate is cost-efficient.
* Cost-efficieny allows to prototype TLS based application on internal environments before releasing or using actual production certificates.
* If application is privately used in Organization's infrastructure then Private TLS and CA could be more beneficial.


## Terraform TLS Module

[Terraform TLS](https://github.com/anshulpatel25/terraform-private-tls-cert) module provides an easy way to create CA and corresponding service certificates.

### Gist

{{< gist anshulpatel25 13097ff04c04732496258ac0ed24f1c3 >}}


Above example code creates the following:

* __ca.crt__ : CA certificate which will be included either in your Browser/OS keychain.
* __api.anveshak.in.crt__: Certificate for DNS `api.anveshak.in`.
* __api.anveshak.in.pem__: Private key for DNS `api.anveshak.in`.
* __www.anveshak.in.cr__: Certificate for DNS `www.anveshak.in`.
* __www.anveshak.in.pem__: Private key for DNS `www.anveshak.in`.

### Diagram

![private-tls](/img/private_tls.png)
