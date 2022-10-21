import { Inject } from '@nestjs/common';
import axios from 'axios';
import { gql } from 'graphql-request';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';

import { PolygonStakingContractFactory } from '../contracts';
import { PolygonStakeManager } from '../contracts/ethers/PolygonStakeManager';

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

type DelegatedMaticResponse = {
  delegators: {
    validatorId: string;
    delegatedAmount: string;
  }[];
};

const GQL_ENDPOINT = `https://api.thegraph.com/subgraphs/name/maticnetwork/mainnet-root-subgraphs`;

const DELEGATED_MATIC_QUERY = gql`
  query getDelegatedMatic($address: String!, $first: Int, $lastId: String) {
    delegators(where: { address: $address, id_gt: $lastId }, first: $first) {
      validatorId
      delegatedAmount
    }
  }
`;

type PolygonStakingDepositDefinition = {
  address: string;
  validatorId: number;
  validatorName: string;
  validatorShareAddress: string;
};

type PolygonStakingDepositDataProps = {
  validatorId: number;
  validatorName: string;
  validatorShareAddress: string;
};

@PositionTemplate()
export class EthereumPolygonStakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  PolygonStakeManager,
  PolygonStakingDepositDataProps,
  PolygonStakingDepositDefinition
> {
  groupLabel = 'Deposits';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolygonStakingContractFactory) protected readonly contractFactory: PolygonStakingContractFactory,
  ) {
    super(appToolkit);
  }

  @CacheOnInterval({
    key: `studio:polygon-staking:deposit:ethereum:validators`,
    timeout: 15 * 60 * 1000,
  })
  async getValidators() {
    const url = `https://sentinel.matic.network/api/v2/validators?limit=1000`;
    const { data } = await axios.get<ValidatorsResponse>(url);
    return data;
  }

  getContract(address: string): PolygonStakeManager {
    return this.contractFactory.polygonStakeManager({ address, network: this.network });
  }

  async getDefinitions() {
    const validators = await this.getValidators();

    return validators.result.map(validator => ({
      address: '0x5e3ef299fddf15eaa0432e6e66473ace8c13d908',
      validatorId: validator.id,
      validatorName: validator.name,
      validatorShareAddress: validator.contractAddress,
    }));
  }

  async getTokenDefinitions(_params: GetTokenDefinitionsParams<PolygonStakeManager>) {
    return [
      { metaType: MetaType.SUPPLIED, address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0' },
      { metaType: MetaType.CLAIMABLE, address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0' },
    ];
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<PolygonStakeManager, PolygonStakingDepositDataProps, PolygonStakingDepositDefinition>) {
    return {
      validatorId: definition.validatorId,
      validatorName: definition.validatorName,
      validatorShareAddress: definition.validatorShareAddress,
    };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PolygonStakeManager, PolygonStakingDepositDataProps>) {
    const validatorLabel = `${contractPosition.dataProps.validatorName} (ID: ${contractPosition.dataProps.validatorId})`;
    return `Delegated ${getLabelFromToken(contractPosition.tokens[0])}: ${validatorLabel}`;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<PolygonStakeManager>) {
    return getImagesFromToken(contractPosition.tokens[0]);
  }

  getKey({ contractPosition }: { contractPosition: ContractPosition<PolygonStakingDepositDataProps> }) {
    return this.appToolkit.getPositionKey(contractPosition, ['validatorId']);
  }

  // @ts-ignore
  async getTokenBalancesPerPosition(_params: GetTokenBalancesParams<PolygonStakeManager>) {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<PolygonStakingDepositDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const data = await this.appToolkit.helpers.theGraphHelper.gqlFetchAll<DelegatedMaticResponse>({
      endpoint: GQL_ENDPOINT,
      query: DELEGATED_MATIC_QUERY,
      dataToSearch: 'delegators',
      variables: {
        address: address.toLowerCase(),
      },
    });

    const positions = await this.appToolkit.getAppContractPositions<PolygonStakingDepositDataProps>({
      network: this.network,
      appId: this.appId,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      data.delegators.map(async delegator => {
        const position = positions.find(v => v.dataProps.validatorId === Number(delegator.validatorId));
        if (!position) return null;

        const contract = this.contractFactory.polygonValidatorShare({
          address: position.dataProps.validatorShareAddress,
          network: this.network,
        });

        const [balanceRaw, claimableBalanceRaw] = await Promise.all([
          multicall.wrap(contract).balanceOf(address),
          multicall.wrap(contract).getLiquidRewards(address),
        ]);

        const suppliedToken = position.tokens.find(isSupplied)!;
        const claimableToken = position.tokens.find(isClaimable)!;
        if (!suppliedToken || !claimableToken) return null;

        const tokens = [
          drillBalance(suppliedToken, balanceRaw.toString()),
          drillBalance(claimableToken, claimableBalanceRaw.toString()),
        ];

        const balanceUSD = sumBy(tokens, v => v.balanceUSD);
        const balance: ContractPositionBalance<PolygonStakingDepositDataProps> = {
          ...position,
          tokens,
          balanceUSD,
        };

        return balance;
      }),
    );

    return compact(balances);
  }
}
