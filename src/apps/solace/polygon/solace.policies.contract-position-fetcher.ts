import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { ContractType } from '~position/contract.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';
import { Token } from '~position/position.interface';
import { WithMetaType } from '~position/display.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

const appId = SOLACE_DEFINITION.id;
const groupId = SOLACE_DEFINITION.groups.policies.id;
const network = Network.POLYGON_MAINNET;

const FRAX_ADDRESS                 = "0x45c32fa6df82ead1e2ef74d17b76547eddfaff89";
const SOLACE_COVER_PRODUCT_ADDRESS = "0x501acec83d440c00644ca5c48d059e1840852a64";

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonSolacePoliciesContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const frax = baseTokens.find((t:WithMetaType<Token>) => t.address === FRAX_ADDRESS);
    const tokens = ((!!frax)
      ? [supplied(frax)]
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
