import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class ArbitrumPlutusPlsJonesTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'plsJONES';

  vaultAddress = '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44';
  underlyingTokenAddress = '0xe8ee01ae5959d3231506fcdef2d5f3e85987a39c';
}
