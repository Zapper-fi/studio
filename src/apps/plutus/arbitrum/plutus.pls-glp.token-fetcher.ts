import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class ArbitrumPlutusPlsGlpTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'plsGLP';

  vaultAddress = '0x530f1cbb2ebd71bec58d351dcd3768148986a467';
  underlyingTokenAddress = '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258';
}
