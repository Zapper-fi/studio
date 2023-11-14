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

import { ThalesViemContractFactory } from '../contracts';
import { Vaults } from '../contracts/viem';

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
    @Inject(ThalesViemContractFactory) private readonly contractFactory: ThalesViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.vaults({ network: this.network, address });
  }

  async getDefinitions(): Promise<ThalesVaultDefinition[]> {
    return this.vaultDefinitions;
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<Vaults>) {
    return [
      {
        address: await contract.read.sUSD(),
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel({ definition }: GetDisplayPropsParams<Vaults, DefaultDataProps, ThalesVaultDefinition>) {
    return `${definition.name}`;
  }

  async getDataProps({ contract, multicall }): Promise<ThalesVaultDataProp> {
    const currentRound = await contract.read.round();
    const liquidityRaw = await contract.read.allocationPerRound([currentRound]);
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

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Vaults>): Promise<BigNumberish[]> {
    const currentRound = await contract.read.round();
    const currentBalance = await contract.read.getBalancesPerRound([currentRound, address]);
    const pendingDeposit = await contract.read.getBalancesPerRound([currentRound + BigInt(1), address]);
    return [currentBalance + pendingDeposit];
  }
}
