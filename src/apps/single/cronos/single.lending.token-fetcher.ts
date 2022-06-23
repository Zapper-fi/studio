import { Inject } from '@nestjs/common';
import axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SingleContractFactory, SingleVault } from '../contracts';
import { SINGLE_DEFINITION } from '../single.definition';
import { SingleProtocol } from '../types';

const appId = SINGLE_DEFINITION.id;
const groupId = SINGLE_DEFINITION.groups.lending.id;
const network = Network.CRONOS_MAINNET;

const BASE_API_URL = 'https://api.singlefinance.io/api/protocol/contracts';

const resolveVaultAddresses = async () => {
  const { vaults } = await axios.get<SingleProtocol>(BASE_API_URL).then(v => v.data);
  return vaults.map(({ address }) => address.toLowerCase());
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class CronosSingleLendingTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SingleContractFactory) private readonly singleContractFactory: SingleContractFactory,
  ) { }

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<SingleVault>({
      appId,
      groupId,
      network,
      resolveContract: ({ address, network }) => this.singleContractFactory.singleVault({ address, network }),
      resolveVaultAddresses,
      resolveUnderlyingTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
      resolveReserve: async ({ underlyingToken, multicall, address }) => {
        const contract = this.singleContractFactory.singleVault({ address, network });
        return multicall
          .wrap(contract)
          .totalToken()
          .then(v => Number(v) / 10 ** underlyingToken.decimals);
      },
      resolvePricePerShare: ({ reserve, supply }) => reserve / supply,
    });
  }
}
