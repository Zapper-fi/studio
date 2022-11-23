import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { HexContractFactory } from '../contracts';
import { HEX_DEFINITION } from '../hex.definition';

const appId = HEX_DEFINITION.id;
const groupId = HEX_DEFINITION.groups.stake.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumHexStakeContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(HexContractFactory) private readonly hexContractFactory: HexContractFactory,
  ) { }

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const hexToken = baseTokens.find(x => x.address === '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39');
    if (!hexToken) return [];
    const label = 'Staked ' + getLabelFromToken(hexToken);
    const images = getImagesFromToken(hexToken);
    const secondaryLabel = buildDollarDisplayItem(hexToken.price);
    const position: ContractPosition = {
      type: ContractType.POSITION,
      appId,
      groupId,
      address: hexToken.address,
      network,
      tokens: [supplied(hexToken)],
      dataProps: {},
      displayProps: {
        label,
        secondaryLabel,
        images,
      },
    };
    return [position];
  }
}
