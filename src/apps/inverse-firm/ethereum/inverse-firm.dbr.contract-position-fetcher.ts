import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { INVERSE_FIRM_DEFINITION } from '../inverse-firm.definition';
import _ from 'lodash';
import { ContractType } from '~position/contract.interface';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';

const appId = INVERSE_FIRM_DEFINITION.id;
const dbr = INVERSE_FIRM_DEFINITION.dbr;
const groupId = INVERSE_FIRM_DEFINITION.groups.dbr.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumInverseFirmDbrContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) { }

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const dbrToken = baseTokens.find(bt => bt.address === dbr.toLowerCase())!;

    const tokens = [
      {
        "type": dbrToken.type,
        "network": dbrToken.network,
        "address": dbrToken.address,
        "symbol": dbrToken.symbol,
        "decimals": dbrToken.decimals,
        "price": dbrToken.price,
        metaType: MetaType.WALLET,
      },
    ];

    const positions: ContractPosition[] = [
      {
        type: ContractType.POSITION,
        address: dbr,
        appId,
        groupId,
        network,
        tokens,
        dataProps: {},
        displayProps: {
          label: `${dbrToken.symbol}`,
          secondaryLabel: {
            type: 'dollar',
            value: dbrToken.price,
          },
          images: getImagesFromToken(dbrToken),
        },
      }
    ]

    return _.compact(positions);
  }
}
