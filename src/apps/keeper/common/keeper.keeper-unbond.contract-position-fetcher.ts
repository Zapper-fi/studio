import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, find, sumBy } from 'lodash';
import moment from 'moment';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetchAll } from '~app-toolkit/helpers/the-graph.helper';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps, WithMetaType } from '~position/display.interface';
import {
  AppTokenPositionBalance,
  BaseTokenBalance,
  ContractPositionBalance,
} from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { KeeperContractFactory, KeeperJobManager } from '../contracts';

import { KeeperUnbond, SUBGRAPH_URL, GET_UNBONDS, GET_USER_UNBONDS } from './keeper.keeper-unbond.queries';

type KeeperUnbondDefinition = {
  address: string;
  pendingUnbonds: string;
  withdrawableAfter;
  token: {
    id: string;
    name: string;
    symbol: string;
    decimals: string;
  };
  keeper: {
    id: string;
  };
};

type KeeperUnbondDataProps = DefaultDataProps;

export abstract class KeeperUnbondContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  KeeperJobManager,
  KeeperUnbondDataProps,
  KeeperUnbondDefinition
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
    const unbondData = await gqlFetchAll<KeeperUnbond>({
      endpoint: SUBGRAPH_URL,
      query: GET_UNBONDS,
      variables: {},
      dataToSearch: 'bonds',
    });

    const unbonds = unbondData.bonds.map(v => ({ ...v, address: v.keeper.id }));

    return unbonds.flat();
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<KeeperJobManager, KeeperUnbondDefinition>) {
    return [
      moment().unix() > Number(definition.withdrawableAfter)
        ? { metaType: MetaType.CLAIMABLE, address: definition.token.id, network: this.network }
        : { metaType: MetaType.LOCKED, address: definition.token.id, network: this.network },
    ];
  }

  async getLabel() {
    return 'Keep3r Unbonded Tokens';
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<KeeperUnbondDataProps>[]> {
    const positions = await this.appToolkit.getAppContractPositions<KeeperUnbondDataProps>({
      network: this.network,
      appId: this.appId,
      groupIds: [this.groupId],
    });

    const userUnbondsData = await gqlFetchAll<KeeperUnbond>({
      endpoint: SUBGRAPH_URL,
      query: GET_USER_UNBONDS,
      variables: { address },
      dataToSearch: 'bonds',
    });

    const parsedUnbonds = userUnbondsData.bonds
      .map(userUnbond => {
        const position = positions.find(v => v.address === userUnbond.keeper.id);
        if (!position) return null;

        const token = find(position.tokens, { address: userUnbond.token.id });
        if (!token) {
          return null;
        }

        return drillBalance(token, userUnbond.pendingUnbonds);
      })
      .filter(unbond => !!unbond) as (
      | WithMetaType<BaseTokenBalance>
      | WithMetaType<AppTokenPositionBalance<DefaultDataProps>>
    )[];

    const balanceUSD = sumBy(parsedUnbonds, v => v.balanceUSD);
    const images = parsedUnbonds.map(unbond => getImagesFromToken(unbond)).flat();

    // Display Properties
    const label = 'Keep3r Unbonded Tokens';
    const secondaryLabel = '';
    const displayProps = { label, secondaryLabel, images };
    const positionBalance: ContractPositionBalance = {
      type: ContractType.POSITION,
      appId: this.appId,
      groupId: this.groupId,
      network: this.network,
      tokens: parsedUnbonds,
      balanceUSD,
      dataProps: {},
      displayProps,
      address,
    };

    positionBalance.key = this.appToolkit.getPositionKey(positionBalance);

    return compact([positionBalance].flat());
  }
}
