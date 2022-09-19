import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class FantomHectorNetworkSHecV1TokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'Staked HEC V1';

  vaultAddress = '0x36f26880c6406b967bdb9901cde43abc9d53f106';
  underlyingTokenAddress = '0x5c4fdfc5233f935f20d2adba572f770c2e377ab0';
}
