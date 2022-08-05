import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types';

import PLUTUS_DEFINITION from '../plutus.definition';

import { ADDRESSES } from './consts';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.tgeClaimable.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusTgeClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const plsToken = baseTokens.find(v => v.address === ADDRESSES.pls);
    if (!plsToken) return [];

    const position: ContractPosition = {
      type: ContractType.POSITION,
      address: '0x04b724389dd28ffc9a3a91ab4149a77530282f04',
      appId,
      groupId,
      network,
      tokens: [plsToken],
      dataProps: {},
      displayProps: {
        label: `Claimable ${plsToken.symbol}`,
        secondaryLabel: buildDollarDisplayItem(plsToken.price),
        images: getImagesFromToken(plsToken),
      },
    };

    return [position];
  }
}
