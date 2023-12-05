import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { SiloFinanceViemContractFactory } from '../contracts';
import { SiloIncentives } from '../contracts/viem';

export type SiloFinanceIncentivesContractPositionDefinition = {
  address: string;
  sTokenAddresses: string[];
};

export type SiloFinanceIncentivesContractPositionDataProps = {
  sTokenAddresses: string[];
};

export abstract class SiloFinanceIncentivesContractPositionfetcher extends ContractPositionTemplatePositionFetcher<
  SiloIncentives,
  SiloFinanceIncentivesContractPositionDataProps,
  SiloFinanceIncentivesContractPositionDefinition
> {
  abstract incentivesAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SiloFinanceViemContractFactory) protected readonly contractFactory: SiloFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.siloIncentives({ address, network: this.network });
  }

  async getDefinitions(): Promise<SiloFinanceIncentivesContractPositionDefinition[]> {
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['s-tokens'],
    });

    const sTokenAddresses = appTokens.map(x => x.address);

    return [{ address: this.incentivesAddress, sTokenAddresses }];
  }

  async getTokenDefinitions({ contract }) {
    return [
      {
        address: await contract.read.REWARD_TOKEN(),
        metaType: MetaType.CLAIMABLE,
        network: this.network,
      },
    ];
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<
    SiloIncentives,
    SiloFinanceIncentivesContractPositionDataProps,
    SiloFinanceIncentivesContractPositionDefinition
  >) {
    return { sTokenAddresses: definition.sTokenAddresses };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SiloIncentives>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<SiloIncentives, SiloFinanceIncentivesContractPositionDataProps>): Promise<BigNumberish[]> {
    const sTokenAddresses = contractPosition.dataProps.sTokenAddresses;

    return [await contract.read.getRewardsBalance([sTokenAddresses, address])];
  }
}
