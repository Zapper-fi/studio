import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { StakeDaoContractFactory, StakeDaoVault } from '../contracts';

@PositionTemplate()
export class EthereumStakeDaoVaultTokenFetcher extends AppTokenTemplatePositionFetcher<StakeDaoVault> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StakeDaoContractFactory) protected readonly contractFactory: StakeDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StakeDaoVault {
    return this.contractFactory.stakeDaoVault({ address, network: this.network });
  }

  getAddresses() {
    return [
      '0xd935a972758342c8807cf99870eebca8108b4fbf', // frxETH
      '0xdd007cb6005017e548c761c2d12d9aa03961c30a', // STG/USDC
      '0x5a76a7fd20dde55cecefb0803ac3a1051c954eaa', // TricryptoUSDC
      '0x2d1bd6ba23f587abcb405bce008839c8978c5222', // TricryptoUSDT
      '0x37b24ac19504c0c6fc1adc8deb5d24f5c4f6a2f2', // crvUSD/USDT
      '0xbc61f6973ce564effb16cd79b5bc3916ead592e2', // UZD/FRAXBP
      '0x11d87d278432bb2ca6ce175e4a8b4abdade80fd0', // FRAX/USDC
      '0x04718089aa7574785f0ae88d53c19f4df43a4de8', // cvxCRV/CRV
      '0x1513b44a589ffc76d0727968eb55da4110b39422', // SDT/ETH
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<StakeDaoVault>) {
    return [{ address: await contract.token(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
