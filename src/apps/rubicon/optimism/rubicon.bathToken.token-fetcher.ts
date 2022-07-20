import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers/lib/ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { RubiconContractFactory } from '../contracts';
import { RUBICON_DEFINITION } from '../rubicon.definition';

const appId = RUBICON_DEFINITION.id;
const groupId = RUBICON_DEFINITION.groups.bathToken.id;
const network = Network.OPTIMISM_MAINNET;

// Test:
// http://localhost:5001/apps/rubicon/tokens?groupIds[]=bathToken&network=optimism

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismRubiconBathTokenTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(RubiconContractFactory) private readonly rubiconContractFactory: RubiconContractFactory,
  ) { }

  async getPositions() {
    // For now, hardcoded in docs
    const bathTokens = [
      '0xB0bE5d911E3BD4Ee2A8706cF1fAc8d767A550497',
      '0x7571CC9895D8E997853B1e0A1521eBd8481aa186',
      '0xe0e112e8f33d3f437D1F895cbb1A456836125952',
      '0x60daEC2Fc9d2e0de0577A5C708BcaDBA1458A833',
      '0xfFBD695bf246c514110f5DAe3Fa88B8c2f42c411',
      '0xeb5F29AfaaA3f44eca8559c3e8173003060e919f',
      '0x574a21fE5ea9666DbCA804C9d69d8Caf21d5322b',
    ];
    // Create a multicall wrapper instance to batch chain RPC calls together
    const multicall = this.appToolkit.getMulticall(network);

    const appTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

    const allTokenDependencies = [...appTokenDependencies];

    // We will build a token object for each jar address, using data retrieved on-chain with Ethers
    const tokens = await Promise.all(
      bathTokens.map(async btAddress => {
        // Instantiate a smart contract instance pointing to the jar token address
        const contract = this.rubiconContractFactory.bathToken({
          address: btAddress,
          network,
        });

        // Request the symbol, decimals, ands supply for the jar token
        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;

        // *******price ************
        // A user can deposit base tokens like LOOKS or LQTY

        // Request the underlying token address and ratio for the jar token
        const [underlyingTokenAddressRaw, ratioRaw] = await Promise.all([
          multicall
            .wrap(contract)
            .asset()
            .catch(() => ''),
          multicall
            .wrap(contract)
            .convertToAssets(BigNumber.from((1e18).toString()))
            .catch(() => 'Convert to assets failed'),
        ]);
        // console.log('underlyingTokenAddressRaw', underlyingTokenAddressRaw, 'ratioRaw', ratioRaw.toString());

        // Find the underlying token in our dependencies.
        // Note: If it is not found, then we have not indexed the underlying token, and we cannot
        // index the jar token since its price depends on the underlying token price.
        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
        const underlyingToken = allTokenDependencies.find(v => v.address === underlyingTokenAddress);
        if (!underlyingToken) {
          // console.log('No underlyingToken!', underlyingTokenAddress);

          return null;
        }
        const tokens = [underlyingToken];

        // Denormalize the price per share
        const pricePerShare = Number(ratioRaw) / 10 ** 18;
        const price = pricePerShare * underlyingToken.price;

        // Create the token object
        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: btAddress,
          network,
          symbol,
          decimals,
          supply,
          tokens,
          price,
          pricePerShare,
          // TODO: add any data props here
          dataProps: {},
          displayProps: {
            label: '',
            images: [],
          },
        };

        return token;
      }),
    );

    return tokens;
  }
}
