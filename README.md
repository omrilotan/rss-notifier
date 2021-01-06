# rss-notifier [![](https://img.shields.io/github/workflow/status/omrilotan/rss-notifier/publish?style=flat-square)](https://github.com/omrilotan/rss-notifier/actions?query=workflow%3Apublish) [![](https://img.shields.io/docker/automated/omrilotan/rss-notifier?style=flat-square)](https://hub.docker.com/repository/docker/omrilotan/rss-notifier) [![](https://img.shields.io/npm/v/rss-notifier?style=flat-square)](https://www.npmjs.com/package/rss-notifier)

## 💬 Send RSS update notifications to Slack

#### NPX
```bash
npx rss-notifier --interval 10 --webhook https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX --channel "#notifications-channel" --feeds https://www.githubstatus.com/history.rss,https://status.docker.com/pages/533c6539221ae15e3f000031/rss --log-level debug
```

#### Docker
```bash
docker run omrilotan/rss-notifier -- --interval 10 --webhook https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX --channel "#notifications-channel" --feeds https://www.githubstatus.com/history.rss,https://status.docker.com/pages/533c6539221ae15e3f000031/rss --log-level debug
```

#### Docker with env vars
```bash
docker run -e INTERVAL=10 -e WEBHOOK=https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX -e CHANNEL="#notifications-channel" -e FEEDS=https://www.githubstatus.com/history.rss,https://status.docker.com/ ages/533c6539221ae15e3f000031/rss -e LOG-LEVEL=debug omrilotan/rss-notifier
```
or
```bash
export INTERVAL=10
export WEBHOOK=https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX
export CHANNEL="#notifications-channel"
export FEEDS=https://www.githubstatus.com/history.rss,https://status.docker.com/ ages/533c6539221ae15e3f000031/rss
export LOG-LEVEL=debug

docker run -e INTERVAL -e WEBHOOK -e CHANNEL -e FEEDS -e LOG-LEVEL omrilotan/rss-notifier
```
and so on

![](https://user-images.githubusercontent.com/516342/103227871-1d176200-4938-11eb-9b10-788bd25f9c70.png)

### CLI options

| Name | Env Var | Type | Default
| - | - | - | -
| `webhook` | `WEBHOOK` | Webhook address | ✘
| `feeds` | `FEEDS` | Comma separated URLs | ✘
| `interval` | `INTERVAL` | Minutes | Fifteen minutes
| `channel` | `CHANNEL` | Webhook channel | Default webhook channel
| `log-level` | `LOG_LEVEL` | debug, verbose, info, warn, error, critical | warn
| `log-format` | `LOG_FROMAT` | plain, json | plain

Options preference order is: CLI argument (1st), Environment variable (2nd), default (where applicable)

## How To Use

#### Interval
Run this as scheduled task, specify the interval in which you run it.

_Examples:_

If you are running a cron as `*/15 * * * *` (each 15 minutes), set the interval argument to `15`.

If you are running a cron as `0 9 */1 * *` (every day at 09:00), set the interval argument to `1440` (60 * 24).

#### Feed(s)
The feed(s) is a list of one or more URLs.

_Example:_

If you want to "subscribe" to GitHub and Docker statuses set your feeds to both `--feeds https://www.githubstatus.com/history.rss,https://status.docker.com/pages/533c6539221ae15e3f000031/rss`
