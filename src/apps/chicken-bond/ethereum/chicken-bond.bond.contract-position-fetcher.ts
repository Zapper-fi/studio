import { Inject, NotImplementedException } from '@nestjs/common';
import _, { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance, RawContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { DefaultContractPositionDefinition } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { ChickenBondBondNft, ChickenBondContractFactory } from '../contracts';

enum BondStatus {
  PENDING = 1,
  CANCELLED = 2,
  CLAIMED = 3,
}

@PositionTemplate()
export class EthereumChickenBondBondContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<ChickenBondBondNft> {
  groupLabel = 'Bond';
  BondManagerAddress = '0x57619fe9c539f890b19c61812226f9703ce37137';
  BondNftAddress = '0xa8384862219188a8f03c144953cf21fc124029ee';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ChickenBondContractFactory) protected readonly contractFactory: ChickenBondContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: this.BondNftAddress }];
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

  getContract(address: string): ChickenBondBondNft {
    return this.contractFactory.chickenBondBondNft({ network: this.network, address });
  }

  async getLabel(): Promise<string> {
    return `LUSD Bond`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const bondManagerContract = this.contractFactory.chickenBondManager({
      address: this.BondManagerAddress,
      network: this.network,
    });

    const bondNftContract = this.contractFactory.chickenBondBondNft({
      address: this.BondNftAddress,
      network: this.network,
    });
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    // Get bond Ids
    const mcBondNft = multicall.wrap(bondNftContract);
    const bondCount = Number(await mcBondNft.balanceOf(address));
    const bondIds = await Promise.all(range(bondCount).map(async i => mcBondNft.tokenOfOwnerByIndex(address, i)));
    const validBondIdsRaw = await Promise.all(
      bondIds.map(async bondId => {
        const bondStatus = await mcBondNft.getBondStatus(bondId);
        if (bondStatus !== BondStatus.PENDING) return null;

        return bondId;
      }),
    );
    const validBondIds = _.compact(validBondIdsRaw);
    if (validBondIds.length === 0) return [];

    const balances = await Promise.all(
      validBondIds.map(async bondId => {
        const [depositAmountRaw, claimableAmountRaw] = await Promise.all([
          multicall.wrap(bondNftContract).getBondAmount(bondId),
          multicall.wrap(bondManagerContract).calcAccruedBLUSD(bondId),
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

  async getRawBalances(address: string): Promise<RawContractPositionBalance[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const bondManagerContract = this.contractFactory.chickenBondManager({
      address: this.BondManagerAddress,
      network: this.network,
    });

    const bondNftContract = this.contractFactory.chickenBondBondNft({
      address: this.BondNftAddress,
      network: this.network,
    });

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    // Get bond Ids
    const mcBondNft = multicall.wrap(bondNftContract);
    const bondCount = Number(await mcBondNft.balanceOf(address));
    const bondIds = await Promise.all(range(bondCount).map(async i => mcBondNft.tokenOfOwnerByIndex(address, i)));
    const validBondIdsRaw = await Promise.all(
      bondIds.map(async bondId => {
        const bondStatus = await mcBondNft.getBondStatus(bondId);
        if (bondStatus !== BondStatus.PENDING) return null;

        return bondId;
      }),
    );
    const validBondIds = _.compact(validBondIdsRaw);
    if (validBondIds.length === 0) return [];

    const balances = await Promise.all(
      bondIds.map(async bondId => {
        const [depositAmountRaw, claimableAmountRaw] = await Promise.all([
          multicall.wrap(bondNftContract).getBondAmount(bondId),
          multicall.wrap(bondManagerContract).calcAccruedBLUSD(bondId),
        ]);

        const balance: RawContractPositionBalance = {
          key: this.appToolkit.getPositionKey(contractPositions[0]),
          tokens: [
            {
              key: this.appToolkit.getPositionKey(contractPositions[0].tokens[0]),
              balance: depositAmountRaw.toString(),
            },
            {
              key: this.appToolkit.getPositionKey(contractPositions[0].tokens[1]),
              balance: claimableAmountRaw.toString(),
            },
          ],
        };

        return balance;
      }),
    );

    return balances.flat();
  }
}
