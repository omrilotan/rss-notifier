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

![](https://user-images.githubusercontent.com/516342/103227871-1d176200-4938-11eb-9b10-788bd25f9c70.png)

### options

| Name | Type | Default
| - | - | -
| `webhook` | Webhook address | ✘
| `feeds` | Comma separated URLs | ✘
| `interval` | Minutes | Fifteen minutes
| `channel` | Webhook channel | Default webhook channel
| `log-level` | debug, verbose, info, warn, error, critical | warn
| `log-format` | plain, json | plain

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
