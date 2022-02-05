+++
author = "Anshul Patel"
date = 2018-07-05
showthedate = true
title = "BASH: Execute Shellscript on remote machine via TCP"
tags = [
    "devops",
    "sitereliability",
    "networking",
    "bash"
]
+++

This article discusses on how to execute shellscript on remote machine without Socket programming by using Xinetd.

<!--more-->

## ShellScript

- Below is simple shell script which fetches memory, disk and process stats using basic shell commands.

{{< gist anshulpatel25 d42161c3d90dc9c0bc507ad4ecdd0519 >}}

- Store the shellscript as `statshandler` under `/usr/local/bin`.

- Assign the executable permission to `statshandler`.

{{< highlight bash >}}
chmod +x /usr/local/bin/statshandler
{{< /highlight >}}


## What is Xinetd?

- Xinetd is superserver daemon which start other services/programs when needed.
- It uses few resources in idle state.

## Xinetd Setup and Configuration

- Install Xinetd.

{{< highlight bash >}}
yum install xinetd.x86_64 -y
{{< /highlight >}}

- Create Xinetd service `statshandler` in directory `/etc/xinetd.d/` with following content.

{{< highlight bash >}}
$ cat /etc/xinetd.d/statshandler
service statshandler
    {
            disable         = no
            socket_type     = stream
            server          = /usr/local/bin/statshandler
            port            = 4000
            user            = root
            wait            = no
    }
{{< /highlight >}}

- Add the service mapping in `/etc/services`

{{< highlight bash >}}
statshandler    4000/tcp                #StatsHandlerService
{{< /highlight >}}

- Restart the Xinetd service

{{< highlight bash >}}
systemctl restart xinetd
{{< /highlight >}}

## Executing the ShellScript via TCP

{{< highlight bash >}}
$ telnet localhost 4000
Trying ::1...
Connected to localhost.
Escape character is '^]'.
##########Processes##########
      1 agetty
      1 anacron
      1 ata_sff
      1 auditd
      1 bash
      4 bioset
      1 chronyd
      1 crond
      1 crypto
      1 dbus-daemon
      1 deferwq
      1 dhclient
      1 docker-containe
      1 dockerd
      1 iprt-VBoxWQueue
      1 ipv6_addrconf
      1 kauditd
      1 kblockd
      1 kdevtmpfs
      2 kdmflush
      1 khugepaged
      1 khungtaskd
      1 kintegrityd
      1 kmpath_rdacd
      1 kpsmoused
      1 ksmd
      1 ksoftirqd/0
      1 kswapd0
      1 kthreadd
      1 kthrotld
      1 kworker/0:0H
      1 kworker/0:1
      1 kworker/0:1H
      1 kworker/0:2
      1 kworker/u2:0
      1 kworker/u2:3
      1 lvmetad
      1 master
      1 md
      1 migration/0
      1 netns
      1 NetworkManager
      1 pickup
      1 polkitd
      1 ps
      1 qmgr
      1 rcu_bh
      1 rcu_sched
      1 rsyslogd
      1 scsi_eh_0
      1 scsi_eh_1
      1 scsi_eh_2
      1 scsi_tmf_0
      1 scsi_tmf_1
      1 scsi_tmf_2
      1 sort
      3 sshd
      1 statshandler
      1 systemd
      1 systemd-journal
      1 systemd-logind
      1 systemd-udevd
      1 telnet
      1 ttm_swap
      1 tuned
      1 uniq
      1 VBoxService
      1 watchdog/0
      1 writeback
      1 xfsaild/dm-0
      1 xfsaild/sda1
      1 xfsalloc
      1 xfs-buf/dm-0
      1 xfs-buf/sda1
      1 xfs-cil/dm-0
      1 xfs-cil/sda1
      1 xfs-conv/dm-0
      1 xfs-conv/sda1
      1 xfs-data/dm-0
      1 xfs-data/sda1
      1 xfs-eofblocks/d
      1 xfs-eofblocks/s
      1 xfs-log/dm-0
      1 xfs-log/sda1
      1 xfs_mru_cache
      1 xfs-reclaim/dm-
      1 xfs-reclaim/sda
      1 xinetd
##########Memory##########
              total        used        free      shared  buff/cache   available
Mem:           3790         146        3058           8         585        3406
Swap:          1023           0        1023
##########FileSystem##########
Filesystem                       Size  Used Avail Use% Mounted on
/dev/mapper/centos_centos7-root  8.0G  5.7G  2.4G  72% /
devtmpfs                         1.9G     0  1.9G   0% /dev
tmpfs                            1.9G     0  1.9G   0% /dev/shm
tmpfs                            1.9G  8.5M  1.9G   1% /run
tmpfs                            1.9G     0  1.9G   0% /sys/fs/cgroup
/dev/sda1                       1014M  171M  844M  17% /boot
vagrant                          237G  1.7G  235G   1% /vagrant
tmpfs                            380M     0  380M   0% /run/user/1000
tmpfs                            380M     0  380M   0% /run/user/0
Connection closed by foreign host.
{{< /highlight >}}
