import { Injectable } from '@nestjs/common';

import { Erc20 } from '~contract/contracts/viem';
import { GetDataPropsParams } from '~position/template/app-token.template.types';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@Injectable()
export abstract class AbracadabraBridgedStakedSpellTokenFetcher extends WrapperTemplateTokenFetcher {
  async getReserves({ appToken }: GetDataPropsParams<Erc20>) {
    const liquidity = appToken.supply * appToken.price;
    return [liquidity / appToken.tokens[0].price];
  }
}
