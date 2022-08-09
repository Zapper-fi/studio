import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { UNISWAP_V2_DEFINITION } from '~apps/uniswap-v2/uniswap-v2.definition';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { SablierStreamApiClient } from '../common/sablier.stream.api-client';
import { SablierContractFactory } from '../contracts';
import { SABLIER_DEFINITION } from '../sablier.definition';

import { SablierStreamContractPositionDataProps } from './sablier.stream.contract-position-fetcher';

const appId = SABLIER_DEFINITION.id;
const groupId = SABLIER_DEFINITION.groups.stream.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionBalanceFetcher({ appId, groupId, network })
export class EthereumSablierStreamContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SablierContractFactory) private readonly sablierContractFactory: SablierContractFactory,
    @Inject(SablierStreamApiClient) private readonly apiClient: SablierStreamApiClient,
  ) {}

  async getBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const streams = await this.apiClient.getStreams(address, network);
    if (streams.length === 0) return [];

    const sablierAddress = '0xcd18eaa163733da39c232722cbc4e8940b1d8888';
    const sablierStreamContract = this.sablierContractFactory.sablierStream({ address: sablierAddress, network });
    const sablierStream = multicall.wrap(sablierStreamContract);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(
      { appId: 'sushiswap', groupIds: ['pool'], network },
      { appId: UNISWAP_V2_DEFINITION.id, groupIds: [UNISWAP_V2_DEFINITION.groups.pool.id], network },
    );
    const allTokens = [...appTokens, ...baseTokens];

    const positions = await Promise.all(
      streams.map(async stream => {
        const streamBalanceRaw = await sablierStream.balanceOf(stream.streamId, address).catch(err => {
          if (isMulticallUnderlyingError(err)) return null;
          throw err;
        });
        if (!streamBalanceRaw) return null;

        const streamRaw = await sablierStream.getStream(stream.streamId);
        const tokenAddress = streamRaw.tokenAddress.toLowerCase();
        const token = allTokens.find(t => t.address === tokenAddress);
        if (!token) return null;

        const remainingRaw = streamRaw.remainingBalance.toString();
        const depositRaw = streamRaw.deposit.toString();
        const balanceRaw = streamBalanceRaw.toString();

        const deposited = Number(depositRaw) / 10 ** token.decimals;
        const remaining = Number(remainingRaw) / 10 ** token.decimals;
        const tokenBalance = drillBalance(token, balanceRaw);
        const isRecipient = streamRaw.recipient.toLowerCase() === address;

        const position: ContractPositionBalance<SablierStreamContractPositionDataProps> = {
          type: ContractType.POSITION,
          address: sablierAddress,
          network,
          appId,
          groupId,
          tokens: [tokenBalance],
          balanceUSD: tokenBalance.balanceUSD,

          dataProps: {
            deposited,
            remaining,
          },

          displayProps: {
            label: `${isRecipient ? 'Available' : 'Deposited'} ${token.symbol} on Sablier`,
            secondaryLabel: buildDollarDisplayItem(token.price),
            images: getImagesFromToken(token),
          },
        };

        return position;
      }),
    );

    return compact(positions);
  }
}
