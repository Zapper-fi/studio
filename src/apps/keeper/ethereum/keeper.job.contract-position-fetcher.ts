import 'moment-duration-format';

import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { BigNumberish } from 'ethers';
import moment from 'moment';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetDefinitionsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';
import { NETWORK_IDS } from '~types';

import { KeeperViemContractFactory } from '../contracts';
import { KeeperJobManager } from '../contracts/viem';

const KEEP3R_JOB_NAME_API = 'https://keep3r.vercel.app/api/registry';

type KeeperJobRegistryApiResponse = {
  chainID: number;
  address: string;
  name: string;
}[];

export type KeeperJobDefinition = {
  address: string;
  jobAddress: string;
};

type KeeperJobDataProps = {
  jobAddress: string;
};

@PositionTemplate()
export class EthereumKeeperJobContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  KeeperJobManager,
  KeeperJobDataProps,
  KeeperJobDefinition
> {
  groupLabel = 'Keep3r Jobs';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KeeperViemContractFactory) protected readonly contractFactory: KeeperViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.keeperJobManager({ address, network: this.network });
  }
  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<KeeperJobDefinition[]> {
    const managerJobContract = this.contractFactory.keeperJobManager({
      address: '0xeb02addcfd8b773a5ffa6b9d1fe99c566f8c44cc',
      network: this.network,
    });
    const jobAddresses = await multicall.wrap(managerJobContract).read.jobs();

    return jobAddresses.map(jobAddress => {
      return {
        address: managerJobContract.address,
        jobAddress: jobAddress.toLowerCase(),
      };
    });
  }

  async getTokenDefinitions({
    contract,
    definition,
  }: GetTokenDefinitionsParams<KeeperJobManager, KeeperJobDefinition>) {
    const approvedTokenAddresses = await contract.read.approvedLiquidities();
    const keeperLpAddress = approvedTokenAddresses[0];
    const [pendingBonds, canWithdrawAfter] = await Promise.all([
      await contract.read.pendingBonds([definition.jobAddress, keeperLpAddress]),
      await contract.read.canWithdrawAfter([definition.jobAddress, keeperLpAddress]),
    ]);

    return pendingBonds > 0 && moment().unix() > Number(canWithdrawAfter)
      ? [{ metaType: MetaType.CLAIMABLE, address: keeperLpAddress, network: this.network }]
      : [{ metaType: MetaType.LOCKED, address: keeperLpAddress, network: this.network }];
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<KeeperJobManager, KeeperJobDataProps, KeeperJobDefinition>): Promise<string> {
    const data = await Axios.get<KeeperJobRegistryApiResponse>(KEEP3R_JOB_NAME_API).then(v =>
      Object.values(v.data).map(job => ({ ...job, address: job.address.toLowerCase() })),
    );
    const filteredData = data.filter(job => job.chainID === NETWORK_IDS[this.network]);
    const foundJob = filteredData.find(x => x.address === definition.jobAddress);

    return (foundJob && `${foundJob.name} Keep3r Job`) || 'Keep3r Job';
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<KeeperJobManager, KeeperJobDataProps, KeeperJobDefinition>): Promise<KeeperJobDataProps> {
    return {
      jobAddress: definition.jobAddress,
    };
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<KeeperJobManager, KeeperJobDataProps>): Promise<BigNumberish[]> {
    const { jobAddress } = contractPosition.dataProps;
    const jobOwner = await contract.read.jobOwner([jobAddress]);
    if (jobOwner.toLowerCase() !== address) return [0];

    const balance = await contract.read.liquidityAmount([jobAddress, contractPosition.tokens[0].address]);

    return [balance];
  }
}
