---
title: "HTTP Strict Transport Security(HSTS)"
date: 2017-01-13T00:00:00+05:30
tags:
  - "security"
---

HSTS is an opt-in security specified by a web application through the use of a
special response header.

When the browser receives this header, the browser prevents all communication
over HTTP to that specified domain. Instead the browser will send all
communication over HTTPS.

<!--more-->

## Why HSTS?

HSTS is designed to overcome following threats:

- User bookmarks or manual types like "http://example.com" are vulnerable to
  man-in-the-middle attack.

- A web application that is intended to be communicated over HTTPS, contains
  HTTP links or serves content over HTTP.

- Man-in-the-middle attack which makes victim accept the bad certificate by
  intercepting network traffic.

## HSTS in Action

- Webserver directive should be added to upgrade all HTTP connections to HTTPS
  connections on first-time website access.

- Webserver directive to add HSTS header in HTTPS section.

- If the configuration is successful, you will get following
  307(Internal Redirect) redirection from the browser.

![hsts](/images/hsts_redirect.png)
