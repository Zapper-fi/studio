import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { BigNumberish } from 'ethers';
import { compact, find, merge, sumBy } from 'lodash';
import moment from 'moment';
import 'moment-duration-format';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { gqlFetchAll } from '~app-toolkit/helpers/the-graph.helper';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import {
  GetTokenDefinitionsParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';
import { NETWORK_IDS } from '~types';

import { KeeperContractFactory, KeeperJobManager } from '../contracts';

import { KeeperJob, SUBGRAPH_URL, GET_JOBS, GET_USER_JOBS } from './keeper.job.queries';

const KEEP3R_JOB_NAME_API = 'https://keep3r.vercel.app/api/registry';

type KeeperJobRegistryApiResponse = {
  chainID: number;
  address: string;
  name: string;
}[];

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
    };
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
    const jobData = await gqlFetchAll<KeeperJob>({
      endpoint: SUBGRAPH_URL,
      query: GET_JOBS,
      variables: {},
      dataToSearch: 'jobs',
    });

    const jobs = jobData.jobs.map(v => ({
      address: v.id.toLowerCase(),
      credits: v.credits,
      liquidities: v.liquidities,
      owner: v.owner,
    }));

    return jobs.flat();
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<KeeperJobManager, KeeperJobDefinition>) {
    return [
      ...definition.liquidities.map(v => {
        if (v.pendingUnbonds !== '0' && moment().unix() > Number(v.withdrawableAfter)) {
          return { metaType: MetaType.CLAIMABLE, address: v.klp.id, network: this.network };
        }
        return { metaType: MetaType.LOCKED, address: v.klp.id, network: this.network };
      }),
      ...definition.credits.map(v => ({ metaType: MetaType.SUPPLIED, address: v.token.id, network: this.network })),
    ];
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<KeeperJobManager, KeeperJobDataProps, KeeperJobDefinition>): Promise<string> {
    const data = await Axios.get<KeeperJobRegistryApiResponse>(KEEP3R_JOB_NAME_API).then(v =>
      Object.values(v.data).map(job => ({ ...job, address: job.address.toLowerCase() })),
    );
    const filteredData = data.filter(job => job.chainID === NETWORK_IDS[this.network]);

    const foundJob = find(filteredData, { address: definition.address.toLowerCase() });

    return (foundJob && `${foundJob.name} Keep3r Job`) || 'Keep3r Job';
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<KeeperJobManager, KeeperJobDataProps, KeeperJobDefinition>): Promise<KeeperJobDataProps> {
    return {
      credits: definition.credits.map(({ id, amount, token }) => ({ id, amount, token: token.id })),
      liquidities: definition.liquidities.map(({ id, amount, pendingUnbonds, withdrawableAfter, klp }) => ({
        id,
        amount,
        pendingUnbonds,
        withdrawableAfter,
        token: klp.id,
      })),
    };
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<KeeperJobDataProps>[]> {
    const positions = await this.appToolkit.getAppContractPositions<KeeperJobDataProps>({
      network: this.network,
      appId: this.appId,
      groupIds: [this.groupId],
    });

    const data = await Axios.get<KeeperJobRegistryApiResponse>(KEEP3R_JOB_NAME_API).then(v =>
      Object.values(v.data).map(job => ({ ...job, address: job.address.toLowerCase() })),
    );

    const filteredData = data.filter(job => job.chainID === NETWORK_IDS[this.network]);

    const userJobsData = await gqlFetchAll<KeeperJob>({
      endpoint: SUBGRAPH_URL,
      query: GET_USER_JOBS,
      variables: { address },
      dataToSearch: 'jobs',
    });

    const userJobs = userJobsData.jobs.map(userJob => {
      const position = positions.find(v => v.address === userJob.id);
      if (!position) return null;

      const rawTokens = [...position.dataProps.liquidities, ...position.dataProps.credits];

      const maybeTokens = rawTokens.map(rawToken => {
        const token = find(position.tokens, { address: rawToken.token });
        if (!token) return null;
        return drillBalance(token, rawToken.amount);
      });

      const tokens = compact(maybeTokens);
      const balanceUSD = sumBy(tokens, v => v.balanceUSD);

      // Display Properties
      const foundJob = find(filteredData, { address: userJob.id.toLowerCase() });
      const label = (foundJob && `${foundJob.name} Keep3r Job`) || 'Keep3r Job';
      const displayProps = { label };

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
