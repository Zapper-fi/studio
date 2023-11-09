import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { Hex, HexContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumHexStakeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Hex> {
  groupLabel = 'Staked HEX';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HexViemContractFactory) protected readonly contractFactory: HexViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Hex {
    return this.contractFactory.hex({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39' }];
  }

  async getTokenDefinitions() {
    return [
      { metaType: MetaType.SUPPLIED, address: '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39', network: this.network },
    ];
  }

  async getDataProps({
    contract,
    contractPosition,
  }: GetDataPropsParams<Hex, DefaultDataProps, DefaultContractPositionDefinition>): Promise<DefaultDataProps> {
    const hexToken = contractPosition.tokens.find(isSupplied)!;

    const [stakedAndUnstakedSupply, unstakedSupply, currentDay] = await Promise.all([
      contract.allocatedSupply(),
      contract.totalSupply(),
      contract.currentDay(),
    ]);

    const stakedSupply = Number(stakedAndUnstakedSupply.toBigInt() - unstakedSupply.toBigInt());
    const liquidity = (stakedSupply / 10 ** hexToken.decimals) * hexToken.price;

    // HEX Average APR is the latest daily payout annualized divided by total amount staked
    const [latestDailyData] = await Promise.all([
      // Need to use day - 1 as data is only available for previous day
      contract.dailyData(currentDay.toNumber() - 1),
    ]);

    const apy = (Number(latestDailyData.dayPayoutTotal) / stakedSupply) * 100 * 365;

    return { liquidity, apy };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<Hex>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Hex, DefaultDataProps>) {
    const stakeCount = await contract.stakeCount(address);
    if (stakeCount.isZero()) return [0];

    const allStakes = await Promise.all(range(0, +stakeCount).map(i => contract.stakeLists(address, i)));
    const totalStaked = allStakes.reduce((acc, v) => acc.add(v.stakedHearts), BigNumber.from(0));
    return [totalStaked.toString()];
  }
}
