import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
  TokenStageParams,
} from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types';

import { HectorNetworkFtmBondDepository, HectorNetworkContractFactory } from '../contracts';
import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

const appId = HECTOR_NETWORK_DEFINITION.id;
const groupId = HECTOR_NETWORK_DEFINITION.groups.ftmBond.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomHectorNetworkFtmBondContractPositionFetcher extends ContractPositionTemplatePositionFetcher<HectorNetworkFtmBondDepository> {
  appId = HECTOR_NETWORK_DEFINITION.id;
  groupId = HECTOR_NETWORK_DEFINITION.groups.ftmBond.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Bonds';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) protected readonly contractFactory: HectorNetworkContractFactory,
  ) {
    super(appToolkit);
  }

  async getDescriptors() {
    return [
      { address: '0xdd62c045d9a873f1206a5291dcf0ea9fc2aa8ddf' },
      { address: '0x4441f551001ab0785f1006929aa86d0c846f30cc' },
      { address: '0x312ade5a805e5f3975bbdbb9feb5ef4d1e15eb8f' },
    ];
  }

  getContract(address: string) {
    return this.contractFactory.hectorNetworkFtmBondDepository({ address, network: this.network });
  }

  async getTokenDescriptors({ contract }: TokenStageParams<HectorNetworkFtmBondDepository>) {
    const [principle, claimable] = await Promise.all([contract.principle(), contract.HEC()]);

    return [
      { address: claimable, metaType: MetaType.VESTING },
      { address: claimable, metaType: MetaType.CLAIMABLE },
      { address: principle, metaType: MetaType.SUPPLIED },
    ];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<HectorNetworkFtmBondDepository>) {
    return `${getLabelFromToken(contractPosition.tokens[2])} Bond`;
  }

  async getImages({ contractPosition }: DisplayPropsStageParams<HectorNetworkFtmBondDepository>) {
    return getImagesFromToken(contractPosition.tokens[2]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    multicall,
  }: GetTokenBalancesPerPositionParams<HectorNetworkFtmBondDepository>) {
    const count = await multicall.wrap(contract).depositCounts(address);
    const depositIds = await Promise.all(
      Array(count.toNumber()).map((_, i) => multicall.wrap(contract).ownedDeposits(address, i)),
    );
    const bondInfos = await Promise.all(depositIds.map(id => multicall.wrap(contract).bondInfo(id)));
    const claimablePayouts = await Promise.all(depositIds.map(id => multicall.wrap(contract).pendingPayoutFor(id)));

    let totalPayout = BigNumber.from(0);
    let totalClaimablePayout = BigNumber.from(0);
    bondInfos.forEach(info => (totalPayout = totalPayout.add(info.payout)));
    claimablePayouts.forEach(payout => (totalClaimablePayout = totalClaimablePayout.add(payout)));

    return [totalPayout.sub(totalClaimablePayout).toString(), totalClaimablePayout.toString()];
  }
}
