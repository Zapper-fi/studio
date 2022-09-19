import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class AvalancheSteakHutVeTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'Voting Escrow';

  vaultAddress = '0xe7250b05bd8dee615ecc681eda1196add5156f2b';
  underlyingTokenAddress = '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd';
}
