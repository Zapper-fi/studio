import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { UnderlyingTokenDefinition, GetPricePerShareParams } from '~position/template/app-token.template.types';

import { gqlFetchAll } from '~app-toolkit/helpers/the-graph.helper';

import { ReserveProtocolContractFactory } from '../contracts';
import { StakedRsr } from '../contracts/ethers/StakedRsr';

import { getRTokens, RTokens } from './reserve-protocol.staked-rsr.queries';

@PositionTemplate()
export class EthereumReserveProtocolStakedRsrTokenFetcher extends AppTokenTemplatePositionFetcher<StakedRsr> {
  groupLabel = 'Staked RSR';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ReserveProtocolContractFactory)
    protected readonly contractFactory: ReserveProtocolContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StakedRsr {
    return this.contractFactory.stakedRsr({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    // Get RTokens data
    const rTokensData = await gqlFetchAll<RTokens>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/lcamargof/reserve-test',
      query: getRTokens,
      variables: {},
      dataToSearch: 'tokens',
    });

    // Get stRSR token addresses
    const tokenAddrs = rTokensData.tokens.map(token => token.rToken.rewardToken.token.id);
    return tokenAddrs;
  }

  async getUnderlyingTokenDefinitions(): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: '0x320623b8E4fF03373931769A31Fc52A4E78B5d70', network: this.network }]; // RSR
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<StakedRsr>) {
    const exchangeRate = await contract.exchangeRate();
    return [Number(exchangeRate) / 10 ** 18];
  }
}
