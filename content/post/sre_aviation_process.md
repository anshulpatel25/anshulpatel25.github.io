+++
author = "Anshul Patel"
date = 2019-04-10
showthedate = true
title = "What SREs can learn from Aviation industry?"
tags = [
    "devops",
    "sre",
    "sitereliablity",
    "disasterrecovery"
]
+++

Recently having binged watch [Air Emergency](https://www.imdb.com/title/tt0386950/), I felt that [SREs](https://landing.google.com/sre/) can learn many things from aviation industry.

<!--more-->


* Like modern aircraft, modern runtimes and operating systems are sophisticated, complex and they just don't crash or behave weirdly.

* Just as aircraft have cockpit voice recorders and black boxes, modern systems should improve logging as the overall system matures for quick and meticulous post-incident analysis.

* Pilots are well aware of the importance of each subsystem of aircraft and the impact of its failure. Similarly, SREs should be well aware of the subsystems and impact of its failure. I prefer to name changes which can have a significant impact on the overall system and can lead to SLA breaches as __*sensitive changes*__.

* Just as aircraft have pre-flight, in-flight, emergency-checklist and post-flight checklist, similar checklists should be prepared and executed by SREs before performing, while performing and after performing sensitive changes on the system. SREs should also maintain an emergency-checklist which should be executed in an event if sensitive changes go wrong.

* Just as aircraft subsystems are passed through simulations, sensitive changes should be simulated before applying it to the overall system.

* Just as pilots makes decision-based on several input parameters like aircraft instrument cluster, inputs from air traffic controller, weather information, etc. SREs should also consider analyzing information from various tools before reaching the decision. If the required tooling is unavailable, they should step forward and develop those tools.

* Pilots, SREs are humans and humans are flawed to make mistakes, so like Pilots, SREs should be focussed while performing any kind of sensitive changes to systems or as [Spock](https://en.wikipedia.org/wiki/Spock) would say it, they shouldn't be [emotionally compromised](https://www.youtube.com/watch?v=k9vHopyEtzs).

* Just as Transport Safety Boards amends the appropriate documents after investigating the air crash, similarly SREs should update corresponding system knowledge base, engineering practices, checklists after the postmortem and should be reviewed periodically by the peers.

* As Murphy's law states *"Anything that can go wrong, will go wrong"*. In such events, like pilots, SREs should rely on their knowledge, aptitude, and experience to solve these novel challenging situations.

{{< youtube Xs-PUqNsdn0 >}}
