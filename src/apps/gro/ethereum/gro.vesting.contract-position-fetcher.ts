import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, locked } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { GroContractFactory } from '../contracts';
import { GRO_DEFINITION } from '../gro.definition';

const appId = GRO_DEFINITION.id;
const groupId = GRO_DEFINITION.groups.vesting.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumGroVestingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GroContractFactory) private readonly groContractFactory: GroContractFactory,
  ) {}

  async getPositions() {
    const groVestingAddress = '0x748218256AfE0A19a88EBEB2E0C5Ce86d2178360';
    const groDaoToken = '0x3Ec8798B81485A254928B70CDA1cf0A2BB0B74D7';
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
