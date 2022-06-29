import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, locked } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { GRO_DEFINITION } from '../gro.definition';

const appId = GRO_DEFINITION.id;
const groupId = GRO_DEFINITION.groups.vesting.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumGroVestingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const groVestingAddress = '0x748218256afe0a19a88ebeb2e0c5ce86d2178360';
    const groDaoToken = '0x3ec8798b81485a254928b70cda1cf0a2bb0b74d7';
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokens.find(v => v.address === groDaoToken.toLowerCase());
    const tokens = [locked(underlyingToken!), claimable(underlyingToken!)];

    const position: ContractPosition = {
      type: ContractType.POSITION,
      appId,
      groupId,
      address: groVestingAddress.toLowerCase(),
      network,
      tokens,
      dataProps: {},
      displayProps: { label: `Vesting ${underlyingToken!.symbol}`, images: [] },
    };

    return [position];
  }
}
