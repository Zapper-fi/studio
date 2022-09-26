import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class CronosArgoFinanceXArgoTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'xARGO';

  isExcludedFromBalances = true;
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  vaultAddress = '0xb966b5d6a0fcd5b373b180bbe072bbfbbee10552';
  underlyingTokenAddress = '0x47a9d630dc5b28f75d3af3be3aaa982512cd89aa';
}
