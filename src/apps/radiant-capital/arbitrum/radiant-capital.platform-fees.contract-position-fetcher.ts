import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { DisplayProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { RadiantCapitalViemContractFactory } from '../contracts';
import { RadiantCapitalPlatformFees } from '../contracts/viem/RadiantCapitalPlatformFees';

@PositionTemplate()
export class ArbitrumRadiantCapitalPlatformFeesPositionFetcher extends ContractPositionTemplatePositionFetcher<RadiantCapitalPlatformFees> {
  groupLabel = 'Platform Fees';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RadiantCapitalViemContractFactory) private readonly contractFactory: RadiantCapitalViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    const radiantStakingAddress = '0xc2054a8c33bfce28de8af4af548c48915c455c13';
    return [{ address: radiantStakingAddress }];
  }

  getContract(address: string) {
    return this.contractFactory.radiantCapitalPlatformFees({ address, network: this.network });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<RadiantCapitalPlatformFees>) {
    const [rewards, radiantTokenAddressRaw] = await Promise.all([
      contract.read.claimableRewards([ZERO_ADDRESS]),
      contract.read.stakingToken(),
    ]);
    const rewardTokenAddressesRaw = rewards
      .map(x => x.token.toLowerCase())
      .filter(x => x !== '0x8de8b6865c65f91314695a8eac64c2d006087141'); // DAOT market doensn't exist

    return [
      {
        metaType: MetaType.LOCKED,
        address: radiantTokenAddressRaw.toLowerCase(), // Locked RDNT
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: radiantTokenAddressRaw.toLowerCase(), // Vested/Unlocked RDNT
        network: this.network,
      },
      ...rewardTokenAddressesRaw
        .map(address => ({
          metaType: MetaType.CLAIMABLE,
          address: address.toLowerCase(),
          network: this.network,
        }))
        .filter(({ address }) => address !== radiantTokenAddressRaw.toLowerCase()),
    ];
  }

  async getLabel(): Promise<string> {
    return 'RADIANT Locking';
  }

  async getSecondaryLabel(
    params: GetDisplayPropsParams<RadiantCapitalPlatformFees>,
  ): Promise<DisplayProps['secondaryLabel']> {
    const rewardToken = params.contractPosition.tokens[0];
    return buildDollarDisplayItem(rewardToken.price);
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<RadiantCapitalPlatformFees>): Promise<string[]> {
    return [getTokenImg(contractPosition.tokens[1].address, this.network)];
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<RadiantCapitalPlatformFees>) {
    const [lockedBalancesData, withdrawableDataRaw, platformFeesPlatformFees] = await Promise.all([
      contract.read.lockedBalances([address]),
      contract.read.withdrawableBalance([address]),
      contract.read.claimableRewards([address]),
    ]);

    const withdrawableBalanceRaw = BigNumber.from(withdrawableDataRaw[0]).sub(withdrawableDataRaw[1]).toString();

    return contractPosition.tokens.map((token, idx) => {
      if (idx === 0) return lockedBalancesData[0]; // Locked RDNT
      if (idx === 1) return withdrawableBalanceRaw; // Vested/Unlocked RDNT

      const rewardTokenMatch = platformFeesPlatformFees.find(
        ({ token: tokenAddressRaw }) => tokenAddressRaw.toLowerCase() === token.address,
      );

      return rewardTokenMatch?.amount ?? 0;
    });
  }
}
