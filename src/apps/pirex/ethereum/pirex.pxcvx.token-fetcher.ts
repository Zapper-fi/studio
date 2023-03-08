import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class EthereumPirexPxCvxTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'Pirex Convex';
  vaultAddress = '0xbce0cf87f513102f22232436cca2ca49e815c3ac';
  underlyingTokenAddress = '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b';
}
