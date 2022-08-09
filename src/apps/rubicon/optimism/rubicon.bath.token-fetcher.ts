import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers/lib/ethers';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { RubiconContractFactory } from '../contracts';
import { RUBICON_DEFINITION } from '../rubicon.definition';

const appId = RUBICON_DEFINITION.id;
const groupId = RUBICON_DEFINITION.groups.bath.id;
const network = Network.OPTIMISM_MAINNET;

// Test:
// http://localhost:5001/apps/rubicon/tokens?groupIds[]=bathToken&network=optimism

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismRubiconBathTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(RubiconContractFactory) private readonly rubiconContractFactory: RubiconContractFactory,
  ) { }

  async getPositions() {
    // For now, hardcoded in docs
    const bathTokens = [
      '0xb0be5d911e3bd4ee2a8706cf1fac8d767a550497',
      '0x7571cc9895d8e997853b1e0a1521ebd8481aa186',
      '0xe0e112e8f33d3f437d1f895cbb1a456836125952',
      '0x60daec2fc9d2e0de0577a5c708bcadba1458a833',
      '0xffbd695bf246c514110f5dae3fa88b8c2f42c411',
      '0xeb5f29afaaa3f44eca8559c3e8173003060e919f',
      '0x574a21fe5ea9666dbca804c9d69d8caf21d5322b',
    ];
    // Create a multicall wrapper instance to batch chain RPC calls together
    const multicall = this.appToolkit.getMulticall(network);

    const appTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

    const allTokenDependencies = [...appTokenDependencies];

    const tokens = await Promise.all(
      bathTokens.map(async btAddress => {
        // Instantiate a smart contract instance pointing to the Bath Token address
        const contract = this.rubiconContractFactory.bathToken({
          address: btAddress,
          network,
        });

        // Request the underlying token address and ratio for the Bath Token
        const [underlyingTokenAddressRaw, ratioRaw] = await Promise.all([
          multicall.wrap(contract).asset(),
          multicall.wrap(contract).convertToAssets(BigNumber.from((1e18).toString())),
        ]);

        // console.log('query this ERC20', underlyingTokenAddressRaw);

        const underlyingAssetContract = this.rubiconContractFactory.bathToken({
          address: underlyingTokenAddressRaw,
          network,
        });
        const trueDecimals = await underlyingAssetContract.decimals();

        // Request the symbol, decimals, ands supply for the Bath Token
        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          trueDecimals,
          multicall.wrap(contract).totalSupply(),
        ]);

        // console.log('Got these decimals', decimals, 'from multicall', symbol);
        // console.log('Got this decimals from the contract', await contract.decimals());

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;

        // *******price ************
        // A user can deposit base tokens like WETH or USDC

        // Find the underlying token in our dependencies.
        // Note: If it is not found, then we have not indexed the underlying token, and we cannot
        // index the Bath Token since its price depends on the underlying token price.
        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
        const underlyingToken = allTokenDependencies.find(v => v.address === underlyingTokenAddress);
        if (!underlyingToken) return null;
        const tokens = [underlyingToken];

        // Denormalize the price per share
        const pricePerShare = Number(ratioRaw) / 10 ** 18;
        const price = pricePerShare * underlyingToken.price;

        const label = getLabelFromToken(underlyingToken);
        const images = getImagesFromToken(underlyingToken);
        const secondaryLabel = buildDollarDisplayItem(price);

        // Create the token object
        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          address: btAddress,
          appId,
          groupId,
          network,
          symbol,
          decimals,
          supply,
          tokens,
          price,
          pricePerShare,
          dataProps: {},
          displayProps: {
            label,
            images,
            secondaryLabel,
          },
        };

        return token;
      }),
    );

    return _.compact(tokens);
  }
}
