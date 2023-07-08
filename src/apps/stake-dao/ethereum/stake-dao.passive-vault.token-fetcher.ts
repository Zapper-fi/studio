import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { StakeDaoContractFactory } from '../contracts';
import { StakeDaoPassiveVault } from '../contracts/ethers/StakeDaoPassiveVault';

@PositionTemplate()
export class EthereumStakeDaoPassiveVaultTokenFetcher extends AppTokenTemplatePositionFetcher<StakeDaoPassiveVault> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StakeDaoContractFactory) protected readonly contractFactory: StakeDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StakeDaoPassiveVault {
    return this.contractFactory.stakeDaoPassiveVault({ address, network: this.network });
  }

  getAddresses() {
    return [
      '0x5af15da84a4a6edf2d9fa6720de921e1026e37b7', // Passive FRAX
      '0xcd6997334867728ba14d7922f72c893fcee70e84', // Passive sEUR
      '0xbc10c4f7b9fe0b305e8639b04c536633a3db7065', // Passive stETH
      '0xa2761b0539374eb7af2155f76eb09864af075250', // Passive sETH
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<StakeDaoPassiveVault>) {
    return [{ address: await contract.token(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<StakeDaoPassiveVault>) {
    const pricePerShareRaw = await contract.getPricePerFullShare();

    return [Number(pricePerShareRaw) / 10 ** appToken.decimals];
  }
}
