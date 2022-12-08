import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { DefaultAppTokenDataProps } from '~position/template/app-token.template.types';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { IdleContractFactory, IdleToken } from '../contracts';

export type IdleVaultTokenDefinition = {
  address: string;
  rewardTokenAddresses: string[];
};

@PositionTemplate()
export class EthereumIdleVaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  IdleToken,
  DefaultAppTokenDataProps,
  IdleVaultTokenDefinition
> {
  groupLabel = 'Vault';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IdleContractFactory) protected readonly contractFactory: IdleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): IdleToken {
    return this.contractFactory.idleToken({ address, network: this.network });
  }

  async getDefinitions(): Promise<IdleVaultTokenDefinition[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });

    const vaultDefinitions = await Promise.all(
      appTokens.map(async appToken => {
        const idleTokenContract = this.contractFactory.idleToken({ address: appToken.address, network: this.network });
        const isRiskAdjusted = await multicall.wrap(idleTokenContract).isRiskAdjusted();
        if (isRiskAdjusted == true) return null;

        const rewardTokenAddressesRaw = await multicall.wrap(idleTokenContract).getGovTokens();
        const rewardTokenAddresses = rewardTokenAddressesRaw.map(x => x.toLowerCase());
        return {
          address: appToken.address,
          rewardTokenAddresses,
        };
      }),
    );

    return _.compact(vaultDefinitions);
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<IdleToken, IdleVaultTokenDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.address,
        network: this.network,
      },
      ...definition.rewardTokenAddresses.map(address => ({
        metaType: MetaType.CLAIMABLE,
        address,
        network: this.network,
      })),
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<IdleToken>) {
    return `${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<IdleToken>) {
    const [balanceRaw, rewardBalancesRaw] = await Promise.all([
      contract.balanceOf(address),
      contract.getGovTokensAmounts(address),
    ]);

    return [balanceRaw, ...rewardBalancesRaw];
  }
}
