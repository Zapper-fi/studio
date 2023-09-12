import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { PenguinContractFactory, PenguinVault } from '../contracts';

@PositionTemplate()
export class AvalanchePenguinVaultTokenFetcher extends AppTokenTemplatePositionFetcher<PenguinVault> {
  groupLabel = 'Compounder Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PenguinContractFactory) protected readonly contractFactory: PenguinContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PenguinVault {
    return this.contractFactory.penguinVault({ network: this.network, address });
  }

  async getAddresses() {
    return [
      '0xab6eed788beed09d1279b21b6c91f9750242e0f5',
      '0xbbd9dd1f15c729745edffd8e46253463d40a7d84',
      '0x323c5cc630c0ce1f2823d1a3d48260f770b5669b',
      '0xb6cd0569563549033c129769dbc58d1843ed98cb',
      '0x9acbca2315a517a3dab8e857f5921a8b3435891a',
      '0xdf5fb3fa0161a8508599a6dfc9d6c004cb58652b',
      '0x1ad8ff956247f87de904f31b0322843f32f19a5c',
      '0xbe42a57f4a08636c26457475e94409516fa39b3b',
      '0xfc8deac2f93e5b4739ece2802e5c5e05106fd872',
      '0xc90b9a965c800a0318ec4282a86e387beeef0ffe',
      '0xb4558486cd8fd2dd5e3b078e7822c1bb66c782d0',
      '0x85fc4ec9dee0df5060f321b743838f7068499177',
      '0xd6da9d000ffa1ea6d3939fcd80f4d473f2027567',
      '0x4ec41d1e25925c57876885c34fe0b323d7cc3846',
      '0x7dd48db5372539d01ed4b6cc525403d98bc61bdd',
      '0x21d2aaed1d2f5e36ff02b008b091054d065c9824',
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<PenguinVault>) {
    return [{ address: await contract.depositToken(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<PenguinVault>) {
    const reserveRaw = await contract.totalDeposits();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve / appToken.supply];
  }
}
