+++
author = "Anshul Patel"
date = 2017-11-25
showthedate = true
title = "DevOps: Dynamically provision subdomain for SaaS platform with AWS"
tags = [
    "devops",
    "aws",
    "scalability",
    "saas",
    "route53"
    ]
+++

SaaS platform generally has multiple tenants. General practice is to provide dedicated subdomain for each tenant. For eg. `<tenant-name>.<domain>.com`. This article describes about how it can be achieved via AWS Route 53 wildcard DNS entry.

<!--more-->

### Implementing Dynamic subdomain has several challenges

* How the new subdomain will be configured and published in DNS?
* How does SSL certificate gets signed for every new subdomain?
* How the new subdomain is configured and published on Webserver?
* How does the SaaS web-tier know about the new subdomain?


Enter the `wildcard` DNS record. A wildcard DNS record matches any subdomain of that domain name.

```
*.anshulpatel.in -> 169.254.169.254
```

This means any subdomain for `anshulpatel.in` will now resolve to `169.254.169.254`.  For eg:

![subdomain_saas](/img/subdomain_saas.png)


### Creating Wildcard DNS in AWS Route 53

* Create a Public/Private Hosted Zone.

* Create a record set with `*` in the above hosted zone and map it to server or ELB.


![saas_route53](/img/saas_route53.png)


### Testing the Setup

For testing the setup, below python script which is based on [Flask](http://flask.pocoo.org/) framework can be used.


{{< gist anshulpatel25 e5988d5d9e50c6529fca89f422ca5686 >}}


#### Output

From the below output we can confirm that we are able to route to subdomain on-the-fly and also fetch the information regarding the subdomain.

{{< highlight bash >}}
[ec2-user@ip-172-31-56-134 ~]$ curl http://amazon.anshulpatel.in
Tenant Name:amazon
[ec2-user@ip-172-31-56-134 ~]$ curl http://facebook.anshulpatel.in
Tenant Name:facebook
[ec2-user@ip-172-31-56-134 ~]$ curl http://google.anshulpatel.in
Tenant Name:google
{{< /highlight >}}


### Reference(s)

* [Intuit blog](https://developer.intuit.com/hub/blog/2014/03/06/guest-post-dynamically-provisioning-subdomains-for-saas-products)
