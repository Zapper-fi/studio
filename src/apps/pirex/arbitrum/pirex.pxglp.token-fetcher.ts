import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class ArbitrumPirexPxGlpTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'Pirex GMX';
  vaultAddress = '0x0eac365e4d7de0e293078bd771ba7d0ba9a4c892';
  underlyingTokenAddress = '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258';
}
