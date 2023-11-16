import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { StakeDaoViemContractFactory } from '../contracts';
import { StakeDaoPassiveVault } from '../contracts/viem/StakeDaoPassiveVault';

@PositionTemplate()
export class EthereumStakeDaoPassiveVaultTokenFetcher extends AppTokenTemplatePositionFetcher<StakeDaoPassiveVault> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StakeDaoViemContractFactory) protected readonly contractFactory: StakeDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.stakeDaoPassiveVault({ address, network: this.network });
  }

  getAddresses() {
    return [
      '0x5af15da84a4a6edf2d9fa6720de921e1026e37b7', // Passive FRAX
      '0xcd6997334867728ba14d7922f72c893fcee70e84', // Passive sEUR
      '0xbc10c4f7b9fe0b305e8639b04c536633a3db7065', // Passive stETH
      '0xa2761b0539374eb7af2155f76eb09864af075250', // Passive sETH
      '0xb17640796e4c27a39af51887aff3f8dc0daf9567', // Passive 3CRV
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<StakeDaoPassiveVault>) {
    return [{ address: await contract.read.token(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<StakeDaoPassiveVault>) {
    const pricePerShareRaw = await contract.read.getPricePerFullShare();

    return [Number(pricePerShareRaw) / 10 ** appToken.decimals];
  }
}
