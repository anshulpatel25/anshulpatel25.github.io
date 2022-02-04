+++
author = "Anshul Patel"
date = 2018-07-03
showthedate = true
title = "Site Reliability: Releasing IPLocator utility"
tags = [
    "devops",
    "sitereliability",
    "networking"
]
+++

IPLocator is tool which provides meta information regarding domain location such as ASN, ISP, ISP Latitude, ISP Longitude, Country, Timezone, etc ..

<!--more-->

## Why?

- To find location related information, I had to search for such webapp on Google and then browse to that website to get the details.
- To simplify the above process and to sharp up my Golang skill, decided to write this utility.


## Compile and Installation

- Clone the code

{{< highlight bash >}}
λ git clone https://github.com/anshulpatel25/iplocator.git
{{< /highlight >}}

- Compile the code

{{< highlight bash >}}
λ go build -o iplocator
{{< /highlight >}}

- For Linux/Mac, add executable permission and move in the `/usr/bin`

{{< highlight bash >}}
λ chmod +x iplocator && mv iplocator /usr/bin
{{< /highlight >}}


## Usage

- Running the utility

{{< highlight bash >}}
λ iplocator.exe paytm.com
As AS16509 Amazon.com, Inc.
City Singapore
Country Singapore
CountryCode SG
Isp Amazon.com
Lat 1.2931
Lon 103.8558
Org Amazon.com
Query 52.220.83.85
Region 01
RegionName Central Singapore Community Development Council
Status success
Timezone Asia/Singapore
Zip 
{{< /highlight >}}

## Resources

- [**iplocator**](https://github.com/anshulpatel25/iplocator)
- [**Issues**](https://github.com/anshulpatel25/iplocator/issues)

