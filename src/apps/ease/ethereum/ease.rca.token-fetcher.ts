import { Inject } from '@nestjs/common';
import Axios from 'axios';
import _, { add } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { YEARN_DEFINITION } from '~apps/yearn/yearn.definition';

import { EaseContractFactory, EaseRcaShield } from '../contracts';
import { EaseRcaShieldOnsen, EaseRcaShield__factory } from '../contracts/ethers';
import { EASE_DEFINITION } from '../ease.definition';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';

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

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumEaseRcaTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(EaseContractFactory) private readonly easeContractFactory: EaseContractFactory,
  ) { }

  async getPositions() {
    const endpoint = 'https://app.ease.org/api/v1/vaults';
    const ethData = await Axios.get<EaseRcaVaultDetails[]>(endpoint).then(v => v.data);
    const rcaAddressToDetails = _.keyBy(ethData, v => v.address.toLowerCase());

    //TODO: Is there the need to implement TokenPositionFetcher for all Shields? (RCAShieldNormalized / RcaShield / RcaShieldBase)
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<EaseRcaShield>({
      appId: EASE_DEFINITION.id,
      groupId: EASE_DEFINITION.groups.rca.id,
      network: Network.ETHEREUM_MAINNET,
      dependencies: [
        { appId: YEARN_DEFINITION.id, groupIds: [YEARN_DEFINITION.groups.vault.id], network },
        //TODO: migrate
        { appId: 'sushiswap', groupIds: ['pool'], network },
        { appId: 'convex', groupIds: ['deposit'], network },
        { appId: 'aave-v2', groupIds: ['supply'], network },
        { appId: 'compound', groupIds: ['supply'], network },
      ],
      //TODO: maybe easeRcaShieldNormalized? Or for every token own contract?
      resolveContract: ({ address, network }) => this.easeContractFactory.easeRcaShield({ address, network }),
      resolveVaultAddresses: async () => ethData.map(({ address }) => address.toLowerCase()),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).uToken().catch(() => ''),
      resolveReserve: async ({ underlyingToken, multicall, address }) => multicall
        .wrap(this.appToolkit.globalContracts.erc20(underlyingToken))
        .balanceOf(address)
        .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: () => 1,
      resolveApy: async ({ vaultAddress }) => await (rcaAddressToDetails[vaultAddress]?.token['apy'] ?? 0) / 100,
      // resolvePrimaryLabel
    });
  }
}
