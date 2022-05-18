import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { ContractType } from '~position/contract.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

const appId = SOLACE_DEFINITION.id;
const groupId = SOLACE_DEFINITION.groups.policies.id;
const network = Network.ETHEREUM_MAINNET;

const DAI_ADDRESS                  = "0x6b175474e89094c44da98b954eedeac495271d0f";
const SOLACE_COVER_PRODUCT_ADDRESS = "0x501acebe29eabc346779bcb5fd62eaf6bfb5320e";

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSolacePoliciesContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const dai = baseTokens.find((v:any) => v.address === DAI_ADDRESS);
    const tokens = ((!!dai)
      ? [supplied(dai)]
      : []);
    return [{
      type: ContractType.POSITION,
      appId,
      groupId,
      address: SOLACE_COVER_PRODUCT_ADDRESS,
      network,
      tokens
    }];
  }
}
