import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { StakeDaoViemContractFactory } from '../contracts';
import { StakeDaoVault } from '../contracts/viem';

@PositionTemplate()
export class EthereumStakeDaoVaultTokenFetcher extends AppTokenTemplatePositionFetcher<StakeDaoVault> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StakeDaoViemContractFactory) protected readonly contractFactory: StakeDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.stakeDaoVault({ address, network: this.network });
  }

  async getAddresses() {
    const angleVault = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['angle-vault'],
    });
    const pendleVault = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['pendle-vault'],
    });
    const curveVault1 = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['curve-vault-1'],
    });
    const curveVault2 = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['curve-vault-2'],
    });
    const balancerVault = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['balancer-vault'],
    });

    const vaultAppTokens = [...angleVault, ...pendleVault, ...curveVault1, ...curveVault2, ...balancerVault];

    return vaultAppTokens.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<StakeDaoVault>) {
    return [{ address: await contract.read.token(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
