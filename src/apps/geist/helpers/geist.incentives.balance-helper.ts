import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { GeistContractFactory } from '../contracts';
import { GEIST_DEFINITION } from '../geist.definition';

type GeistIncentivesBalanceParams = {
  address: string;
  network: Network;
};

@Injectable()
export class GeistIncentivesBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GeistContractFactory) private readonly contractFactory: GeistContractFactory,
  ) {}

  async getBalances({ address, network }: GeistIncentivesBalanceParams) {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: GEIST_DEFINITION.id,
      groupIds: [
        GEIST_DEFINITION.groups.supply.id,
        GEIST_DEFINITION.groups.variableDebt.id,
        GEIST_DEFINITION.groups.stableDebt.id,
      ],
      network,
    });

    const incentivesAddress = '0x297fddc5c33ef988dd03bd13e162ae084ea1fe57';
    const incentivesContract = this.contractFactory.geistRewards({ address: incentivesAddress, network });
    const assetAddresses = appTokens.map(v => v.address);
    const rewardBalanceRaw = await incentivesContract.claimableReward(address, assetAddresses, { from: address });

    const rewardToken = baseTokens.find(v => v.address === '0xd8321aa83fb0a4ecd6348d4577431310a6e0814d')!;
    const rewardTokenBalance = drillBalance(rewardToken, rewardBalanceRaw.toString());
    const tokens = [rewardTokenBalance];
    const balanceUSD = rewardTokenBalance.balanceUSD;

    // Display Props
    const label = `Claimable ${rewardToken.symbol}`;
    const secondaryLabel = buildDollarDisplayItem(rewardToken.price);
    const images = getImagesFromToken(rewardToken);

    const position: ContractPositionBalance = {
      type: ContractType.POSITION,
      address: incentivesAddress,
      network,
      appId: GEIST_DEFINITION.id,
      groupId: GEIST_DEFINITION.groups.incentives.id,
      tokens,
      balanceUSD,
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
