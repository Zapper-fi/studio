import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish, Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { buildNumberDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { gqlFetchAll } from '~app-toolkit/helpers/the-graph.helper';

import { StakedRsr } from '../contracts/ethers/StakedRsr';

import { ReserveProtocolContractFactory } from '../contracts';

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
export class EthereumReserveProtocolCooldownContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Contract> {
  groupLabel = 'Unstaked RSR in Cooldown';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ReserveProtocolContractFactory)
    protected readonly contractFactory: ReserveProtocolContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StakedRsr {
    return this.contractFactory.stakedRsr({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    // Get RTokens data
    const rTokensData = await gqlFetchAll<RTokens>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/lcamargof/reserve-test',
      query: getRTokens,
      variables: {},
      dataToSearch: 'tokens',
    });

    // Get stRSR token definitions
    const defs = rTokensData.tokens.map(token => ({
      address: token.rToken.rewardToken.token.id,
    }));
    return defs;
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

  // TODO: Uncomment once `getTotalDrafts()` is available for the deployed eusdRSR token
  // async getDataProps(params: GetDataPropsParams<StakedRsr>) {
  //   const defaultDataProps = await super.getDataProps(params);
  //   const { contract } = params;
  //   const inCoolDownTotalBalance = await contract.getTotalDrafts();
  //   return { ...defaultDataProps, inCoolDownTotalBalance };
  // }

  // async getStatsItems({ contractPosition: { dataProps } }: GetDisplayPropsParams<StakedRsr, StakedRsrDataProps>) {
  //   return [{ label: 'In Cooldown Total Balance', value: buildNumberDisplayItem(dataProps.inCoolDownTotalBalance) }];
  // }

  async getLabel({ contractPosition }: GetDisplayPropsParams<StakedRsr>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<StakedRsr>): Promise<BigNumberish[]> {
    // Get FacadeRead
    const facadeRead = this.contractFactory.facadeRead({
      network: this.network,
      address: '0x243105ac960CDC1fae10FfE446F7a61EAB570E98',
    });

    // Get Main
    const main = this.contractFactory.main({
      network: this.network,
      address: await contract.main(),
    });

    // Get Basket Handler
    const bh = this.contractFactory.basketHandler({
      network: this.network,
      address: await main.basketHandler(),
    });

    // Get RToken
    const rToken = this.contractFactory.rtoken({
      network: this.network,
      address: await main.rToken(),
    });

    // Get block timestamp
    const provider = this.appToolkit.getNetworkProvider(this.network);
    const blockNumber = await provider.getBlockNumber();
    const timestamp = (await provider.getBlock(blockNumber)).timestamp;

    // Check if claiming is disabled
    const fullyCollateralized = await bh.fullyCollateralized();
    const basketSound = (await bh.status()) == CollateralStatus.SOUND;
    const mainPausedOrFrozen = await main.pausedOrFrozen();
    const claimingDisabled = !fullyCollateralized || !basketSound || mainPausedOrFrozen;

    // Process pending unstakings
    const pendingUnstakings = await facadeRead.pendingUnstakings(rToken.address, address);

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
