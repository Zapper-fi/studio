import { Inject } from '@nestjs/common';
import Axios from 'axios';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { AAVE_V2_DEFINITION } from '~apps/aave-v2/aave-v2.definition';
import { COMPOUND_DEFINITION } from '~apps/compound/compound.definition';
import { YEARN_DEFINITION } from '~apps/yearn/yearn.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { EaseContractFactory, EaseRcaShield } from '../contracts';
import { EASE_DEFINITION } from '../ease.definition';

const appId = EASE_DEFINITION.id;
const groupId = EASE_DEFINITION.groups.rca.id;
const network = Network.ETHEREUM_MAINNET;

export type EaseRcaVaultDetails = {
  symbol: string;
  name: string;
  address: string;
  apy: number;
  token: [];
};

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumEaseRcaTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(EaseContractFactory) private readonly easeContractFactory: EaseContractFactory,
  ) {}

  async getPositions() {
    const endpoint = 'https://app.ease.org/api/v1/vaults';
    const ethData = await Axios.get<EaseRcaVaultDetails[]>(endpoint).then(v => v.data);
    const rcaAddressToDetails = _.keyBy(ethData, v => v.address.toLowerCase());
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<EaseRcaShield>({
      appId,
      groupId,
      network,
      dependencies: [
        { appId: YEARN_DEFINITION.id, groupIds: [YEARN_DEFINITION.groups.vault.id], network },
        { appId: AAVE_V2_DEFINITION.id, groupIds: [AAVE_V2_DEFINITION.groups.supply.id], network },
        { appId: COMPOUND_DEFINITION.id, groupIds: [COMPOUND_DEFINITION.groups.supply.id], network },
        //TODO: migrate
        { appId: 'sushiswap', groupIds: ['pool'], network },
        { appId: 'convex', groupIds: ['deposit'], network },
      ],
      resolveContract: ({ address, network }) => this.easeContractFactory.easeRcaShield({ address, network }),
      resolveVaultAddresses: async () => ethData.map(({ address }) => address.toLowerCase()),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) =>
        multicall
          .wrap(contract)
          .uToken()
          .catch(() => ''),
      resolveReserve: async ({ underlyingToken, multicall, address }) =>
        multicall
          .wrap(this.appToolkit.globalContracts.erc20(underlyingToken))
          .balanceOf(address)
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: () => 1,
      resolveApy: async ({ vaultAddress }) => (await (rcaAddressToDetails[vaultAddress]?.token['apy'] ?? 0)) / 100,
    });
  }
}
