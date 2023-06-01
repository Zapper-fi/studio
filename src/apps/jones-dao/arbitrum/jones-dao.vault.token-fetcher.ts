import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { JonesDaoContractFactory } from '../contracts';
import { JonesVault } from '../contracts/ethers/JonesVault';

export type JonesDaoVaultTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class ArbitrumJonesDaoVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  JonesVault,
  DefaultAppTokenDataProps,
  JonesDaoVaultTokenDefinition
> {
  groupLabel = 'Vaults';
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(JonesDaoContractFactory) protected readonly contractFactory: JonesDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): JonesVault {
    return this.contractFactory.jonesVault({ network: this.network, address });
  }

  async getDefinitions(): Promise<JonesDaoVaultTokenDefinition[]> {
    return [
      {
        address: '0x662d0f9ff837a51cf89a1fe7e0882a906dac08a3', // jETH
        underlyingTokenAddress: ZERO_ADDRESS,
      },
      {
        address: '0x5375616bb6c52a90439ff96882a986d8fcdce421', // jgOHM
        underlyingTokenAddress: '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1', // gOHM
      },
      {
        address: '0xf018865b26ffab9cd1735dcca549d95b0cb9ea19', // jDPX
        underlyingTokenAddress: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', // DPX
      },
      {
        address: '0x1f6fa7a58701b3773b08a1a16d06b656b0eccb23', // jrDPX
        underlyingTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212', // rDPX
      },
    ];
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<JonesVault, JonesDaoVaultTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
