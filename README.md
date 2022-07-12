<h1 align="center" style="border-bottom: none">
    <b>
        <a href="https://zapper.fi/">
            <img alt="Zapper Studio" width="408px" src="https://user-images.githubusercontent.com/22452366/164318940-1c49ceaf-4160-49bb-ac57-f217bce47831.png" />
        </a><br>
    </b>
</h1>

<p align="center">
    <a href="https://twitter.com/zapper_fi"><b>Twitter</b></a> •
    <a href="https://zapper.fi/discord"><b>Discord</b></a>
</p>

<div>
    <a href="https://www.npmjs.com/package/@zapper-fi/studio">
        <img src="https://img.shields.io/npm/v/@zapper-fi/studio?color=%23784FFE&style=flat-square" />
    </a>
</div>

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-57-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Description

Zapper Studio is a platform which enables developers in our community to integrate Web3 applications into Zapper. Integrations can support fetching tokens and contract positions, retrieving a wallet's balances, calculating TVL, and more to come in the future. These adapters enrich the Zapper API, and all of its consumers, including our own mobile and web apps.

## Requirements

Ensure the following have been installed on your system:

- Node v16.14.2 or above
- [pnpm](https://pnpm.io/)

## Getting Started

You can get started building immediately!

OpenAPI docs for studio is available on <a href="http:localhost:5001/docs">localhost:5001/docs</a>. Which will give
you a rough overview of all exposed endpoints you can test out.

If you wish to know how to integrate your application, please check out
<a href="https://studio-docs.zapper.fi/">Zapper Studio docs</a> for more details.

### Installation

```bash
$ pnpm install
```

## Running the app

```bash
$ pnpm dev
```

## Creating a new app

```bash
pnpm studio create-app
```

## Creating a new app group

```bash
pnpm studio create-group [app-id]
```

## Generating code templates

```bash
pnpm studio create-token-fetcher [app-id]
pnpm studio create-contract-position-fetcher [app-id]
pnpm studio create-balance-fetcher [app-id]
```

## Clearing the cache

Clears the file-system cache that persists app tokens, contract positions and any other app related data.
Useful when your are doing modification to an app and it keeps on returning stale data.

```bash
pnpm studio clear-cache
```

## Setting custom network providers

If default network providers are too slow or are failing, you can use customize your setup.

```bash
pnpm studio set-network-provider
```

## Generating a typescript contract from an ABI

ABIs that are contained within the `contracts/abis` folder of your application can be leveraged
to quickly spin up a typescript library for interacting with a given smart contract.

You can quickly spin up a typescript library for using an ABI by running the following command:

```bash
pnpm studio generate:contract-factory [app-id]
```

## Enabling environment specific configuration

Simply copy `.env.sample` to `.env` and edit the configuration file.

### ENABLED_APPS

Control which app to enable on startup. Particularly useful to keep local build times snappy.
When developing your own app, it's recommended to add its identifier (aka: the folder name) and it's dependant apps
(also their respective folder name) into this configuration key. See the `.env` file for further details.

## Contributing

Read our [Contribution Guide](./CONTRIBUTING.md)

### Contributing new commands

You can generate a new cli command by running the hidden command:

```
pnpm studio new:command [my-command-name]
```

## Need help ?

Join our community on <a href="https://zapper.fi/discord">Discord</a>

## License

This repository is under the [Business Source License 1.1](LICENSE)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/justin-d-errico-33b76113a/"><img src="https://avatars.githubusercontent.com/u/17734052?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Justin D'Errico</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=JForsaken" title="Code">💻</a> <a href="#question-JForsaken" title="Answering Questions">💬</a> <a href="#maintenance-JForsaken" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/immasandwich"><img src="https://avatars.githubusercontent.com/u/22452366?v=4?s=64" width="64px;" alt=""/><br /><sub><b>immasandwich</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=immasandwich" title="Code">💻</a> <a href="#question-immasandwich" title="Answering Questions">💬</a> <a href="#maintenance-immasandwich" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/wpoulin"><img src="https://avatars.githubusercontent.com/u/18474228?v=4?s=64" width="64px;" alt=""/><br /><sub><b>William Poulin</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=wpoulin" title="Code">💻</a> <a href="#question-wpoulin" title="Answering Questions">💬</a> <a href="#maintenance-wpoulin" title="Maintenance">🚧</a></td>
    <td align="center"><a href="http://xdrdak.github.io/"><img src="https://avatars.githubusercontent.com/u/1198051?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Xavier Drdak</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=xdrdak" title="Code">💻</a> <a href="#question-xdrdak" title="Answering Questions">💬</a> <a href="#maintenance-xdrdak" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/0xMaxim"><img src="https://avatars.githubusercontent.com/u/57536175?v=4?s=64" width="64px;" alt=""/><br /><sub><b>0xMaxim</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=0xMaxim" title="Documentation">📖</a> <a href="#question-0xMaxim" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/0xYYY"><img src="https://avatars.githubusercontent.com/u/86655648?v=4?s=64" width="64px;" alt=""/><br /><sub><b>YYY</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/issues?q=author%3A0xYYY" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/zeJabun"><img src="https://avatars.githubusercontent.com/u/86205416?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Jabun</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/issues?q=author%3AzeJabun" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/brightiron"><img src="https://avatars.githubusercontent.com/u/95196612?v=4?s=64" width="64px;" alt=""/><br /><sub><b>brightiron</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=brightiron" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/wrap-that-potassium"><img src="https://avatars.githubusercontent.com/u/83176631?v=4?s=64" width="64px;" alt=""/><br /><sub><b>wrap-that-potassium</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=wrap-that-potassium" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/piersss"><img src="https://avatars.githubusercontent.com/u/86911296?v=4?s=64" width="64px;" alt=""/><br /><sub><b>piersss</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=piersss" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/rkolpakov"><img src="https://avatars.githubusercontent.com/u/13422270?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Roman Kolpakov</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=rkolpakov" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mehdi-loup"><img src="https://avatars.githubusercontent.com/u/5024228?v=4?s=64" width="64px;" alt=""/><br /><sub><b>mehdi-loup</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=mehdi-loup" title="Code">💻</a> <a href="#question-mehdi-loup" title="Answering Questions">💬</a> <a href="#maintenance-mehdi-loup" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/dylandesrosier"><img src="https://avatars.githubusercontent.com/u/13701258?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Dylan</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=dylandesrosier" title="Code">💻</a></td>
    <td align="center"><a href="http://kylefitz.com/"><img src="https://avatars.githubusercontent.com/u/253651?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Kyle</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=kafitz" title="Code">💻</a> <a href="https://github.com/Zapper-fi/studio/issues?q=author%3Akafitz" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/melenxyz"><img src="https://avatars.githubusercontent.com/u/59291854?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Mélen</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=melenxyz" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/pwele"><img src="https://avatars.githubusercontent.com/u/1527361?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Papa Sougou Wele</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=pwele" title="Code">💻</a> <a href="#question-pwele" title="Answering Questions">💬</a> <a href="#maintenance-pwele" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://ca.linkedin.com/in/alexandresobolevski"><img src="https://avatars.githubusercontent.com/u/13302110?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Alexandre Sobolevski</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=alexandresobolevski" title="Code">💻</a> <a href="#question-alexandresobolevski" title="Answering Questions">💬</a> <a href="#maintenance-alexandresobolevski" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/farhaan-ali"><img src="https://avatars.githubusercontent.com/u/59924029?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Farhaan</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=farhaan-ali" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/tonzgao"><img src="https://avatars.githubusercontent.com/u/2408377?v=4?s=64" width="64px;" alt=""/><br /><sub><b>tonzgao</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=tonzgao" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/LeifuChen"><img src="https://avatars.githubusercontent.com/u/4819006?v=4?s=64" width="64px;" alt=""/><br /><sub><b>leifu</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=LeifuChen" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dominikpre"><img src="https://avatars.githubusercontent.com/u/58030116?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Dominik Prediger</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=dominikpre" title="Code">💻</a> <a href="https://github.com/Zapper-fi/studio/issues?q=author%3Adominikpre" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/symphonyfi"><img src="https://avatars.githubusercontent.com/u/81959798?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Kakashi</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=symphonyfi" title="Code">💻</a></td>
    <td align="center"><a href="https://aleonard.dev/"><img src="https://avatars.githubusercontent.com/u/14011462?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Andrew Leonard</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=leonardishere" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mingji"><img src="https://avatars.githubusercontent.com/u/3455636?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Michael</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=mingji" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/liuyepiaoxiang"><img src="https://avatars.githubusercontent.com/u/13102393?v=4?s=64" width="64px;" alt=""/><br /><sub><b>liuyepiaoxiang</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=liuyepiaoxiang" title="Code">💻</a></td>
    <td align="center"><a href="https://libkakashi.repl.co/"><img src="https://avatars.githubusercontent.com/u/46374098?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Apoorv Singal</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=apoorvsingal" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/theonepichael"><img src="https://avatars.githubusercontent.com/u/106809061?v=4?s=64" width="64px;" alt=""/><br /><sub><b>The Ol' Dirty Bubble </b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=theonepichael" title="Code">💻</a></td>
    <td align="center"><a href="https://trichome.tech/"><img src="https://avatars.githubusercontent.com/u/43109407?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Connor Mulhall</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=conwayconstar" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/meetkosiso"><img src="https://avatars.githubusercontent.com/u/20558092?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Kosiso</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=meetkosiso" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/kinesis-labs"><img src="https://avatars.githubusercontent.com/u/100001527?v=4?s=64" width="64px;" alt=""/><br /><sub><b>kinesis-labs</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=kinesis-labs" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/marcomariscal"><img src="https://avatars.githubusercontent.com/u/42938673?v=4?s=64" width="64px;" alt=""/><br /><sub><b>marcomariscal</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=marcomariscal" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/CronosLabsDev"><img src="https://avatars.githubusercontent.com/u/106642922?v=4?s=64" width="64px;" alt=""/><br /><sub><b>CronosLabsDev</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=CronosLabsDev" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/BastionProvider"><img src="https://avatars.githubusercontent.com/u/100055847?v=4?s=64" width="64px;" alt=""/><br /><sub><b>BastionProvider</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=BastionProvider" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/desposto"><img src="https://avatars.githubusercontent.com/u/62306651?v=4?s=64" width="64px;" alt=""/><br /><sub><b>David Esposto</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=desposto" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/westonnelson"><img src="https://avatars.githubusercontent.com/u/29180454?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Weston Nelson</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=westonnelson" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/coslendteam"><img src="https://avatars.githubusercontent.com/u/99856080?v=4?s=64" width="64px;" alt=""/><br /><sub><b>coslendteam</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=coslendteam" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/liz-cs"><img src="https://avatars.githubusercontent.com/u/90375135?v=4?s=64" width="64px;" alt=""/><br /><sub><b>liz</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=liz-cs" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/oo-00"><img src="https://avatars.githubusercontent.com/u/29607330?v=4?s=64" width="64px;" alt=""/><br /><sub><b>oo-00</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=oo-00" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/takao-aurigami"><img src="https://avatars.githubusercontent.com/u/102155128?v=4?s=64" width="64px;" alt=""/><br /><sub><b>takao-aurigami</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=takao-aurigami" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sebaudet26"><img src="https://avatars.githubusercontent.com/u/6855274?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Sébastien Audet</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=sebaudet26" title="Code">💻</a> <a href="#question-sebaudet26" title="Answering Questions">💬</a> <a href="#maintenance-sebaudet26" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/BluebitFinance"><img src="https://avatars.githubusercontent.com/u/96361968?v=4?s=64" width="64px;" alt=""/><br /><sub><b>BlueBit Finance</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=BluebitFinance" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Clonescody"><img src="https://avatars.githubusercontent.com/u/6602520?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Clonescody</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=Clonescody" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://anson-cheung.com/"><img src="https://avatars.githubusercontent.com/u/12746683?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Emerald</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=the-emerald" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/evLorne"><img src="https://avatars.githubusercontent.com/u/101081187?v=4?s=64" width="64px;" alt=""/><br /><sub><b>EvLorne</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=evLorne" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/0xKratos"><img src="https://avatars.githubusercontent.com/u/32628639?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Kratos</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=0xKratos" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/reganwrench"><img src="https://avatars.githubusercontent.com/u/98139806?v=4?s=64" width="64px;" alt=""/><br /><sub><b>reganwrench</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=reganwrench" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/scruffy-dev"><img src="https://avatars.githubusercontent.com/u/82269917?v=4?s=64" width="64px;" alt=""/><br /><sub><b>scruffy-dev</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=scruffy-dev" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Emile-Filteau"><img src="https://avatars.githubusercontent.com/u/1054341?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Émile Filteau-Tessier</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=Emile-Filteau" title="Code">💻</a> <a href="#question-Emile-Filteau" title="Answering Questions">💬</a> <a href="#maintenance-Emile-Filteau" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/SamIam-0x"><img src="https://avatars.githubusercontent.com/u/43358952?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Sam &#124; Zapper</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=SamIam-0x" title="Documentation">📖</a> <a href="#question-SamIam-0x" title="Answering Questions">💬</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.singlefinance.io/"><img src="https://avatars.githubusercontent.com/u/92788245?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Single Finance Lab</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=singlefinance" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/FiboApe"><img src="https://avatars.githubusercontent.com/u/94012134?v=4?s=64" width="64px;" alt=""/><br /><sub><b>FiboApe</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=FiboApe" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/teddav"><img src="https://avatars.githubusercontent.com/u/9486739?v=4?s=64" width="64px;" alt=""/><br /><sub><b>David</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=teddav" title="Code">💻</a> <a href="https://github.com/Zapper-fi/studio/issues?q=author%3Ateddav" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/0xAlunara"><img src="https://avatars.githubusercontent.com/u/88008691?v=4?s=64" width="64px;" alt=""/><br /><sub><b>0xAlunara</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=0xAlunara" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jn-lp"><img src="https://avatars.githubusercontent.com/u/21959994?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Eugene Lepeico</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=jn-lp" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/FredCoen"><img src="https://avatars.githubusercontent.com/u/43670554?v=4?s=64" width="64px;" alt=""/><br /><sub><b>FredCoen</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=FredCoen" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/VaporwaveFinance"><img src="https://avatars.githubusercontent.com/u/95114728?v=4?s=64" width="64px;" alt=""/><br /><sub><b>VaporwaveFinance</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=VaporwaveFinance" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/peezebit"><img src="https://avatars.githubusercontent.com/u/79215347?v=4?s=64" width="64px;" alt=""/><br /><sub><b>peezebit</b></sub></a><br /><a href="https://github.com/Zapper-fi/studio/commits?author=peezebit" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
