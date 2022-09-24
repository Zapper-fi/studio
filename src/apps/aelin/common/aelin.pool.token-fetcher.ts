import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';

import { AelinContractFactory, AelinPool } from '../contracts';

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
    @Inject(AelinContractFactory) protected readonly contractFactory: AelinContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AelinPool {
    return this.contractFactory.aelinPool({ address, network: this.network });
  }

  async getAddresses() {
    const data = await this.appToolkit.helpers.theGraphHelper.request<AelinPoolsResponse>({
      endpoint: this.subgraphUrl,
      query,
    });
    return data.poolCreateds.map(v => v.id);
  }

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<AelinPool>) {
    return contract.purchaseToken();
  }

  async getLiquidity({ appToken }: GetDataPropsParams<AelinPool>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<AelinPool>) {
    return [appToken.supply]; // 1:1
  }

  async getApy() {
    return 0;
  }

  async getLabel({ contract }: GetDisplayPropsParams<AelinPool>) {
    const name = await contract.name();
    const maybeName = name.replace(/^(aePool-|aeP-)/, '');
    const labelPrefix = ethers.utils.isHexString(maybeName) ? ethers.utils.parseBytes32String(maybeName) : maybeName;
    return `${labelPrefix} Aelin Pool`;
  }
}
