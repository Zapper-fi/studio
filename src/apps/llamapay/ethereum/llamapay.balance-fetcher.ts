import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { LlamapayStreamApiClient } from '../common/llamapay.stream.api-client';
import { LlamapayContractFactory } from '../contracts';
import { LLAMAPAY_DEFINITION } from '../llamapay.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(LLAMAPAY_DEFINITION.id, network)
export class EthereumLlamapayBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LlamapayContractFactory) protected readonly contractFactory: LlamapayContractFactory,
    @Inject(LlamapayStreamApiClient) protected readonly apiClient: LlamapayStreamApiClient,
  ) {}

  async getBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const streams = await this.apiClient.getStreams(address, network);
    if (streams === null) return presentBalanceFetcherResponse([{ label: 'Streams', assets: [] }]);

    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network, context: LLAMAPAY_DEFINITION.id },
    });

    const llamapayAddress = '0xb70b0fee3c7752ec5ea6b2debc6bc1340d3e22dd';
    const llamapayContract = this.contractFactory.llamapay({
      address: llamapayAddress,
      network: network,
    });
    const llamapay = multicall.wrap(llamapayContract);

    const underlyingAddresses = streams.map(stream => ({
      network: network,
      address: stream.token.address,
    }));

    const tokenDependencies = await tokenLoader.getMany(underlyingAddresses).then(deps => compact(deps));

    const positions = await Promise.all(
      streams.map(async stream => {
        const streamBalanceRaw = await llamapay
          .withdrawable(stream.payer.id, stream.payee.id, stream.amountPerSec)
          .catch(err => {
            if (isMulticallUnderlyingError(err)) return null;
            throw err;
          });

        if (!streamBalanceRaw) return null;

        const token = tokenDependencies.find(t => t.address === stream.token.address);
        if (!token) return null;

        const balanceRaw = streamBalanceRaw[0].toString();
        const tokenBalance = drillBalance(token, balanceRaw);
        const balance = Number(balanceRaw) / 10 ** token.decimals;

        const position: ContractPositionBalance = {
          type: ContractType.POSITION,
          address: stream.contract.address,
          network: network,
          appId: LLAMAPAY_DEFINITION.id,
          groupId: LLAMAPAY_DEFINITION.groups.stream.id,
          tokens: [tokenBalance],
          balanceUSD: tokenBalance.balanceUSD,

          dataProps: {
            balance,
          },

          displayProps: {
            label: `Available ${token.symbol} on LlamaPay`,
            secondaryLabel: buildDollarDisplayItem(token.price),
            images: getImagesFromToken(token),
          },
        };

        return position;
      }),
    );

    return presentBalanceFetcherResponse([{ label: 'Streams', assets: compact(positions) }]);
  }
}
