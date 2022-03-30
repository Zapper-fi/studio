# Zapper Studio

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm start

# watch mode
$ pnpm dev
```

## Generating a typescript contract from an ABI

ABIs that are contained within the `contracts/abis` folder of your application can be leveraged
to quickly spin up a typescript library for interacting with a given smart contract.

You can quickly spin up a typescript library for using an ABI by running the following command:

```bash
./agora generate:contract-factory [app-id]
```

## Contributing new commands

You can generate a new cli command by running the hidden command:

```
./agora new:command [my-command-name]
```

