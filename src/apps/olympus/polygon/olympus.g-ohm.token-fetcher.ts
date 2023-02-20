import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

@PositionTemplate()
export class PolygonOlympusGOhmTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'gOHM';
  vaultAddress = '0xd8ca34fd379d9ca3c6ee3b3905678320f5b45195';
  underlyingTokenAddress = '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f';
  fromNetwork = Network.ETHEREUM_MAINNET;
}
