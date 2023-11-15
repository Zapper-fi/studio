import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { JonesDaoViemContractFactory } from '../contracts';
import { JonesMetavault } from '../contracts/viem';

const VAULT_TYPE = ['Bull', 'Bear'];

type ArbitrumJonesDaoMetaVault = {
  address: string;
  underlyingToken: string;
};

@PositionTemplate()
export class ArbitrumJonesDaoMetavaultTokenFetcher extends ContractPositionTemplatePositionFetcher<
  JonesMetavault,
  DefaultDataProps,
  ArbitrumJonesDaoMetaVault
> {
  groupLabel = 'Metavault';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(JonesDaoViemContractFactory) protected readonly contractFactory: JonesDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.jonesMetavault({ address, network: this.network });
  }

  async getDefinitions() {
    const vaults = [
      '0x7a82a0ca7a2569d6cd3df2afeaf508f6d85fd2c3',
      '0xf3e914c15d0baa1f6537b0966d6f3394ba260747',
      '0x7aa12db079c901400e22a5b912204dc575ff9c19',
      '0x64f6c761d855a6eff9ef8b025b0258bddede5393',
    ];

    return await Promise.all(
      vaults.map(async address => {
        const contract = this.contractFactory.jonesMetavault({
          address,
          network: this.network,
        });
        const underlyingToken = await contract.read.depositToken();

        return { address, underlyingToken };
      }),
    );
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<JonesMetavault, ArbitrumJonesDaoMetaVault>) {
    return [
      {
        address: definition.underlyingToken,
        network: this.network,
        metaType: MetaType.SUPPLIED,
      },
    ];
  }

  async getLabel({ contractPosition, contract }: GetDisplayPropsParams<JonesMetavault>): Promise<string> {
    const type = await contract.read.vaultType();

    return `${getLabelFromToken(contractPosition.tokens[0])} ${VAULT_TYPE[type]} Metavault`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<JonesMetavault, DefaultDataProps>) {
    return Promise.all([contract.read.balanceOf([address])]);
  }
}
