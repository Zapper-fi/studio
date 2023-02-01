import { Inject, NotImplementedException } from '@nestjs/common';
import axios from 'axios';
import _, { range, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { VelodromeContractFactory, VelodromeBribe } from '../contracts';

export type VelodromeBribeDefinition = {
  address: string;
  name: string;
};

interface VelodromeApiPairData {
  gauge: GaugeData;
  symbol: string;
  address: string;
}

interface GaugeData {
  wrapped_bribe_address: string;
}

// Pools which contains optiDoge
const notSupportedPoolTokenAddresses = [
  '0xce9accfbb25eddce91845c3a7c3d1613d1d7081f',
  '0x22bc9c46b72b2e92f0539d18d1f2273ee0e7f3fc',
  '0x763cbb83cb837114fded11d562bcbf3d58a682ac',
  '0x4ecafe1a9798e4e874f5df212377615ae357b566',
  '0x415c6f07757ab86d902eeca5055fcb3ca974b880',
  '0xb22cd502a49e90e4e6200921a41a7f065e9a1b9e',
  '0x6a938eddf290ca29a0865ae613d52c160ce4554b',
  '0xc23ab0245e23c22bf306a62dc9fe2958cdcf37b0',
  '0x103f2556cb47eaf2161e700f15716f65711ed983',
  '0xce57d093bf2ce0bd02e83c364c9bd766be2212b2',
];

@PositionTemplate()
export class OptimismVelodromeBribeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<VelodromeBribe> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeContractFactory) protected readonly contractFactory: VelodromeContractFactory,
  ) {
    super(appToolkit);
  }
  veTokenAddress = '0x9c7305eb78a432ced5c4d14cac27e8ed569a2e26';
  veVoteAddress = '0x09236cff45047dbee6b921e00704bed6d6b8cf7e';
  groupLabel = 'Bribe';

  getContract(address: string): VelodromeBribe {
    return this.contractFactory.velodromeBribe({ address, network: this.network });
  }

  async getDefinitions(): Promise<VelodromeBribeDefinition[]> {
    const { data } = await axios.get<{ data: VelodromeApiPairData[] }>('https://api.velodrome.finance/api/v1/pairs');
    const definitions = data.data
      .filter(v => !!v)
      .filter(v => !!v.gauge)
      .map(pool => {
        const wBribeAddress = pool.gauge.wrapped_bribe_address;
        return wBribeAddress != null ? { address: wBribeAddress, name: pool.symbol } : null;
      });

    return _.compact(definitions);
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<VelodromeBribe>) {
    const numRewards = Number(await contract.rewardsListLength());
    const bribeTokens = await Promise.all(range(numRewards).map(async n => await contract.rewards(n)));
    const tokenDefinitions = bribeTokens.map(address => {
      if (notSupportedPoolTokenAddresses.includes(address)) return null;

      return {
        metaType: MetaType.CLAIMABLE,
        address,
        network: this.network,
      };
    });

    return _.compact(tokenDefinitions);
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<VelodromeBribe, DefaultDataProps, VelodromeBribeDefinition>): Promise<string> {
    return `${definition.name} Bribe`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const escrow = multicall.wrap(
      this.contractFactory.velodromeVe({ address: this.veTokenAddress, network: this.network }),
    );
    const veCount = Number(await escrow.balanceOf(address));
    if (veCount === 0) return [];

    const veTokenIds = await Promise.all(
      range(veCount).map(async i => {
        const tokenId = await escrow.tokenOfOwnerByIndex(address, i);
        return tokenId;
      }),
    );

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const bribeTokens = contractPosition.tokens;
        const bribeContract = multicall.wrap(this.getContract(contractPosition.address));

        const tokenBalancesRaw = await Promise.all(
          bribeTokens.map(async bribeToken => {
            return Promise.all(
              veTokenIds.map(async veTokenId => {
                return await multicall.wrap(bribeContract).earned(bribeToken.address, veTokenId);
              }),
            );
          }),
        );

        const tokenBalances = tokenBalancesRaw.map(x => Number(x)).flat();

        const nonZeroBalancesRaw = tokenBalances.filter(balance => balance > 0);
        const allTokens = contractPosition.tokens.map((cp, idx) =>
          drillBalance(cp, nonZeroBalancesRaw[idx]?.toString() ?? '0'),
        );

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        const balance: ContractPositionBalance = { ...contractPosition, tokens, balanceUSD };

        return balance;
      }),
    );
    return _.compact(balances);
  }
}
