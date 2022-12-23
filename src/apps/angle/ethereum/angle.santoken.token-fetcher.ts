import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { AngleApiHelper } from '../common/angle.api';
import { AngleContractFactory, AngleSantoken } from '../contracts';

@PositionTemplate()
export class EthereumAngleSantokenTokenFetcher extends AppTokenTemplatePositionFetcher<AngleSantoken> {
  groupLabel = 'Yield Bearing';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) protected readonly contractFactory: AngleContractFactory,
    @Inject(AngleApiHelper) protected readonly angleApiHelper: AngleApiHelper,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AngleSantoken {
    return this.contractFactory.angleSantoken({ address, network: this.network });
  }

  async getAddresses() {
    // https://raw.githubusercontent.com/AngleProtocol/angle-token-list/main/ERC20_LIST.json
    return [
      '0x9c215206da4bf108ae5aeef9da7cad3352a36dad',
      '0x30c955906735e48d73080fd20cb488518a6333c8',
      '0x5d8d3ac6d21c016f9c935030480b7057b21ec804',
      '0xb3b209bb213a5da5b947c56f2c770b3e1015f1fe',
      '0x7b8e89b0ce7bac2cfec92a371da899ea8cbdb450',
    ];
  }

  async getUnderlyingTokenDefinitions({ contract, multicall }: GetUnderlyingTokensParams<AngleSantoken>) {
    const [stableMasterAddress, poolManagerAddress] = await Promise.all([
      contract.stableMaster(),
      contract.poolManager(),
    ]);

    const stableMaster = this.contractFactory.angleStablemaster({
      address: stableMasterAddress,
      network: this.network,
    });

    const collateralMap = await multicall.wrap(stableMaster).collateralMap(poolManagerAddress);
    return [{ address: collateralMap.token, network: this.network }];
  }

  async getPricePerShare({ contract, multicall }: GetPricePerShareParams<AngleSantoken>) {
    const [stableMasterAddress, poolManagerAddress] = await Promise.all([
      contract.stableMaster(),
      contract.poolManager(),
    ]);

    const stableMaster = this.contractFactory.angleStablemaster({
      address: stableMasterAddress,
      network: this.network,
    });

    const collateralMap = await multicall.wrap(stableMaster).collateralMap(poolManagerAddress);
    const pricePerShare = Number(collateralMap.sanRate) / 10 ** 18;

    return [pricePerShare];
  }
}
