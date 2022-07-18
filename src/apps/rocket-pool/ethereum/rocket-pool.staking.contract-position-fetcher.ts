import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ROCKET_POOL_DEFINITION } from '../rocket-pool.definition';

const appId = ROCKET_POOL_DEFINITION.id;
const groupId = ROCKET_POOL_DEFINITION.groups.staking.id;
const network = Network.ETHEREUM_MAINNET;
const rocketNodeStakingAddress = '0x3019227b2b8493e45bf5d25302139c9a2713bf15';
const rocketTokenRPLAddress = '0xd33526068d116ce69f19a9ee46f0bd304f21a51f';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumRocketPoolStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const rpl = baseTokens.find(v => v.address === rocketTokenRPLAddress)!;

    const position: ContractPosition = {
      type: ContractType.POSITION,
      address: rocketNodeStakingAddress,
      network,
      appId,
      groupId,
      tokens: [supplied(rpl)],
      dataProps: {},
      displayProps: {
        label: `Staked ${rpl.symbol}`,
        images: getImagesFromToken(rpl),
      },
    };

    return [position];
  }
}
