import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { EaseContractFactory, EaseRcaShield } from '../contracts';
import { EASE_DEFINITION } from '../ease.definition';

//TODO: remove initialization?
const appId = EASE_DEFINITION.id;
const groupId = EASE_DEFINITION.groups.ez.id;
const network = Network.ETHEREUM_MAINNET;

export type EaseRcaVaultDetails = {
  symbol: string;
  name: string;
  address: string;
  apy: number;
  token: [];
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumEaseEzTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(EaseContractFactory) private readonly easeContractFactory: EaseContractFactory,
  ) { }

  async getPositions() {
    const endpoint = 'https://app.ease.org/api/v1/vaults';
    const ethData = await Axios.get<EaseRcaVaultDetails[]>(endpoint).then(v => v.data);
    // const ethData = data.filter(({ network }) => network === 'eth');
    // const addresses = ethData.map(({ address }) => address.toLowerCase());

    return this.appToolkit.helpers.vaultTokenHelper.getTokens<EaseRcaShield>({
      appId: EASE_DEFINITION.id,
      groupId: EASE_DEFINITION.groups.ez.id,
      network: Network.ETHEREUM_MAINNET,
      //TODO: maybe easeRcaShieldNormalized? Or for every token own contract?
      resolveContract: ({ address, network }) => this.easeContractFactory.easeRcaShield({ address, network }),
      resolveVaultAddresses: () => ethData.map(({ address }) => address.toLowerCase()),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).uToken().catch(() => ''),
      resolveReserve: async ({ underlyingToken, multicall, address }) =>
        multicall
          .wrap(this.appToolkit.globalContracts.erc20(underlyingToken))
          .balanceOf(address)
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: ({ reserve, supply }) => reserve / supply,
    })
  }
}
