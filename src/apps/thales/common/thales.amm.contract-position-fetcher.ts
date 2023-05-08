import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams, GetTokenDefinitionsParams, GetDisplayPropsParams } from '~position/template/contract-position.template.types';
import { DefaultDataProps } from '~position/display.interface';

import { Amm, ThalesContractFactory } from '../contracts';

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
    @Inject(ThalesContractFactory) private readonly contractFactory: ThalesContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Amm {
    return this.contractFactory.amm({ network: this.network, address });
  }

  async getDefinitions(): Promise<ThalesAmmDefinition[]> {
    return this.ammDefinitions;
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<Amm>) {
    return [
      {
        address: await contract.sUSD(),
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel({ definition }: GetDisplayPropsParams<Amm, DefaultDataProps, ThalesAmmDefinition>) {
    return `${definition.name}`;
  }

  async getDataProps({ contract, multicall }): Promise<ThalesAMMDataProp> {
    const liquidityRaw = await contract.totalDeposited();
    const underlyingTokenAddress = await contract.sUSD();
    const underlyingTokenContract = this.appToolkit.globalContracts.erc20({ address: underlyingTokenAddress, network: this.network });
    const decimals = await multicall.wrap(underlyingTokenContract).decimals()
    return {
      liquidity: Number(liquidityRaw) / 10 ** decimals
    };
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<Amm>): Promise<BigNumberish[]> {
    const currentRound = await contract.round();
    const currentBalance = await contract.balancesPerRound(Number(currentRound), address);
    const pendingDeposit = await contract.balancesPerRound(Number(currentRound) + 1, address);

    return [currentBalance.add(pendingDeposit)];
  }
}
