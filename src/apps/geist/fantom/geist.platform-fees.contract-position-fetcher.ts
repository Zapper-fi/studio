import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { DisplayProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { GeistViemContractFactory } from '../contracts';
import { GeistStaking } from '../contracts/viem';

@PositionTemplate()
export class FantomGeistPlatformFeesPositionFetcher extends ContractPositionTemplatePositionFetcher<GeistStaking> {
  groupLabel = 'Platform Fees';

  isExcludedFromExplore = true;

  geistTokenAddress = '0xd8321aa83fb0a4ecd6348d4577431310a6e0814d';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GeistViemContractFactory) private readonly contractFactory: GeistViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    const geistStakingAddress = '0x49c93a95dbcc9a6a4d8f77e59c038ce5020e82f8';
    return [{ address: geistStakingAddress }];
  }

  getContract(address: string) {
    return this.contractFactory.geistStaking({ address, network: this.network });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<GeistStaking>) {
    const rewardTokenAddresses = await Promise.all(
      range(50).map(idx =>
        contract.read.rewardTokens([BigInt(idx)]).catch(e => {
          if (isViemMulticallUnderlyingError(e)) return null;
          throw e;
        }),
      ),
    ).then(addresses => compact(addresses));

    return [
      {
        metaType: MetaType.LOCKED,
        address: this.geistTokenAddress, // Locked GEIST
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: this.geistTokenAddress, // Vested/Unlocked GEIST
        network: this.network,
      },
      ...rewardTokenAddresses
        .map(address => ({
          metaType: MetaType.CLAIMABLE,
          address: address.toLowerCase(),
          network: this.network,
        }))
        .filter(({ address }) => address !== this.geistTokenAddress),
    ];
  }

  async getLabel(): Promise<string> {
    return 'GEIST Locking';
  }

  async getSecondaryLabel(params: GetDisplayPropsParams<GeistStaking>): Promise<DisplayProps['secondaryLabel']> {
    const rewardToken = params.contractPosition.tokens[0];
    return buildDollarDisplayItem(rewardToken.price);
  }

  async getImages(): Promise<string[]> {
    return [getTokenImg(this.geistTokenAddress, this.network)];
  }

  async getTokenBalancesPerPosition({ address, contract, contractPosition }: GetTokenBalancesParams<GeistStaking>) {
    const [lockedBalancesData, withdrawableDataRaw, platformFeesPlatformFees] = await Promise.all([
      contract.read.lockedBalances([address]),
      contract.read.withdrawableBalance([address]),
      contract.read.claimableRewards([address]),
    ]);

    const withdrawableBalanceRaw = BigNumber.from(withdrawableDataRaw[0]).add(withdrawableDataRaw[1]).toString();

    return contractPosition.tokens.map((token, idx) => {
      if (idx === 0) return lockedBalancesData[0]; // Locked GEIST
      if (idx === 1) return withdrawableBalanceRaw; // Vested/Unlocked GEIST

      const rewardTokenMatch = platformFeesPlatformFees.find(
        ({ token: tokenAddressRaw }) => tokenAddressRaw.toLowerCase() === token.address,
      );

      return rewardTokenMatch?.amount ?? 0;
    });
  }
}
