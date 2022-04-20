<h1 align="center" style="border-bottom: none">
    <b>
        <a href="https://zapper.fi/">Zapper Studio</a><br>
    </b>
</h1>

bleh

<p align="center">
    <a href="https://twitter.com/zapper_fi"><b>Twitter</b></a> •
    <a href="https://zapper.fi/discord"><b>Discord</b></a>
</p>

## Description

Zapper Studio is a platform which enables developers in our community to integrate Web3 applications into Zapper. Integrations can support fetching tokens and contract positions, retrieving a wallet's balances, calculating TVL, and more to come in the future. These adapters enrich the Zapper API, and all of its consumers, including our own mobile and web apps.

## Getting Started

You can get started building immediately! </br>
See <a href="https://studio-docs.zapper.fi/">Zapper Studio docs</a> for more details

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

## Generating code template

```bash
pnpm studio codegen-app [app-id]
```

## Generating a typescript contract from an ABI

ABIs that are contained within the `contracts/abis` folder of your application can be leveraged
to quickly spin up a typescript library for interacting with a given smart contract.

You can quickly spin up a typescript library for using an ABI by running the following command:

```bash
pnpm studio generate:contract-factory [app-id]
```

## Contributing

Read our [Contribution Guide](contribution.md)

### Contributing new commands

You can generate a new cli command by running the hidden command:

```
pnpm studio new:command [my-command-name]
```

## Need help ?

Join our community on <a href="https://zapper.fi/discord">Discord</a>

## License

This repository is under the [Business Source License](LICENSE)
