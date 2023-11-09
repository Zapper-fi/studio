import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AngleApiHelper } from '../common/angle.api';
import { AngleViemContractFactory } from '../contracts';
import { AngleSanToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumAngleSanTokenTokenFetcher extends AppTokenTemplatePositionFetcher<AngleSanToken> {
  groupLabel = 'Yield Bearing';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AngleViemContractFactory) protected readonly contractFactory: AngleViemContractFactory,
    @Inject(AngleApiHelper) protected readonly angleApiHelper: AngleApiHelper,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.angleSanToken({ address, network: this.network });
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

  async getUnderlyingTokenDefinitions({ contract, multicall }: GetUnderlyingTokensParams<AngleSanToken>) {
    const [stableMasterAddress, poolManagerAddress] = await Promise.all([
      contract.read.stableMaster(),
      contract.read.poolManager(),
    ]);

    const stableMaster = this.contractFactory.angleStablemaster({
      address: stableMasterAddress,
      network: this.network,
    });

    const collateralMap = await multicall.wrap(stableMaster).read.collateralMap([poolManagerAddress]);
    return [{ address: collateralMap.token, network: this.network }];
  }

  async getPricePerShare({ contract, multicall }: GetPricePerShareParams<AngleSanToken>) {
    const [stableMasterAddress, poolManagerAddress] = await Promise.all([
      contract.read.stableMaster(),
      contract.read.poolManager(),
    ]);

    const stableMaster = this.contractFactory.angleStablemaster({
      address: stableMasterAddress,
      network: this.network,
    });

    const collateralMap = await multicall.wrap(stableMaster).read.collateralMap([poolManagerAddress]);
    const pricePerShare = Number(collateralMap.sanRate) / 10 ** 18;

    return [pricePerShare];
  }

  async getLabel({
    appToken,
  }: GetDisplayPropsParams<AngleSanToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>): Promise<string> {
    return `san${getLabelFromToken(appToken.tokens[0])} / EUR`;
  }
}
