import { Inject } from '@nestjs/common';
import axios from 'axios';
import { ethers, BigNumberish } from 'ethers';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { Cache } from '~cache/cache.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';

import { PoolTogetherMerkleDistributor, PoolTogetherV3ContractFactory } from '../contracts';

export abstract class PoolTogetherV3AirdropContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PoolTogetherMerkleDistributor> {
  abstract merkleAddress: string;
  abstract airdropDataUrl: string;
  abstract airdropTokenAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV3ContractFactory) private readonly contractFactory: PoolTogetherV3ContractFactory,
  ) {
    super(appToolkit);
  }

  @Cache({
    key: (network: Network, address: string) => `pool-together-v3:aidrop-data:${network}:${address}:`,
    ttl: moment.duration(30, 'minutes').asSeconds(),
  })
  private async getAirdropData(_network: Network, address: string) {
    const checksumAddress = ethers.utils.getAddress(address);
    return axios
      .get<{ index: number; amount: string; proof: string[] }>(`${this.airdropDataUrl}?address=${checksumAddress}`)
      .then(({ data }) => data)
      .catch(() => null);
  }

  getContract(address: string): PoolTogetherMerkleDistributor {
    return this.contractFactory.poolTogetherMerkleDistributor({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: this.merkleAddress }];
  }

  async getTokenDefinitions(
    _opts: GetTokenDefinitionsParams<PoolTogetherMerkleDistributor, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: this.airdropTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PoolTogetherMerkleDistributor>) {
    const rewardToken = contractPosition.tokens[0];
    return `Claimable ${getLabelFromToken(rewardToken)}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<PoolTogetherMerkleDistributor>): Promise<BigNumberish[]> {
    const airdropData = await this.getAirdropData(this.network, address);
    if (!airdropData) return [0];

    const isClaimed = await contract.isClaimed(airdropData.index);
    if (isClaimed) return [0];

    const claimableBalanceRaw = String(parseInt(airdropData.amount, 16));
    return [claimableBalanceRaw];
  }
}
