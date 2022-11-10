import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

@PositionTemplate()
export class FantomOlympusGOhmTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'gOHM';
  vaultAddress = '0x91fa20244fb509e8289ca630e5db3e9166233fdc';
  underlyingTokenAddress = '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f';
  fromNetwork = Network.ETHEREUM_MAINNET;
}
