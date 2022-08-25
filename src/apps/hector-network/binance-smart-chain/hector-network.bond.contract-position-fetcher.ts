import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';

import { HectorNetworkBscBondDepository, HectorNetworkContractFactory } from '../contracts';
import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

const appId = HECTOR_NETWORK_DEFINITION.id;
const groupId = HECTOR_NETWORK_DEFINITION.groups.bond.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainHectorNetworkBondContractPositionFetcher extends ContractPositionTemplatePositionFetcher<HectorNetworkBscBondDepository> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Bonds';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) protected readonly contractFactory: HectorNetworkContractFactory,
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
    return this.contractFactory.hectorNetworkBscBondDepository({ address, network: this.network });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<HectorNetworkBscBondDepository>) {
    const [principle, claimable] = await Promise.all([contract.principle(), contract.HEC()]);

    return [
      { address: claimable, metaType: MetaType.VESTING },
      { address: claimable, metaType: MetaType.CLAIMABLE },
      { address: principle, metaType: MetaType.SUPPLIED },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<HectorNetworkBscBondDepository>) {
    return `${getLabelFromToken(contractPosition.tokens[2])} Bond`;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<HectorNetworkBscBondDepository>) {
    return getImagesFromToken(contractPosition.tokens[2]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    multicall,
  }: GetTokenBalancesParams<HectorNetworkBscBondDepository>) {
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
