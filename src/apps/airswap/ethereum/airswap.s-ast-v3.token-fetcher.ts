import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AirswapContractFactory } from '../contracts';
import { AIRSWAP_DEFINITION } from '../airswap.definition';
import { ContractType } from '~position/contract.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';

const appId = AIRSWAP_DEFINITION.id;
const groupId = AIRSWAP_DEFINITION.groups.sASTv3.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAirswapSAstV3TokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AirswapContractFactory) private readonly airswapContractFactory: AirswapContractFactory,
  ) {}

  async getPositions() {
    const address = '0x6d88B09805b90dad911E5C5A512eEDd984D6860B';
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.airswapContractFactory.stakingV3({ address, network });

    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);

    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokenDependencies.find(v => v.symbol === AIRSWAP_DEFINITION.symbol);

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
        label: 'sAST v3',
        secondaryLabel: buildDollarDisplayItem(underlyingToken.price),
        images: [getTokenImg(underlyingToken.address, network)],
      },
    };

    return [token];
  }
}
