import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { HectorNetworkViemContractFactory } from '../contracts';
import { HectorNetworkBondNoTreasury } from '../contracts/viem';

@PositionTemplate()
export class BinanceSmartChainHectorNetworkBondNoTreasuryContractPositionFetcher extends ContractPositionTemplatePositionFetcher<HectorNetworkBondNoTreasury> {
  groupLabel = 'Bonds';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkViemContractFactory) protected readonly contractFactory: HectorNetworkViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    return [
      { address: '0xf28390501753275d12f750c759baf7365368499f' },
      { address: '0x23b9bf624f6fa56cad401586f477c32f3a41d852' },
      { address: '0x4f4271cd7a7ebd5ca908effaf35c06a208c8c2b2' },
    ];
  }

  getContract(address: string) {
    return this.contractFactory.hectorNetworkBondNoTreasury({ address, network: this.network });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<HectorNetworkBondNoTreasury>) {
    const [principle, claimable] = await Promise.all([contract.read.principle(), contract.read.HEC()]);

    return [
      {
        metaType: MetaType.VESTING,
        address: claimable,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: claimable,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: principle,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<HectorNetworkBondNoTreasury>) {
    return `${getLabelFromToken(contractPosition.tokens[2])} Bond`;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<HectorNetworkBondNoTreasury>) {
    return getImagesFromToken(contractPosition.tokens[2]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<HectorNetworkBondNoTreasury>) {
    const count = await contract.read.depositCounts([address]);
    const depositIds = await Promise.all(
      range(0, Number(count)).map(i => contract.read.ownedDeposits([address, BigInt(i)])),
    );
    const bondInfos = await Promise.all(depositIds.map(id => contract.read.bondInfo([id])));
    const claimablePayouts = await Promise.all(depositIds.map(id => contract.read.pendingPayoutFor([id])));

    const totalPayout = bondInfos.reduce((acc, v) => acc.add(v[0]), BigNumber.from(0));
    const totalClaimablePayout = claimablePayouts.reduce((acc, v) => acc.add(v), BigNumber.from(0));
    const totalVestingAmount = totalPayout.sub(totalClaimablePayout);

    return [totalVestingAmount, totalClaimablePayout];
  }
}
