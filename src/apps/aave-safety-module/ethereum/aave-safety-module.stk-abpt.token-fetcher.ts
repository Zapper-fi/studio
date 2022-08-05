import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition, ExchangeableAppTokenDataProps } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AAVE_SAFETY_MODULE_DEFINITION } from '../aave-safety-module.definition';
import { AaveSafetyModuleContractFactory } from '../contracts';

type AaveSafetyModuleStkAbptTokenDataProps = ExchangeableAppTokenDataProps & {
  apy: number;
  liquidity: number;
};

const appId = AAVE_SAFETY_MODULE_DEFINITION.id;
const groupId = AAVE_SAFETY_MODULE_DEFINITION.groups.stkAbpt.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAaveSafetyModuleStkAbptTokenFetcher
  implements PositionFetcher<AppTokenPosition<AaveSafetyModuleStkAbptTokenDataProps>>
{
  readonly stkAbptAddress = '0xa1116930326d21fb917d5a27f1e9943a9595fb47';

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AaveSafetyModuleContractFactory) private readonly contractFactory: AaveSafetyModuleContractFactory,
  ) {}

  async getPositions() {
    const contractFactory = this.contractFactory;
    const multicall = this.appToolkit.getMulticall(network);

    const dependencies = await this.appToolkit.getAppTokenPositions({
      appId: AAVE_SAFETY_MODULE_DEFINITION.id,
      groupIds: [AAVE_SAFETY_MODULE_DEFINITION.groups.abpt.id],
      network,
    });

    const stkAbptToken = dependencies[0];
    if (!stkAbptToken) return [];

    const stkAbptContract = contractFactory.balancerStkAbpt({ network, address: this.stkAbptAddress });
    const stkApyHelperContract = contractFactory.aaveStakedApyHelper({
      network,
      address: '0xa82247b44750ae23076d6746a9b5b8dc0ecbb646',
    });

    const [symbol, decimals, supplyRaw, stkAbptData] = await Promise.all([
      multicall.wrap(stkAbptContract).symbol(),
      multicall.wrap(stkAbptContract).decimals(),
      multicall.wrap(stkAbptContract).totalSupply(),
      multicall.wrap(stkApyHelperContract).getStkBptData(ZERO_ADDRESS),
    ]);

    const pricePerShare = 1; // Minted 1:1 with deposited AAVE
    const price = pricePerShare * stkAbptToken.price;
    const supply = Number(supplyRaw) / 10 ** decimals;
    const liquidity = price * supply;
    const apy = +stkAbptData[5] / 1e4;
    const tokens = [stkAbptToken];

    const stkAaveVaultToken: AppTokenPosition<AaveSafetyModuleStkAbptTokenDataProps> = {
      network,
      address: this.stkAbptAddress,
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
        label: stkAbptToken.displayProps.label,
        images: stkAbptToken.displayProps.images,
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
