import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetchAll } from '~app-toolkit/helpers/the-graph.helper';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { UnderlyingTokenDefinition, GetPricePerShareParams } from '~position/template/app-token.template.types';

import { ReserveProtocolViemContractFactory } from '../contracts';
import { StakedRsr } from '../contracts/viem/StakedRsr';

import { getRTokens, RTokens } from './reserve-protocol.staked-rsr.queries';

@PositionTemplate()
export class EthereumReserveProtocolStakedRsrTokenFetcher extends AppTokenTemplatePositionFetcher<StakedRsr> {
  groupLabel = 'Staked RSR';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ReserveProtocolViemContractFactory)
    protected readonly contractFactory: ReserveProtocolViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.stakedRsr({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    // Get RTokens data
    const rTokensData = await gqlFetchAll<RTokens>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/lcamargof/reserve-test?source=zapper',
      query: getRTokens,
      variables: {},
      dataToSearch: 'tokens',
    });

    // Get stRSR token addresses
    const tokenAddrs = rTokensData.tokens.map(token => token.rToken.rewardToken.token.id);
    return tokenAddrs;
  }

  async getUnderlyingTokenDefinitions(): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: '0x320623b8e4ff03373931769a31fc52a4e78b5d70', network: this.network }]; // RSR
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<StakedRsr>) {
    const exchangeRate = await contract.read.exchangeRate();
    return [Number(exchangeRate) / 10 ** 18];
  }
}
