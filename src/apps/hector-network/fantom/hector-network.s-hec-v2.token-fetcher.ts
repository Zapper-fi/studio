import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class FantomHectorNetworkSHecV2TokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'Staked HEC V2';

  vaultAddress = '0x75bdef24285013387a47775828bec90b91ca9a5f';
  underlyingTokenAddress = '0x5c4fdfc5233f935f20d2adba572f770c2e377ab0';
}
