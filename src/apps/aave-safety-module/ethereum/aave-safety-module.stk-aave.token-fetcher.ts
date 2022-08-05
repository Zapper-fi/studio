import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition, ExchangeableAppTokenDataProps } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AAVE_SAFETY_MODULE_DEFINITION } from '../aave-safety-module.definition';
import { AaveSafetyModuleContractFactory } from '../contracts';

type AaveSafetyModuleStkAaveTokenDataProps = ExchangeableAppTokenDataProps & {
  apy: number;
  liquidity: number;
};

const appId = AAVE_SAFETY_MODULE_DEFINITION.id;
const groupId = AAVE_SAFETY_MODULE_DEFINITION.groups.stkAave.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAaveSafetyModuleStkAaveTokenFetcher
  implements PositionFetcher<AppTokenPosition<AaveSafetyModuleStkAaveTokenDataProps>>
{
  readonly stkAaveAddress = '0x4da27a545c0c5b758a6ba100e3a049001de870f5';
  readonly aaveAddress = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AaveSafetyModuleContractFactory) private readonly contractFactory: AaveSafetyModuleContractFactory,
  ) {}

  async getPositions() {
    const contractFactory = this.contractFactory;
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const aaveToken = baseTokens.find(p => p.address === this.aaveAddress);
    if (!aaveToken) return [];

    const stkAaveContract = contractFactory.stakedAave({ network, address: this.stkAaveAddress });
    const stkApyHelperContract = contractFactory.aaveStakedApyHelper({
      network,
      address: '0xa82247b44750ae23076d6746a9b5b8dc0ecbb646',
    });

    const [symbol, decimals, supplyRaw, stkAaveData] = await Promise.all([
      multicall.wrap(stkAaveContract).symbol(),
      multicall.wrap(stkAaveContract).decimals(),
      multicall.wrap(stkAaveContract).totalSupply(),
      multicall.wrap(stkApyHelperContract).getStkAaveData(ZERO_ADDRESS),
    ]);

    const pricePerShare = 1; // Minted 1:1 with deposited AAVE
    const price = pricePerShare * aaveToken.price;
    const supply = Number(supplyRaw) / 10 ** decimals;
    const liquidity = price * supply;
    const apy = +stkAaveData[5] / 1e4;
    const tokens = [aaveToken];

    const stkAaveVaultToken: AppTokenPosition<AaveSafetyModuleStkAaveTokenDataProps> = {
      network,
      address: this.stkAaveAddress,
      appId,
      groupId,
      type: ContractType.APP_TOKEN,
      symbol,
      decimals,
      supply,
      pricePerShare,
      price,
      tokens,

      dataProps: {
        apy,
        liquidity,
        exchangeable: true,
      },

      displayProps: {
        label: aaveToken.symbol,
        images: [getTokenImg(aaveToken.address, network)],
        secondaryLabel: buildDollarDisplayItem(price),
        statsItems: [
          { label: 'APY', value: buildPercentageDisplayItem(apy) },
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
        ],
      },
    };

    return [stkAaveVaultToken];
  }
}
