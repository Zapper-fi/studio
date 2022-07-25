import { Inject } from '@nestjs/common';
import axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { POLYGON_DEFINITION } from '../polygon.definition';

const appId = POLYGON_DEFINITION.id;
const groupId = POLYGON_DEFINITION.groups.staking.id;
const network = Network.ETHEREUM_MAINNET;

type ValidatorsResponse = {
  result: {
    id: number;
    name: string;
    description: string;
    logoUrl: string | null;
    owner: string;
    signer: string;
    commissionPercent: number;
    signerPublicKey: string;
    selfStake: number;
    delegatedStake: number;
    isInAuction: boolean;
    auctionAmount: number;
    claimedReward: number;
    activationEpoch: 1;
    totalStaked: number;
    deactivationEpoch: number;
    jailEndEpoch: number;
    status: string;
    contractAddress: string;
    uptimePercent: number;
    delegationEnabled: boolean;
    missedLatestCheckpointcount: number;
  }[];
};

export type PolygonStakingContractPositionDataProps = {
  validatorId: number;
  validatorName: string;
  validatorShareAddress: string;
};

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumPolygonStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  @CacheOnInterval({
    key: `studio:${appId}:${groupId}:${network}:validators`,
    timeout: 15 * 60 * 1000,
  })
  async getValidators() {
    const url = `https://sentinel.matic.network/api/v2/validators?limit=1000`;
    const { data } = await axios.get<ValidatorsResponse>(url);
    return data;
  }

  async getPositions() {
    const validators = await this.getValidators();
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const positions = await Promise.all(
      validators.result.map(async validator => {
        const maticPosStakingAddress = '0x5e3ef299fddf15eaa0432e6e66473ace8c13d908';
        const maticAddress = '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0';
        const maticToken = baseTokens.find(v => v.address === maticAddress)!;
        const tokens = [supplied(maticToken), claimable(maticToken)];

        const label = `Delegated ${getLabelFromToken(maticToken)}: ${validator.name} (ID: ${validator.id})`;
        const images = getImagesFromToken(maticToken);

        const position: ContractPosition<PolygonStakingContractPositionDataProps> = {
          type: ContractType.POSITION,
          address: maticPosStakingAddress,
          appId,
          groupId,
          network,
          tokens,

          dataProps: {
            validatorId: validator.id,
            validatorName: validator.name,
            validatorShareAddress: validator.contractAddress,
          },

          displayProps: {
            label,
            images,
          },
        };

        position.key = this.appToolkit.getPositionKey(position, ['validatorId']);
        return position;
      }),
    );

    return positions;
  }
}
