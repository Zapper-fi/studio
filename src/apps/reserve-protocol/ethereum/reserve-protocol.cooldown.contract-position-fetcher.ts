import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetchAll } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { ReserveProtocolViemContractFactory } from '../contracts';
import { StakedRsr } from '../contracts/viem/StakedRsr';

import { getRTokens, RTokens } from './reserve-protocol.staked-rsr.queries';

export type StakedRsrDataProps = DefaultDataProps & {
  inCoolDownTotalBalance: number;
};

enum CollateralStatus {
  SOUND,
  IFFY,
  DISABLED,
}

@PositionTemplate()
export class EthereumReserveProtocolCooldownContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StakedRsr> {
  groupLabel = 'Unstaked RSR in Cooldown';

  // Filtering out until main is fully supported in pro
  blockedTokenAddress = ['0x1c77ebbab708153f5f899c29b155a6cc92a2ac40'];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ReserveProtocolViemContractFactory)
    protected readonly contractFactory: ReserveProtocolViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.stakedRsr({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    // Get RTokens data
    const rTokensData = await gqlFetchAll<RTokens>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/lcamargof/reserve-test?source=zapper',
      query: getRTokens,
      variables: {},
      dataToSearch: 'tokens',
    });

    // Get stRSR token definitions
    return rTokensData.tokens
      .filter(x => !this.blockedTokenAddress.includes(x.rToken.rewardToken.token.id.toLowerCase()))
      .map(token => ({
        address: token.rToken.rewardToken.token.id.toLowerCase(),
      }));
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<StakedRsr>) {
    return [
      {
        metaType: MetaType.LOCKED,
        address: definition.address,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: definition.address,
        network: this.network,
      },
    ];
  }

  /*TODO: Uncomment once `getTotalDrafts()` is available for the deployed eusdRSR token
   async getDataProps(params: GetDataPropsParams<StakedRsr>) {
     const defaultDataProps = await super.getDataProps(params);
     const { contract } = params;
     const inCoolDownTotalBalance = await contract.read.getTotalDrafts();
     return { ...defaultDataProps, inCoolDownTotalBalance };
   }

   async getStatsItems({ contractPosition: { dataProps } }: GetDisplayPropsParams<StakedRsr, StakedRsrDataProps>) {
    return [{ label: 'In Cooldown Total Balance', value: buildNumberDisplayItem(dataProps.inCoolDownTotalBalance) }];
  }*/

  async getLabel({ contractPosition }: GetDisplayPropsParams<StakedRsr>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<StakedRsr>): Promise<BigNumberish[]> {
    // Get FacadeRead
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const facadeRead = multicall.wrap(
      this.contractFactory.facadeRead({
        network: this.network,
        address: '0x15f06b2907594905d820a4ab3631f4b097a0be07',
      }),
    );

    // Get Main
    const main = multicall.wrap(
      this.contractFactory.main({
        network: this.network,
        address: await contract.read.main(),
      }),
    );

    // Get Basket Handler
    const bh = multicall.wrap(
      this.contractFactory.basketHandler({
        network: this.network,
        address: await main.read.basketHandler(),
      }),
    );

    // Get RToken
    const rToken = multicall.wrap(
      this.contractFactory.rtoken({
        network: this.network,
        address: await main.read.rToken(),
      }),
    );

    // Get block timestamp
    const provider = this.appToolkit.getNetworkProvider(this.network);
    const blockNumber = await provider.getBlockNumber();
    const timestamp = (await provider.getBlock(blockNumber)).timestamp;

    // Check if claiming is disabled
    const fullyCollateralized = await bh.read.fullyCollateralized();
    const basketSound = (await bh.read.status()) == CollateralStatus.SOUND;
    const mainPausedOrFrozen = await main.read.pausedOrFrozen();
    const claimingDisabled = !fullyCollateralized || !basketSound || mainPausedOrFrozen;

    // Process pending unstakings
    const pendingUnstakings = await facadeRead.read.pendingUnstakings([rToken.address, address]);

    let lockedBalance = BigNumber.from(0);
    let claimableBalance = BigNumber.from(0);

    pendingUnstakings.forEach(unstake => {
      if (claimingDisabled || Number(unstake.availableAt) > timestamp) {
        lockedBalance = lockedBalance.add(unstake.amount);
      } else {
        claimableBalance = claimableBalance.add(unstake.amount);
      }
    });

    return [lockedBalance, claimableBalance];
  }
}
