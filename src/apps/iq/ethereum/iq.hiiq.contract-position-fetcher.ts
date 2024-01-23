import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { IqViemContractFactory } from '../contracts';
import { IqHiiq } from '../contracts/viem';

@PositionTemplate()
export class EthereumIqHiiqContractPositionFetcher extends ContractPositionTemplatePositionFetcher<IqHiiq> {
  groupLabel = 'Locked';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IqViemContractFactory) protected readonly iqContractFactory: IqViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.iqContractFactory.iqHiiq({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xb55dcc69d909103b4de773412a22ab8b86e8c602' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.LOCKED,
        address: '0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<IqHiiq>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getDataProps(_params: GetDataPropsParams<IqHiiq>) {
    const defaultDataProps = await super.getDataProps(_params);
    const { contract } = _params;
    const totalHiIQ = await contract.read.totalHiIQSupplyStored();
    const totalHiIQSupply = ethers.utils.formatUnits(totalHiIQ);
    return { ...defaultDataProps, totalHiIQSupply };
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<IqHiiq>) {
    const earned = await contract.read.earned([address]);
    return [earned];
  }
}
