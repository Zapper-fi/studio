import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { ArtGobblers, ArtGobblersContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumArGobblersClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<ArtGobblers> {
  groupLabel = 'Claimable Goo';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArtGobblersContractFactory) private readonly contractFactory: ArtGobblersContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x60bb1e2aa1c9acafb4d34f71585d7e959f387769' }];
  }

  async getTokenDefinitions() {
    return [{ metaType: MetaType.CLAIMABLE, address: '0x600000000a36f3cd48407e35eb7c5c910dc1f7a8' }];
  }

  getContract(address: string): ArtGobblers {
    return this.contractFactory.artGobblers({ network: this.network, address });
  }

  async getLabel(): Promise<string> {
    return `Claimable Goo`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<ArtGobblers>): Promise<BigNumberish[]> {
    const gooBalance = await contract.gooBalance(address);

    return [gooBalance];
  }
}
