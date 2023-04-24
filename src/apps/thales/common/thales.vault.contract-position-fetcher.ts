import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { Vaults, ThalesContractFactory } from '../contracts';

export type ThalesVaultDefinition = {
  address: string;
  name: string;
};

export type ThalesVaultDataProp = {
  liquidity: number;
};

export abstract class ThalesVaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Vaults> {
  groupLabel = 'Vault';
  abstract vaultDefinitions: ThalesVaultDefinition[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) private readonly contractFactory: ThalesContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Vaults {
    return this.contractFactory.vaults({ network: this.network, address });
  }

  async getDefinitions(): Promise<ThalesVaultDefinition[]> {
    return this.vaultDefinitions;
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<Vaults>) {
    return [
      {
        address: await contract.sUSD(),
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel({ definition }: GetDisplayPropsParams<Vaults, DefaultDataProps, ThalesVaultDefinition>) {
    return `${definition.name}`;
  }

  async getDataProps({ contract, multicall }): Promise<ThalesVaultDataProp> {
    const currentRound = await contract.round();
    const liquidityRaw = await contract.allocationPerRound(currentRound);
    const underlyingTokenAddress = await contract.sUSD();
    const underlyingTokenContract = this.appToolkit.globalContracts.erc20({ address: underlyingTokenAddress, network: this.network });
    const decimals = await multicall.wrap(underlyingTokenContract).decimals()
    return {
      liquidity: Number(liquidityRaw) / 10 ** decimals
    };
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Vaults>): Promise<BigNumberish[]> {
    const currentRound = await contract.round();
    const currentBalance = await contract.getBalancesPerRound(Number(currentRound), address);
    const pendingDeposit = await contract.getBalancesPerRound(Number(currentRound) + 1, address);

    return [currentBalance.add(pendingDeposit)];
  }
}
