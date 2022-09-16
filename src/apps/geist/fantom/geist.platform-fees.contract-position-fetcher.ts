import { Inject } from '@nestjs/common';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { DisplayProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { GeistContractFactory, GeistStaking } from '../contracts';

@PositionTemplate()
export class FantomGeistPlatformFeesPositionFetcher extends ContractPositionTemplatePositionFetcher<GeistStaking> {
  groupLabel = 'Platform Fees';

  isExcludedFromExplore = true;

  geistTokenAddress = '0xd8321aa83fb0a4ecd6348d4577431310a6e0814d';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GeistContractFactory) private readonly contractFactory: GeistContractFactory,
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
        contract.rewardTokens(idx).catch(e => {
          if (isMulticallUnderlyingError(e)) return null;
          throw e;
        }),
      ),
    ).then(addresses => compact(addresses));

    return [
      { address: this.geistTokenAddress, metaType: MetaType.LOCKED }, // Locked GEIST
      { address: this.geistTokenAddress, metaType: MetaType.CLAIMABLE }, // Unlocked GEIST
      { address: this.geistTokenAddress, metaType: MetaType.CLAIMABLE }, // Vested GEIST
      ...rewardTokenAddresses.map(address => ({ address: address.toLowerCase(), metaType: MetaType.CLAIMABLE })),
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
    const [lockedBalancesData, withdrawableDataRaw, unlockedBalanceRaw, platformFeesPlatformFees] = await Promise.all([
      contract.lockedBalances(address),
      contract.withdrawableBalance(address),
      contract.unlockedBalance(address),
      contract.claimableRewards(address),
    ]);

    const vestedBalanceRaw = withdrawableDataRaw.amount
      .add(withdrawableDataRaw.penaltyAmount)
      .sub(unlockedBalanceRaw)
      .toString();

    return contractPosition.tokens.map((token, idx) => {
      if (idx === 0) return lockedBalancesData.total; // Locked GEIST
      if (idx === 1) return unlockedBalanceRaw; // Unlocked GEIST
      if (idx === 2) return vestedBalanceRaw; // Vested GEIST

      const rewardTokenMatch = platformFeesPlatformFees.find(
        ([tokenAddressRaw]) => tokenAddressRaw.toLowerCase() === token.address,
      );

      return rewardTokenMatch?.amount ?? 0;
    });
  }
}
