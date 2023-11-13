import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, range, sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { OriginDollarGovernanceContractFactory, Veogv } from '../contracts';

@PositionTemplate()
export class EthereumOriginDollarGovernanceVeOgvContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Veogv> {
  groupLabel = 'Governance Staked';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OriginDollarGovernanceContractFactory)
    private readonly contractFactory: OriginDollarGovernanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Veogv {
    return this.contractFactory.veogv({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x0c4576ca1c365868e162554af8e385dc3e7c66d9' }];
  }

  async getTokenDefinitions({
    contract,
  }: GetTokenDefinitionsParams<Veogv>): Promise<UnderlyingTokenDefinition[] | null> {
    const address = await contract.ogv();
    return [
      {
        address,
        metaType: MetaType.LOCKED,
        network: this.network,
      },
      {
        address,
        metaType: MetaType.CLAIMABLE,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<Veogv>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<Veogv, DefaultDataProps>): Promise<BigNumberish[]> {
    const lockupsRaw = await Promise.all(
      range(0, 15).map(async index => {
        const amount = await contract
          .lockups(address, index)
          .then(x => x.amount)
          .catch(() => null);
        return amount;
      }),
    );
    const lockups = compact(lockupsRaw);
    const locked = sum(lockups.map(x => Number(x)));

    const rewardBalance = await contract.previewRewards(address);
    return [locked, rewardBalance];
  }
}
