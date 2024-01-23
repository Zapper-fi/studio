import { Inject } from '@nestjs/common';
import axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';

import { PolygonStakingViemContractFactory } from '../contracts';
import { PolygonValidatorShare } from '../contracts/viem';

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

type PolygonStakingDepositDefinition = {
  address: string; // share address
  validatorId: number;
  validatorName: string;
};

type PolygonStakingDepositDataProps = {
  validatorId: number;
  validatorName: string;
};

@PositionTemplate()
export class EthereumPolygonStakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  PolygonValidatorShare,
  PolygonStakingDepositDataProps,
  PolygonStakingDepositDefinition
> {
  groupLabel = 'Deposits';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolygonStakingViemContractFactory) protected readonly contractFactory: PolygonStakingViemContractFactory,
  ) {
    super(appToolkit);
  }

  @CacheOnInterval({
    key: `studio:polygon-staking:deposit:ethereum:validators`,
    timeout: 15 * 60 * 1000,
    failOnMissingData: false,
  })
  async getValidators() {
    const url = `https://staking-api.polygon.technology/api/v2/validators?limit=1000`;
    const { data } = await axios.get<ValidatorsResponse>(url);
    return data;
  }

  getContract(address: string) {
    return this.contractFactory.polygonValidatorShare({ address, network: this.network });
  }

  async getDefinitions() {
    const validators = await this.getValidators();

    return validators.result.map(validator => ({
      address: validator.contractAddress,
      validatorId: validator.id,
      validatorName: validator.name,
    }));
  }

  async getTokenDefinitions(_params: GetTokenDefinitionsParams<PolygonValidatorShare>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
        network: this.network,
      },

      {
        metaType: MetaType.CLAIMABLE,
        address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
        network: this.network,
      },
    ];
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<PolygonValidatorShare, PolygonStakingDepositDataProps, PolygonStakingDepositDefinition>) {
    return {
      validatorId: definition.validatorId,
      validatorName: definition.validatorName,
    };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PolygonValidatorShare, PolygonStakingDepositDataProps>) {
    const validatorLabel = `${contractPosition.dataProps.validatorName} (ID: ${contractPosition.dataProps.validatorId})`;
    return `Delegated ${getLabelFromToken(contractPosition.tokens[0])}: ${validatorLabel}`;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<PolygonValidatorShare>) {
    return getImagesFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<PolygonValidatorShare>) {
    return Promise.all([contract.read.balanceOf([address]), contract.read.getLiquidRewards([address])]);
  }
}
