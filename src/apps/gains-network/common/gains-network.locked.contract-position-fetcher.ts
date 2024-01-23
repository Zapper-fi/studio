import { Inject, NotImplementedException } from '@nestjs/common';
import _, { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { GainsNetworkViemContractFactory } from '../contracts';
import { GainsNetworkGToken } from '../contracts/viem';

export abstract class GainsNetworkLockedContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<GainsNetworkGToken> {
  groupLabel = 'Locked';

  abstract gTokenAddress: string;
  abstract gTokenLockedDepositAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GainsNetworkViemContractFactory) protected readonly contractFactory: GainsNetworkViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: this.gTokenAddress }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.LOCKED,
        address: this.gTokenAddress,
        network: this.network,
      },
    ];
  }

  getContract(address: string) {
    return this.contractFactory.gainsNetworkGToken({ network: this.network, address });
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<GainsNetworkGToken>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const lockedDepositNftContract = this.contractFactory.gainsNetworkLockedDepositNft({
      address: this.gTokenLockedDepositAddress,
      network: this.network,
    });

    const gTokenContract = this.contractFactory.gainsNetworkGToken({
      address: this.gTokenAddress,
      network: this.network,
    });
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const numPositionsRaw = await multicall.wrap(lockedDepositNftContract).read.balanceOf([address]);

    const balances = await Promise.all(
      range(0, Number(numPositionsRaw)).map(async index => {
        const depositId = await multicall
          .wrap(lockedDepositNftContract)
          .read.tokenOfOwnerByIndex([address, BigInt(index)]);

        const deposit = await multicall.wrap(gTokenContract).read.lockedDeposits([depositId]);

        const depositAmount = drillBalance(contractPositions[0].tokens[0], deposit[1].toString());

        return {
          ...contractPositions[0],
          tokens: [depositAmount],
          balanceUSD: depositAmount.balanceUSD,
        };
      }),
    );

    return _.compact(balances);
  }
}
