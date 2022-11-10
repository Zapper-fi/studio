import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

@PositionTemplate()
export class ArbitrumOlympusGOhmTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'gOHM';
  vaultAddress = '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1';
  underlyingTokenAddress = '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f';
  fromNetwork = Network.ETHEREUM_MAINNET;
}
