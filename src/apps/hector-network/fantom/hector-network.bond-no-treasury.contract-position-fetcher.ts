import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';

import { HectorNetworkBondNoTreasury, HectorNetworkContractFactory } from '../contracts';
import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

@Injectable()
export class FantomHectorNetworkBondNoTreasuryContractPositionFetcher extends ContractPositionTemplatePositionFetcher<HectorNetworkBondNoTreasury> {
  appId = HECTOR_NETWORK_DEFINITION.id;
  groupId = HECTOR_NETWORK_DEFINITION.groups.bondNoTreasury.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Bonds';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) protected readonly contractFactory: HectorNetworkContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    return [
      { address: '0xdd62c045d9a873f1206a5291dcf0ea9fc2aa8ddf' },
      { address: '0x4441f551001ab0785f1006929aa86d0c846f30cc' },
      { address: '0x312ade5a805e5f3975bbdbb9feb5ef4d1e15eb8f' },
    ];
  }

  getContract(address: string) {
    return this.contractFactory.hectorNetworkBondNoTreasury({ address, network: this.network });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<HectorNetworkBondNoTreasury>) {
    const [principle, claimable] = await Promise.all([contract.principle(), contract.HEC()]);

    return [
      { address: claimable, metaType: MetaType.VESTING },
      { address: claimable, metaType: MetaType.CLAIMABLE },
      { address: principle, metaType: MetaType.SUPPLIED },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<HectorNetworkBondNoTreasury>) {
    return `${getLabelFromToken(contractPosition.tokens[2])} Bond`;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<HectorNetworkBondNoTreasury>) {
    return getImagesFromToken(contractPosition.tokens[2]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<HectorNetworkBondNoTreasury>) {
    const count = await contract.depositCounts(address);
    const depositIds = await Promise.all(range(0, Number(count)).map(i => contract.ownedDeposits(address, i)));
    const bondInfos = await Promise.all(depositIds.map(id => contract.bondInfo(id)));
    const claimablePayouts = await Promise.all(depositIds.map(id => contract.pendingPayoutFor(id)));

    const totalPayout = bondInfos.reduce((acc, v) => acc.add(v.payout), BigNumber.from(0));
    const totalClaimablePayout = claimablePayouts.reduce((acc, v) => acc.add(v), BigNumber.from(0));
    const totalVestingAmount = totalPayout.sub(totalClaimablePayout);

    return [totalVestingAmount, totalClaimablePayout];
  }
}
