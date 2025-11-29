const data = {
    'service': 'app',
    'container': {
        'id': '577f9aadd0a3',
        'name': 'app_api',
        'status': 'Up About an hour',
        'uptime': '26 hours ago',
        'details': {
            'Id': '577f9aadd0a3fa71259eab730f974c5100d88d9c1be00488f7109580a1da5644',
            'Created': '2025-11-28T18:46:02.4480584Z',
            'Path': 'docker-entrypoint.sh',
            'Args': [
                '/bin/sh',
                '-c',
                'npm start'
            ],
            'State': {
                'Status': 'running',
                'Running': true,
                'Paused': false,
                'Restarting': false,
                'OOMKilled': false,
                'Dead': false,
                'Pid': 3036437,
                'ExitCode': 0,
                'Error': '',
                'StartedAt': '2025-11-29T19:15:37.373592005Z',
                'FinishedAt': '2025-11-29T19:15:19.797214847Z'
            },
            'Image': 'sha256:aa6bd8c5298cdf65c7378d882fd6ab110b57750cea36d06cf51b92ed20077133',
            'ResolvConfPath': '/mnt/ramdisk/docker/containers/abc/resolv.conf',
            'HostnamePath': '/mnt/ramdisk/docker/containers/577f9aadd0a3fa71259eab730f974c5100d88d9c1be00488f7109580a1da5644/hostname',
            'HostsPath': '/mnt/ramdisk/docker/containers/577f9aadd0a3fa71259eab730f974c5100d88d9c1be00488f7109580a1da5644/hosts',
            'LogPath': '/mnt/ramdisk/docker/containers/abc/577f9aadd0a3fa71259eab730f974c5100d88d9c1be00488f7109580a1da5644-json.log',
            'Name': '/app_api',
            'RestartCount': 0,
            'Driver': 'overlay2',
            'Platform': 'linux',
            'MountLabel': '',
            'ProcessLabel': '',
            'AppArmorProfile': 'docker-default',
            'ExecIDs': null,
            'HostConfig': {
                'Binds': null,
                'ContainerIDFile': '',
                'LogConfig': {
                    'Type': 'json-file',
                    'Config': {}
                },
                'NetworkMode': 'app_api_default',
                'PortBindings': {
                    '8080/tcp': [
                        {
                            'HostIp': '',
                            'HostPort': '8100'
                        }
                    ]
                },
                'RestartPolicy': {
                    'Name': 'always',
                    'MaximumRetryCount': 0
                },
                'AutoRemove': false,
                'VolumeDriver': '',
                'VolumesFrom': null,
                'ConsoleSize': [
                    0,
                    0
                ],
                'CapAdd': null,
                'CapDrop': null,
                'CgroupnsMode': 'private',
                'Dns': [],
                'DnsOptions': [],
                'DnsSearch': [],
                'ExtraHosts': [],
                'GroupAdd': null,
                'IpcMode': 'private',
                'Cgroup': '',
                'Links': null,
                'OomScoreAdj': 0,
                'PidMode': '',
                'Privileged': false,
                'PublishAllPorts': false,
                'ReadonlyRootfs': false,
                'SecurityOpt': null,
                'UTSMode': '',
                'UsernsMode': '',
                'ShmSize': 67108864,
                'Runtime': 'runc',
                'Isolation': '',
                'CpuShares': 0,
                'Memory': 0,
                'NanoCpus': 0,
                'CgroupParent': '',
                'BlkioWeight': 0,
                'BlkioWeightDevice': null,
                'BlkioDeviceReadBps': null,
                'BlkioDeviceWriteBps': null,
                'BlkioDeviceReadIOps': null,
                'BlkioDeviceWriteIOps': null,
                'CpuPeriod': 0,
                'CpuQuota': 0,
                'CpuRealtimePeriod': 0,
                'CpuRealtimeRuntime': 0,
                'CpusetCpus': '',
                'CpusetMems': '',
                'Devices': null,
                'DeviceCgroupRules': null,
                'DeviceRequests': null,
                'MemoryReservation': 0,
                'MemorySwap': 0,
                'MemorySwappiness': null,
                'OomKillDisable': null,
                'PidsLimit': null,
                'Ulimits': null,
                'CpuCount': 0,
                'CpuPercent': 0,
                'IOMaximumIOps': 0,
                'IOMaximumBandwidth': 0,
                'MaskedPaths': [
                    '/proc/acpi',
                    '/proc/asound',
                    '/proc/interrupts',
                    '/proc/kcore',
                    '/proc/keys',
                    '/proc/latency_stats',
                    '/proc/sched_debug',
                    '/proc/scsi',
                    '/proc/timer_list',
                    '/proc/timer_stats',
                    '/sys/devices/virtual/powercap',
                    '/sys/firmware'
                ],
                'ReadonlyPaths': [
                    '/proc/bus',
                    '/proc/fs',
                    '/proc/irq',
                    '/proc/sys',
                    '/proc/sysrq-trigger'
                ]
            },
            'GraphDriver': {
                'Data': {
                    'ID': '577f9aadd0a3fa71259eab730f974c5100d88d9c1be00488f7109580a1da5644',
                    'LowerDir': '/mnt/ramdisk/docker/overla1eabc47c601a68893a639d1e002ac2c0fe58becb99b3ac3/diff',
                    'MergedDir': '/mnt/ramdisk/docker/overlay2/ea9b59f41a1139f100d58cc125fbc59e836b86660ada0da13c81fbebbe6bc86e/merged',
                    'UpperDir': '/mnt/ramdisk/docker/overlay2/ea9b59f41a1139f100d58cc125fbc59e836b86660ada0da13c81fbebbe6bc86e/diff',
                    'WorkDir': '/mnt/ramdisk/docker/overlay2/ea9b59f41a1139f100d58cc125fbc59e836b86660ada0da13c81fbebbe6bc86e/work'
                },
                'Name': 'overlay2'
            },
            'Mounts': [],
            'Config': {
                'Hostname': '577f9aadd0a3',
                'Domainname': '',
                'User': '',
                'AttachStdin': false,
                'AttachStdout': true,
                'AttachStderr': true,
                'ExposedPorts': {
                    '8080/tcp': {}
                },
                'Tty': false,
                'OpenStdin': false,
                'StdinOnce': false,
                'Env': [
                    'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
                    'NODE_VERSION=25.2.1',
                    'YARN_VERSION=1.22.22'
                ],
                'Cmd': [
                    '/bin/sh',
                    '-c',
                    'npm start'
                ],
                'Image': 'app_api',
                'Volumes': null,
                'WorkingDir': '/usr/src/app',
                'Entrypoint': [
                    'docker-entrypoint.sh'
                ],
                'Labels': {
                    'com.docker.compose.config-hash': '9fb99601edc8bb3d11930d029c65569e84d4d939da0b88e987f8e2325278da83',
                    'com.docker.compose.container-number': '1',
                    'com.docker.compose.depends_on': '',
                    'com.docker.compose.image': 'sha256:aa6bd8c5298cdf65c7378d882fd6ab110b57750cea36d06cf51b92ed20077133',
                    'com.docker.compose.oneoff': 'False',
                    'com.docker.compose.project': 'app_api',
                    'com.docker.compose.project.config_files': '/home/dev/app_api/docker-compose.yml',
                    'com.docker.compose.project.working_dir': '/home/dev/app_api',
                    'com.docker.compose.replace': 'app_api',
                    'com.docker.compose.service': 'app_api',
                    'com.docker.compose.version': '2.40.3'
                }
            },
            'NetworkSettings': {
                'SandboxID': '74766d05441b729d78a37e54949972b73b40e1b6da61c76ce1f71d091b62be5f',
                'SandboxKey': '/var/run/docker/netns/74766d05441b',
                'Ports': {
                    '8080/tcp': [
                        {
                            'HostIp': '0.0.0.0',
                            'HostPort': '8100'
                        },
                        {
                            'HostIp': '::',
                            'HostPort': '8100'
                        }
                    ]
                },
                'Networks': {
                    'app_api_default': {
                        'IPAMConfig': null,
                        'Links': null,
                        'Aliases': [
                            'app_api',
                            'app_api'
                        ],
                        'DriverOpts': null,
                        'GwPriority': 0,
                        'NetworkID': '0d7b7c177fdb520d00cad38c6f5c8d622d7ebcbae4e4d22f55b62926dd13218e',
                        'EndpointID': '44551da45542a8dda1fd5369f8819bced2763ec5e0de2ed39da2f3f4c1f09122',
                        'Gateway': '192.168.0.1',
                        'IPAddress': '192.168.0.2',
                        'MacAddress': '9a:ad:f8:0d:28:52',
                        'IPPrefixLen': 20,
                        'IPv6Gateway': '',
                        'GlobalIPv6Address': '',
                        'GlobalIPv6PrefixLen': 0,
                        'DNSNames': [
                            'app_api',
                            '577f9aadd0a3'
                        ]
                    }
                }
            }
        },
        'logs': [
            '> app-api@1.1.0 start',
            '> node src/index.ts',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'msg\':\'Server listening at http://127.0.0.1:8080\'}',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'msg\':\'Server listening at http://192.168.0.2:8080\'}',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-1\',\'req\': minified object',
            '{\'level\':30,\'time\':1,\'pid\':18,\'hostname\':\'1\',\'reqId\':\'req-8\',\'msg\':\'Route GET:/favicon.ico not found\'}',
            '> app-api@1.1.0 start',
            '> node src/index.ts',
            '{\'level\':30,\'time\':1764443743349,\'pid\':18,\'hostname\':\'577f9aadd0a3\',\'msg\':\'Server listening at http://127.0.0.1:8080\'}',
            '{\'level\':30,\'time\':1764443743350,\'pid\':18,\'hostname\':\'577f9aadd0a3\',\'msg\':\'Server listening at http://192.168.0.2:8080\'}'
        ]
    },
    'related': [
        {
            'id': '577f9aadd0a3',
            'name': 'app_api',
            'status': 'Up About an hour',
            'uptime': '26 hours ago'
        }
    ]
}

export default data
