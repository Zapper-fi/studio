import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams, GetDisplayPropsParams } from '~position/template/app-token.template.types';

import { AelinViemContractFactory } from '../contracts';
import { AelinPool } from '../contracts/viem';

type AelinPoolsResponse = {
  poolCreateds: {
    id: string;
  }[];
};

const query = gql`
  query fetchAelinPools {
    poolCreateds(first: 1000) {
      id
    }
  }
`;

export abstract class AelinPoolTokenFetcher extends AppTokenTemplatePositionFetcher<AelinPool> {
  abstract subgraphUrl: string;
  minLiquidity = 0;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AelinViemContractFactory) protected readonly contractFactory: AelinViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.aelinPool({ address, network: this.network });
  }

  async getAddresses() {
    const data = await gqlFetch<AelinPoolsResponse>({ endpoint: this.subgraphUrl, query });
    return data.poolCreateds.map(v => v.id);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<AelinPool>) {
    return [{ address: await contract.read.purchaseToken(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getLabel({ contract }: GetDisplayPropsParams<AelinPool>) {
    const name = await contract.read.name();
    const maybeName = name.replace(/^(aePool-|aeP-)/, '');
    const labelPrefix = ethers.utils.isHexString(maybeName) ? ethers.utils.parseBytes32String(maybeName) : maybeName;
    return `${labelPrefix} Aelin Pool`;
  }
}
