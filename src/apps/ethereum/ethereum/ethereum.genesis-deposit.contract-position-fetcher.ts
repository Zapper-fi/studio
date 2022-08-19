import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ETHEREUM_DEFINITION } from '../ethereum.definition';

const appId = ETHEREUM_DEFINITION.id;
const groupId = ETHEREUM_DEFINITION.groups.genesisDeposit.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumEthereumGenesisDepositContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const eth2DepositAddress = '0x00000000219ab540356cbb839cbe05303d7705fa';
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const ethToken = baseTokens.find(v => v.address === ZERO_ADDRESS)!;
    const tokens = [supplied(ethToken)];

    const position: ContractPosition = {
      type: ContractType.POSITION,
      address: eth2DepositAddress,
      appId,
      groupId,
      network,
      tokens,
      dataProps: {},
      displayProps: {
        label: `${getLabelFromToken(ethToken)} in Eth2 Deposit`,
        secondaryLabel: buildDollarDisplayItem(ethToken.price),
        images: getImagesFromToken(ethToken),
      },
    };

    return [position];
  }
}
