import { Inject, NotImplementedException } from '@nestjs/common';
import _, { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
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

import { ChickenBondViemContractFactory } from '../contracts';
import { ChickenBondBondNft } from '../contracts/viem';

enum BondStatus {
  PENDING = 1,
  CANCELLED = 2,
  CLAIMED = 3,
}

@PositionTemplate()
export class EthereumChickenBondBondContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<ChickenBondBondNft> {
  groupLabel = 'Bond';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ChickenBondViemContractFactory) protected readonly contractFactory: ChickenBondViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xa8384862219188a8f03c144953cf21fc124029ee' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0xb9d7dddca9a4ac480991865efef82e01273f79c3',
        network: this.network,
      },
    ];
  }

  getContract(address: string) {
    return this.contractFactory.chickenBondBondNft({ network: this.network, address });
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<ChickenBondBondNft>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const bondManagerContract = this.contractFactory.chickenBondManager({
      address: '0x57619fe9c539f890b19c61812226f9703ce37137',
      network: this.network,
    });

    const bondNftContract = this.contractFactory.chickenBondBondNft({
      address: '0xa8384862219188a8f03c144953cf21fc124029ee',
      network: this.network,
    });
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const numPositionsRaw = await multicall.wrap(bondNftContract).read.balanceOf([address]);

    const balances = await Promise.all(
      range(0, Number(numPositionsRaw)).map(async index => {
        const bondId = await multicall.wrap(bondNftContract).read.tokenOfOwnerByIndex([address, BigInt(index)]);

        const bondStatus = await multicall.wrap(bondNftContract).read.getBondStatus([bondId]);
        if (bondStatus !== BondStatus.PENDING) return null;

        const [depositAmountRaw, claimableAmountRaw] = await Promise.all([
          multicall.wrap(bondNftContract).read.getBondAmount([bondId]),
          multicall.wrap(bondManagerContract).read.calcAccruedBLUSD([bondId]),
        ]);

        const depositAmount = drillBalance(contractPositions[0].tokens[0], depositAmountRaw.toString());
        const claimableBalance = drillBalance(contractPositions[0].tokens[1], claimableAmountRaw.toString());

        return {
          ...contractPositions[0],
          tokens: [depositAmount, claimableBalance],
          balanceUSD: depositAmount.balanceUSD + claimableBalance.balanceUSD,
        };
      }),
    );

    return _.compact(balances);
  }
}
