import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AIRSWAP_DEFINITION } from '../airswap.definition';
import { AirswapContractFactory } from '../contracts';

const appId = AIRSWAP_DEFINITION.id;
const groupId = AIRSWAP_DEFINITION.groups.sASTv2.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAirswapSAstV2TokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AirswapContractFactory) private readonly airswapContractFactory: AirswapContractFactory,
  ) {}

  async getPositions() {
    const address = '0x579120871266ccd8De6c85EF59E2fF6743E7CD15';
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.airswapContractFactory.stakingV2({ address, network });

    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);

    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokenDependencies.find(v => v.symbol === 'AST');

    if (!underlyingToken) {
      return [];
    }

    const supply = Number(supplyRaw) / 10 ** decimals;

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address,
      network,
      symbol,
      decimals,
      supply,
      tokens: [underlyingToken],
      price: underlyingToken.price,
      pricePerShare: 1,
      dataProps: {},
      displayProps: {
        label: 'sAST v2',
        secondaryLabel: buildDollarDisplayItem(underlyingToken.price),
        images: [getTokenImg(underlyingToken.address, network)],
      },
    };

    return [token];
  }
}
