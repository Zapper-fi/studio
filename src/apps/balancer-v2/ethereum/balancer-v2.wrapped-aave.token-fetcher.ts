import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AAVE_V2_DEFINITION } from '~apps/aave-v2/aave-v2.definition';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerV2ContractFactory } from '../contracts';

const WRAPPED_AAVE_V2_TOKENS = [
  '0x02d60b84491589974263d922d9cc7a3152618ef6', // Wrapped aDAI
  '0xd093fa4fb80d09bb30817fdcd442d4d02ed3e5de', // Wrapped aUSDC
  '0xf8fd466f12e236f4c96f7cce6c79eadb819abf58', // Wrapped aUSDT
];

const appId = BALANCER_V2_DEFINITION.id;
const groupId = BALANCER_V2_DEFINITION.groups.wrappedAave.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class EthereumBalancerV2WrappedAaveTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ContractFactory) private readonly contractFactory: BalancerV2ContractFactory,
  ) {}

  async getPositions() {
    const network = Network.ETHEREUM_MAINNET;
    const multicall = this.appToolkit.getMulticall(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: AAVE_V2_DEFINITION.id,
      groupIds: [AAVE_V2_DEFINITION.groups.supply.id],
      network,
    });

    const wrappedTokens = await Promise.all(
      WRAPPED_AAVE_V2_TOKENS.map(async wrappedAaveTokenAddress => {
        const erc20Contract = this.contractFactory.erc20({ address: wrappedAaveTokenAddress, network });
        const contract = this.contractFactory.balancerWrappedAaveToken({ address: wrappedAaveTokenAddress, network });
        const [symbol, decimals, supplyRaw, underlyingTokenAddressRaw] = await Promise.all([
          multicall.wrap(erc20Contract).symbol(),
          multicall.wrap(erc20Contract).decimals(),
          multicall.wrap(erc20Contract).totalSupply(),
          multicall.wrap(contract).callStatic.ATOKEN(),
        ]);

        const supply = Number(supplyRaw) / 10 ** decimals;
        const underlyingToken = appTokens.find(v => v.address === underlyingTokenAddressRaw.toLowerCase());
        if (!underlyingToken) return null;

        // Display Props
        const label = getLabelFromToken(underlyingToken);
        const secondaryLabel = buildDollarDisplayItem(underlyingToken.price);
        const images = getImagesFromToken(underlyingToken);

        const wrappedToken: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          address: wrappedAaveTokenAddress,
          appId: BALANCER_V2_DEFINITION.id,
          groupId: BALANCER_V2_DEFINITION.groups.wrappedAave.id,
          network,
          symbol,
          decimals,
          supply,
          price: underlyingToken.price,
          pricePerShare: 1,
          tokens: [underlyingToken],

          dataProps: {},
          displayProps: {
            label,
            secondaryLabel,
            images,
          },
        };

        return wrappedToken;
      }),
    );

    return compact(wrappedTokens);
  }
}
