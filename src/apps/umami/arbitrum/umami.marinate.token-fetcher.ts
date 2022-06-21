import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { UmamiContractFactory } from '../contracts';
import { UMAMI_DEFINITION } from '../umami.definition';

const appId = UMAMI_DEFINITION.id;
const groupId = UMAMI_DEFINITION.groups.marinate.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumUmamiMarinateTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(UmamiContractFactory) private readonly umamiContractFactory: UmamiContractFactory,
  ) {}

  async getPositions() {
    const UMAMI_ADDRESS = '0x1622bF67e6e5747b81866fE0b85178a93C7F86e3'.toLowerCase();
    const mUMAMI_ADDRESS = '0x2AdAbD6E8Ce3e82f52d9998a7f64a90d294A92A4'.toLowerCase();
    const multicall = this.appToolkit.getMulticall(network);

    const contract = this.umamiContractFactory.umamiMarinate({
      address: mUMAMI_ADDRESS,
      network,
    });

    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);
    const supply = Number(supplyRaw) / 10 ** decimals;

    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokenDependencies.find(v => v.address === UMAMI_ADDRESS);
    if (!underlyingToken) return [];
    const tokens = [underlyingToken];
    const pricePerShare = 1.0;
    const price = pricePerShare * underlyingToken.price;
    const label = `Marinating UMAMI`;
    const images = getImagesFromToken(underlyingToken);
    const secondaryLabel = buildDollarDisplayItem(price);

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: mUMAMI_ADDRESS,
      network,
      symbol,
      decimals,
      supply,
      pricePerShare,
      price,
      tokens,
      dataProps: {},
      displayProps: {
        label,
        images,
        secondaryLabel,
      },
    };
    return [token];
  }
}
