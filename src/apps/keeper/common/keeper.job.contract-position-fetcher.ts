import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { compact, find, merge, reduce, sumBy, uniqBy } from 'lodash';
import moment from 'moment';
import 'moment-duration-format';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps, WithMetaType } from '~position/display.interface';
import { AppTokenPositionBalance, BaseTokenBalance, ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType, Standard } from '~position/position.interface';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { KeeperContractFactory, KeeperJobManager } from '../contracts';

import { KeeperJob, SUBGRAPH_URL, GET_JOBS, GET_USER_JOBS } from './keeper.job.queries';

type KeeperJobDefinition = {
  address: string;
  liquidities: {
    id: string;
    amount: string;
    pendingUnbonds: string;
    withdrawableAfter: string;
    klp: {
      id: string;
    };
  }[];
  credits: {
    id: string;
    amount: string;
    token: {
      id: string;
      name: string;
      symbol: string;
      decimals: string;
    }
  }[];
  owner: string;
};

type KeeperJobDataProps = {
  credits: {
    id: string;
    amount: string;
    token: string;
  }[];
  liquidities: {
    id: string;
    amount: string;
    pendingUnbonds: string;
    withdrawableAfter: string;
    token: string;
  }[];
};

export abstract class KeeperJobContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  KeeperJobManager,
  KeeperJobDataProps,
  KeeperJobDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KeeperContractFactory) protected readonly contractFactory: KeeperContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): KeeperJobManager {
    return this.contractFactory.keeperJobManager({ address, network: this.network });
  }

  async getDefinitions() {
    const jobData = await this.appToolkit.helpers.theGraphHelper.gqlFetchAll<KeeperJob>({
      endpoint: SUBGRAPH_URL,
      query: GET_JOBS,
      variables: {},
      dataToSearch: 'jobs',
    });

    const jobs = jobData.jobs.map(v => ({
      address: v.id,
      credits: v.credits,
      liquidities: v.liquidities,
      owner: v.owner,
    }));

    return jobs.flat();
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<KeeperJobManager, KeeperJobDefinition>) {
    return [
      ...definition.liquidities.map(v => {
        if (v.pendingUnbonds !== '0' && moment().unix() > Number(v.withdrawableAfter)) {
          return ({ metaType: MetaType.CLAIMABLE, address: v.klp.id, network: this.network })
        }
        return ({ metaType: MetaType.LOCKED, address: v.klp.id, network: this.network })
      }),
      ...definition.credits.map(v => ({ metaType: MetaType.SUPPLIED, address: v.token.id, network: this.network })),
    ];
  }

  async getLabel() {
    return 'Keep3r job';
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<
    KeeperJobManager,
    KeeperJobDataProps,
    KeeperJobDefinition
  >): Promise<KeeperJobDataProps> {
    return {
      credits: definition.credits.map(({ id, amount, token }) => ({ id, amount, token: token.id })),
      liquidities: definition.liquidities.map(({
        id,
        amount,
        pendingUnbonds,
        withdrawableAfter,
        klp,
      }) => ({
        id,
        amount,
        pendingUnbonds,
        withdrawableAfter,
        token: klp.id,
      }))
    };
  }

  async getBalances(address: string): Promise<ContractPositionBalance<KeeperJobDataProps>[]> {
    const positions = await this.appToolkit.getAppContractPositions<KeeperJobDataProps>({
      network: this.network,
      appId: this.appId,
      groupIds: [this.groupId],
    });

    const userJobsData = await this.appToolkit.helpers.theGraphHelper.gqlFetchAll<KeeperJob>({
      endpoint: SUBGRAPH_URL,
      query: GET_USER_JOBS,
      variables: { address },
      dataToSearch: 'jobs',
    });

    const userJobs = userJobsData.jobs.map(userJob => {
      const position = positions
        .find(v => v.address === userJob.id);
      if (!position) return null;

      const rawTokens = [
        ...position.dataProps.liquidities,
        ...position.dataProps.credits,
      ]

      const tokens = rawTokens.map(rawToken => {
        const token = find(position.tokens, { address: rawToken.token });
        if (!token) {
          return null;
        }

        return drillBalance(token, rawToken.amount);
      }).filter(token => !!token) as (WithMetaType<BaseTokenBalance> | WithMetaType<AppTokenPositionBalance<DefaultDataProps>>)[];


      const balanceUSD = sumBy(tokens, v => v.balanceUSD);

      // Display Properties
      const label = 'Keep3r job';
      const secondaryLabel = '';
      const displayProps = { label, secondaryLabel };

      const positionBalance = merge({}, position, {
        tokens,
        balanceUSD,
        dataProps: {},
        displayProps,
      });

      return positionBalance;
    });
    return compact(userJobs.flat());
  }
}
