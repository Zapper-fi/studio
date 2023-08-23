
import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { YamatoContractFactory } from '../contracts';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { Yamato } from '../contracts/ethers/Yamato';

@PositionTemplate()
export class EthereumYamatoPledgeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Yamato, DefaultDataProps, DefaultContractPositionDefinition> {
  groupLabel: 'Pledge';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YamatoContractFactory) protected readonly yamatoContractFactory: YamatoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Yamato {
    return this.yamatoContractFactory.yamato({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x02Fe72b2E9fF717EbF3049333B184E9Cd984f257' }];
  }


  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: ZERO_ADDRESS, // ETH
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: '0x1cfa5641c01406ab8ac350ded7d735ec41298372', // CJPY
        network: this.network,
      },
    ];
  }

  async getLabel() {
    return `Supplied ETH, Borrowed CJPY in Yamato`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Yamato>): Promise<BigNumberish[]> {
    const pledge = await contract.getPledge(address);
    const coll = pledge[0];
    const debt = pledge[1];
    return [coll, debt];
  }
}