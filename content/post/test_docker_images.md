+++
author = "Anshul Patel"
date = 2018-01-04
showthedate = true
title = "DevOps: Validating Docker images with Dgoss"
tags = [
    "docker",
    "linux",
    "containers",
    "devops",
    "goss"
    ]
+++

[Goss](https://github.com/aelsabbahy/goss) is tool for validating server's configuration. [Dgoss](https://github.com/aelsabbahy/goss/tree/master/extras/dgoss) is wrapper written on top of the goss for validating docker images.

<!--more-->

Let's say we want to test the following `Dockerfile`.

{{< highlight dockerfile >}}
FROM golang as builder
WORKDIR /go/src/github.com/golang-rest-docker/
COPY main.go .
RUN go get
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .



FROM alpine
RUN apk --no-cache add ca-certificates
WORKDIR /
COPY --from=builder /go/src/github.com/golang-rest-docker/app .
CMD ["./app"]
{{< /highlight >}}

After building the above `Dockerfile` by executing  `docker build -t golang-rest:latest -f Dockerfile .`, generally we check for the following things:

* Check whether process is running or not?
* Check whether is TCP socket is up or not?
* Check whether application is responding with 200 status code?


## Writing Validation rules

DGoss provides interactive CLI for writing the validation rules.

* Start the interactive session with the following command.

{{< highlight bash >}}
dgoss edit golang-rest:latest
{{< /highlight >}}

* Add validation rule to check whether the process named `app` is running by executing `dgoss a process app` in the interactive session.

{{< highlight bash >}}

[vagrant@docker golang-rest-docker]$ dgoss edit golang-rest:latest
INFO: Starting docker container
INFO: Container ID: 1f5f05f3
INFO: Run goss add/autoadd to add resources
/goss $ goss a process app
Adding Process to './goss.yaml':

app:
  running: true

{{< /highlight >}}

* Add validation rule to check whether the TCP socket `8080` by executing
`dgoss a port 8080` in the interactive session.

{{< highlight bash >}}

/goss $ goss a port 8080
Adding Port to './goss.yaml':

tcp:8080:
  listening: false
  ip: []

{{< /highlight >}}

* Add validation rule to check whether application is responding with status code `200` by executing `goss a http http://localhost:8080`

{{< highlight bash >}}

/goss $ goss a http http://localhost:8080
Adding HTTP to './goss.yaml':

http://localhost:8080:
  status: 200
  allow-insecure: false
  no-follow-redirects: false
  timeout: 5000
  body: []

{{< /highlight >}}

* Exiting from interactive session will create `goss.yaml` in the current working directory.


{{< highlight bash >}}

/goss $ exit
INFO: Copied '/goss/goss.yaml' from container to '.'
INFO: Deleting container

[vagrant@docker golang-rest-docker]$ ls -l
total 12
-rw-rw-r-- 1 vagrant vagrant 307 Jan  2 16:59 Dockerfile
-rw-r--r-- 1 vagrant vagrant 219 Jan  2 17:20 goss.yaml
-rw-rw-r-- 1 vagrant vagrant 341 Jan  2 16:39 main.go

{{< /highlight >}}

* `goss.yaml` contains all the validation rules.

{{< highlight yaml >}}
port:
  tcp:8080:
    listening: false
    ip: []
process:
  app:
    running: true
http:
  http://localhost:8080:
    status: 200
    allow-insecure: false
    no-follow-redirects: false
    timeout: 5000
    body: []
{{< /highlight >}}

## Running Validation rules

* `dgoss run golang-rest:latest` will run the test cases.


{{< highlight bash >}}

[vagrant@docker golang-rest-docker]$ dgoss run golang-rest:latest
INFO: Starting docker container
INFO: Container ID: e674252d
INFO: Sleeping for 0.2
INFO: Running Tests
Process: app: running: matches expectation: [true]
Port: tcp:8080: listening: matches expectation: [false]
Port: tcp:8080: ip: skipped
HTTP: http://localhost:8080: status: matches expectation: [200]


Failures/Skipped:

Port: tcp:8080: ip: skipped

Total Duration: 0.012s
Count: 4, Failed: 0, Skipped: 1
INFO: Deleting container

{{< /highlight >}}

> Quality is never an accident; it is always the result of intelligent effort,

> John Ruskin.
