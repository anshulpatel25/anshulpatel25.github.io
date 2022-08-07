---
title: "Linux Kernel Capabilities Explained"
date: 2017-07-17T00:00:00+05:30
tags:
  - "security"
  - "linux"
---

Traditionally, Linux Kernel distinguishes its processes with the following

[two categories](https://unix.stackexchange.com/questions/258503/what-happens-when-a-non-root-user-sends-signals-to-root-users-process):

- **Privileged Processes**: These processes allow the user to bypass all Kernel
  permission checks.

- **Unprivileged Processes**: These processes are subject to full permission
  checks, such as the effective UID, GID, and supplementary group list.

<!--more-->

Granting full privileged access to a user process might induce system abuse,
like unauthorized changes of data, backdoors, changing ACL, etc.

Linux 2.2 shipped with a solution called Capabilities. Capabilities allows the
developer to grant binaries/files specific permissions.

### Example

Let's say we want to start a Simple HTTP Server module of Python on port 80 with
a non-privileged user. If we try to start the process without granting any
capabilities, we will get the following error:

{{< highlight bash >}}
anshulp@dzone-vagrant-box:$ python -m SimpleHTTPServer 80
Traceback (most recent call last):
File "/usr/lib/python2.7/runpy.py", line 174, in \_run_module_as_main
"**main**", fname, loader, pkg_name)
File "/usr/lib/python2.7/runpy.py", line 72, in \_run_code
...
File "/usr/lib/python2.7/socket.py", line 228, in meth
return getattr(self.\_sock,name)(\*args)
socket.error: [Errno 13] Permission denied
{{< /highlight >}}

Let's add the `CAP_NET_BIND_SERVICE` capability to our Python binary.

{{< highlight bash >}}
sudo setcap 'CAP_NET_BIND_SERVICE+ep' /usr/bin/python2.7
{{< /highlight >}}

The above command states that we are adding the `CAP_NET_BIND_SERVICE`
capability to our `/usr/bin/python2.7` file. `+ep` indicates that the file is
Effective and Permitted ( "-" would remove it).

Now let's try to run the Python Simple HTTP Server module again on port 80:

{{< highlight bash >}}
anshulp@dzone-vagrant-box:$ python -m SimpleHTTPServer 80
Serving HTTP on 0.0.0.0 port 80 ...
172.28.128.1 - - [06/Jul/2017 11:30:13] "GET / HTTP/1.1" 200 -
172.28.128.1 - - [06/Jul/2017 11:30:13] code 404, message File not found
172.28.128.1 - - [06/Jul/2017 11:30:13] "GET /favicon.ico HTTP/1.1" 404 -
172.28.128.1 - - [06/Jul/2017 11:30:13] code 404, message File not found
172.28.128.1 - - [06/Jul/2017 11:30:13] "GET /favicon.ico HTTP/1.1" 404 -
{{< /highlight >}}

We are now able to serve traffic over privileged port 80 with a non-privileged
user.

At the time of writing this article, there are over 40 capabilities which can be
assigned per requirement.

<!-- markdownlint-disable-next-line MD013 -->

There are 3 modes for [Capabilities](https://www.insecure.ws/linux/getcap_setcap.html):

**e: Effective** - This indicates that the capability is "activated."

**p: Permitted** - This indicates that the capability can be used.

**i: Inherited** - This indicates that the capability is inherited by child
elements/subprocesses.

Capabilities provide a concise and efficient way to assign privileged
permissions to non-privileged users.
