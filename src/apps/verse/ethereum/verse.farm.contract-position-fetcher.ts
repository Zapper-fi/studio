import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { VerseContractFactory, VerseFarm } from '../contracts';

@PositionTemplate()
export class EthereumVerseFarmContractPositionFetcher extends ContractPositionTemplatePositionFetcher<VerseFarm> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VerseContractFactory) protected readonly contractFactory: VerseContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VerseFarm {
    return this.contractFactory.verseFarm({ address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const definitions = [
      { address: '0xded0c22acd80e7a4bd6ec91ced451fc83f04cab2' },
      { address: '0xdd5a9eec299b74b2db2d3430608c1c5a8d9598eb' },
      { address: '0xc5af93687088c28da839371f3249df757b219aa8' },
      { address: '0x4e1f1206f2b9a651ecf2d49c5d33761861d4910c' },
      { address: '0x4efff28192029bdb1ac027c53674721875da6b10' },
      { address: '0x4ba48df24008429ae9140a01e0d002f5fa6a125d' },
      { address: '0x17bdceec80d3506e384db09e5d5696edf70605ef' },
      { address: '0x8295e4b84335af685e596dbcd76bbbbadbf88b01' },
    ];

    return definitions;
  }

  async getTokenDefinitions({
    contract,
  }: GetTokenDefinitionsParams<VerseFarm, DefaultContractPositionDefinition>): Promise<
    UnderlyingTokenDefinition[] | null
  > {
    return [
      {
        address: await contract.stakeToken(),
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
      {
        address: await contract.rewardToken(),
        metaType: MetaType.CLAIMABLE,
        network: this.network,
      },
    ];
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<VerseFarm, DefaultDataProps, DefaultContractPositionDefinition>): Promise<string> {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<Contract, DefaultDataProps>): Promise<BigNumberish[]> {
    return [await contract.balanceOf(address), await contract.earned(address)];
  }
}
