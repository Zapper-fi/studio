import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';

import { ThalesViemContractFactory } from '../contracts';
import { Amm } from '../contracts/viem';

export type ThalesAmmDefinition = {
  address: string;
  name: string;
};

export type ThalesAMMDataProp = {
  liquidity: number;
};

export abstract class ThalesAmmContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Amm> {
  groupLabel = 'AMM LP';
  abstract ammDefinitions: ThalesAmmDefinition[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ThalesViemContractFactory) private readonly contractFactory: ThalesViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.amm({ network: this.network, address });
  }

  async getDefinitions(): Promise<ThalesAmmDefinition[]> {
    return this.ammDefinitions;
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<Amm>) {
    return [
      {
        address: await contract.read.sUSD(),
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel({ definition }: GetDisplayPropsParams<Amm, DefaultDataProps, ThalesAmmDefinition>) {
    return `${definition.name}`;
  }

  async getDataProps({ contract, multicall }): Promise<ThalesAMMDataProp> {
    const liquidityRaw = await contract.read.totalDeposited();
    const underlyingTokenAddress = await contract.read.sUSD();
    const underlyingTokenContract = this.appToolkit.globalViemContracts.erc20({
      address: underlyingTokenAddress,
      network: this.network,
    });
    const decimals = await multicall.wrap(underlyingTokenContract).read.decimals();
    return {
      liquidity: Number(liquidityRaw) / 10 ** decimals,
    };
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Amm>): Promise<BigNumberish[]> {
    const currentRound = await contract.read.round();
    const currentBalance = await contract.read.balancesPerRound([currentRound, address]);
    const pendingDeposit = await contract.read.balancesPerRound([currentRound + BigInt(1), address]);
    return [currentBalance + pendingDeposit];
  }
}
