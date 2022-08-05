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

import { SablierStreamLegacyApiClient } from '../common/sablier.stream-legacy.api-client';
import { SablierContractFactory } from '../contracts';
import { SABLIER_DEFINITION } from '../sablier.definition';

import { SablierContractPositionDataProps } from './sablier.stream.contract-position-fetcher';

const appId = SABLIER_DEFINITION.id;
const groupId = SABLIER_DEFINITION.groups.streamLegacy.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionBalanceFetcher({ appId, groupId, network })
export class EthereumSablierStreamLegacyContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SablierContractFactory) private readonly sablierContractFactory: SablierContractFactory,
    @Inject(SablierStreamLegacyApiClient) private readonly apiClient: SablierStreamLegacyApiClient,
  ) {}

  async getBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const streams = await this.apiClient.getLegacyStreams(address, network);
    if (streams.length === 0) return [];

    const sablierAddress = '0xa4fc358455febe425536fd1878be67ffdbdec59a';
    const sablierStream = this.sablierContractFactory.sablierStreamLegacy({ address: sablierAddress, network });

    const sablierSalaryAddress = '0xbd6a40bb904aea5a49c59050b5395f7484a4203d';
    const sablierSalary = this.sablierContractFactory.sablierSalary({ address: sablierSalaryAddress, network });

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(
      { appId: 'sushiswap', groupIds: ['pool'], network },
      { appId: UNISWAP_V2_DEFINITION.id, groupIds: [UNISWAP_V2_DEFINITION.groups.pool.id], network },
    );
    const allTokens = [...appTokens, ...baseTokens];

    const positions = await Promise.all(
      streams.map(async stream => {
        const salaryRaw = await multicall
          .wrap(sablierSalary)
          .getSalary(stream.salaryId)
          .catch(err => {
            if (isMulticallUnderlyingError(err)) return null;
            throw err;
          });
        if (!salaryRaw) return null;

        const isRecipient = salaryRaw.employee.toLowerCase() === address;
        const who = isRecipient ? address : sablierSalaryAddress;
        const salaryBalanceRaw = await multicall.wrap(sablierStream).balanceOf(stream.streamId, who);

        const tokenAddress = salaryRaw.tokenAddress.toLowerCase();
        const token = allTokens.find(t => t.address === tokenAddress);
        if (!token) return null;

        const remainingRaw = salaryRaw.remainingBalance.toString();
        const depositRaw = salaryRaw.salary.toString();
        const balanceRaw = salaryBalanceRaw.toString();

        const deposited = Number(depositRaw) / 10 ** token.decimals;
        const remaining = Number(remainingRaw) / 10 ** token.decimals;
        const tokenBalance = drillBalance(token, balanceRaw);

        const position: ContractPositionBalance<SablierContractPositionDataProps> = {
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
