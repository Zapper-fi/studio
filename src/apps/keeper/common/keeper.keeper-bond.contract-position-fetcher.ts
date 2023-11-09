import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, find, sumBy } from 'lodash';

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

import { KeeperViemContractFactory } from '../contracts';
import { KeeperJobManager } from '../contracts/viem';

import { KeeperBond, SUBGRAPH_URL, GET_BONDS, GET_USER_BONDS } from './keeper.keeper-bond.queries';

type KeeperBondDefinition = {
  address: string;
  bonded: string;
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

type KeeperBondDataProps = DefaultDataProps;

export abstract class KeeperBondContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  KeeperJobManager,
  KeeperBondDataProps,
  KeeperBondDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KeeperViemContractFactory) protected readonly contractFactory: KeeperViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.keeperJobManager({ address, network: this.network });
  }

  async getDefinitions() {
    const bondData = await gqlFetchAll<KeeperBond>({
      endpoint: SUBGRAPH_URL,
      query: GET_BONDS,
      variables: {},
      dataToSearch: 'bonds',
    });

    const bonds = bondData.bonds.map(v => ({ ...v, address: v.keeper.id }));

    return bonds.flat();
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<KeeperJobManager, KeeperBondDefinition>) {
    return [{ metaType: MetaType.LOCKED, address: definition.token.id, network: this.network }];
  }

  async getLabel() {
    return 'Keep3r Bonded Tokens';
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<KeeperBondDataProps>[]> {
    const positions = await this.appToolkit.getAppContractPositions<KeeperBondDataProps>({
      network: this.network,
      appId: this.appId,
      groupIds: [this.groupId],
    });

    const userBondsData = await gqlFetchAll<KeeperBond>({
      endpoint: SUBGRAPH_URL,
      query: GET_USER_BONDS,
      variables: { address },
      dataToSearch: 'bonds',
    });

    const parsedBonds = userBondsData.bonds
      .map(userBond => {
        const position = positions.find(v => v.address === userBond.keeper.id);
        if (!position) return null;

        const token = find(position.tokens, { address: userBond.token.id });
        if (!token) {
          return null;
        }

        return drillBalance(token, userBond.bonded);
      })
      .filter(bond => !!bond) as (
      | WithMetaType<BaseTokenBalance>
      | WithMetaType<AppTokenPositionBalance<DefaultDataProps>>
    )[];

    const balanceUSD = sumBy(parsedBonds, v => v.balanceUSD);
    const images = parsedBonds.map(bond => getImagesFromToken(bond)).flat();

    // Display Properties
    const label = 'Keep3r Bonded Tokens';
    const secondaryLabel = '';
    const displayProps = { label, secondaryLabel, images };
    const positionBalance: ContractPositionBalance = {
      type: ContractType.POSITION,
      appId: this.appId,
      groupId: this.groupId,
      network: this.network,
      tokens: parsedBonds,
      balanceUSD,
      dataProps: {},
      displayProps,
      address,
    };

    return compact([positionBalance].flat());
  }
}
