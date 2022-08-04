import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { PlutusContractFactory } from '../contracts';
import { PLUTUS_DEFINITION } from '../plutus.definition';

const appId = PLUTUS_DEFINITION.id;
const groupId = PLUTUS_DEFINITION.groups.tge.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPlutusTgeContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) private readonly contractFactory: PlutusContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const address = '0x35cd01aaa22ccae7839dfabe8c6db2f8e5a7b2e0';
    const underlyingToken = baseTokens.find(v => v.address === ZERO_ADDRESS)!;

    const position: ContractPosition = {
      type: ContractType.POSITION,
      address,
      appId,
      groupId,
      network,
      tokens: [supplied(underlyingToken)],
      dataProps: {},
      displayProps: {
        label: `${getLabelFromToken(underlyingToken)} in Private TGE`,
        images: getImagesFromToken(underlyingToken),
      },
    };

    return [position];
  }
}
