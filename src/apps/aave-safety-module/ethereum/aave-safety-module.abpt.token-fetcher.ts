import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { MulticallService } from '~multicall/multicall.service';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AAVE_SAFETY_MODULE_DEFINITION } from '../aave-safety-module.definition';
import { AaveSafetyModuleContractFactory } from '../contracts';

type AaveSafetyModuleAbptTokenDataProps = {
  supply: number;
  liquidity: number;
  fee: number;
};

const appId = AAVE_SAFETY_MODULE_DEFINITION.id;
const groupId = AAVE_SAFETY_MODULE_DEFINITION.groups.abpt.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAaveSafetyModuleAbptTokenFetcher
  implements PositionFetcher<AppTokenPosition<AaveSafetyModuleAbptTokenDataProps>>
{
  readonly bptAddress = '0xc697051d1c6296c24ae3bcef39aca743861d9a81';
  readonly abptAddress = '0x41a08648c3766f9f9d85598ff102a08f4ef84f84';
  readonly aaveAddress = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';
  readonly wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MulticallService) protected readonly multicallService: MulticallService,
    @Inject(AaveSafetyModuleContractFactory) private readonly contractFactory: AaveSafetyModuleContractFactory,
  ) {}

  async getPositions() {
    const contractFactory = this.contractFactory;
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const aaveToken = baseTokens.find(p => p.address === this.aaveAddress);
    const wethToken = baseTokens.find(p => p.address === this.wethAddress);
    if (!aaveToken || !wethToken) return [];

    const abptContract = contractFactory.balancerAbpt({ network, address: this.abptAddress });
    const bptContract = contractFactory.balancerPoolToken({ network, address: this.bptAddress });

    const [symbol, decimals, supplyRaw, wethReserveRaw, aaveReserveRaw] = await Promise.all([
      multicall.wrap(abptContract).symbol(),
      multicall.wrap(abptContract).decimals(),
      multicall.wrap(abptContract).totalSupply(),
      multicall.wrap(bptContract).getBalance(wethToken.address),
      multicall.wrap(bptContract).getBalance(aaveToken.address),
    ]);

    // Data Props
    const supply = Number(supplyRaw) / 10 ** decimals;
    const aaveReserve = Number(aaveReserveRaw) / 10 ** aaveToken.decimals;
    const wethReserve = Number(wethReserveRaw) / 10 ** wethToken.decimals;
    const reserves = [aaveReserve, wethReserve];
    const liquidity = wethReserve * wethToken.price + aaveReserve * aaveToken.price;
    const price = liquidity / supply;
    const pricePerShare = [aaveReserve / supply, wethReserve / supply];
    const tokens = [aaveToken, wethToken];
    const reservePercentages = tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    const fee = 0.03;

    // Display Properties
    const label = `AAVE / ETH`;
    const secondaryLabel = reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
    const images = [getTokenImg(aaveToken.address, network), getTokenImg(wethToken.address, network)];
    const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

    const poolToken: AppTokenPosition<AaveSafetyModuleAbptTokenDataProps> = {
      type: ContractType.APP_TOKEN,
      network,
      address: this.abptAddress,
      appId,
      groupId,
      decimals,
      symbol,
      supply,
      tokens,
      price,
      pricePerShare,

      dataProps: {
        supply,
        liquidity,
        fee,
      },

      displayProps: {
        label,
        secondaryLabel,
        images,
        statsItems,
      },
    };

    return [poolToken];
  }
}
