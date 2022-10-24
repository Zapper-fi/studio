import { Inject, Injectable } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { CompoundContractFactory } from '../contracts';

import { CompoundClaimablePositionDataProps } from './damm.claimable.contract-position-helper';

type CompoundBalanceHelperParams = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
};

@Injectable()
export class CompoundClaimableBalanceHelper {
  constructor(
    @Inject(CompoundContractFactory) private readonly compoundContractFactory: CompoundContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) { }

  async getBalances({ address, network, appId, groupId }: CompoundBalanceHelperParams) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances<CompoundClaimablePositionDataProps>(
      {
        network,
        appId,
        groupId,
        address,
        resolveBalances: async ({ address, network, contractPosition }) => {
          const [rewardToken] = contractPosition.tokens;
          const {
            address: comptrollerAddress,
            dataProps: { lensAddress },
          } = contractPosition;

          const lensContract = this.compoundContractFactory.compoundLens({ address: lensAddress, network });
          const rewardMetadata = await lensContract.callStatic.getCompBalanceMetadataExt(
            rewardToken.address,
            comptrollerAddress,
            address,
          );

          const rewardBalanceRaw = rewardMetadata[3];
          return [drillBalance(rewardToken, rewardBalanceRaw.toString())];
        },
      },
    );
  }
}
