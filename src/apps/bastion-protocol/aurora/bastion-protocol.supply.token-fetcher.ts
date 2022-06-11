import { Inject } from '@nestjs/common';
import { formatUnits } from 'ethers/lib/utils';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem, buildPercentageDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { BalanceDisplayMode } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition, ExchangeableAppTokenDataProps } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionProtocolContractFactory } from '../contracts';
import { BastionSupplyTokenHelper } from '../helper/bastion-protocol.supply.token-helper';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const groupId = BASTION_PROTOCOL_DEFINITION.groups.supply.id;
const network = Network.AURORA_MAINNET;

export type BastionSupplyTokenDataProps = ExchangeableAppTokenDataProps & {
  supplyApy: number;
  borrowApy: number;
  liquidity: number;
  marketName?: string;
  comptrollerAddress: string;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraBastionProtocolSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(BastionSupplyTokenHelper) private readonly bastionSupplyTokenHelper: BastionSupplyTokenHelper,
  ) { }
  async getPositions() {
    return this.bastionSupplyTokenHelper.getTokens({
      comptrollerAddress: '0x6De54724e128274520606f038591A00C5E94a1F6',
      network,
      appId,
      groupId,
    });
  }
}
