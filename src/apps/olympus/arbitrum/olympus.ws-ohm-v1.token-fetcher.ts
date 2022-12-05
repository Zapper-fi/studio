import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

@PositionTemplate()
export class ArbitrumOlympusWsOhmV1TokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'wsOHM v1';
  vaultAddress = '0x739ca6d71365a08f584c8fc4e1029045fa8abc4b';
  underlyingTokenAddress = '0xca76543cf381ebbb277be79574059e32108e3e65';
  fromNetwork = Network.ETHEREUM_MAINNET;
}
