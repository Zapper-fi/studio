import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@Injectable()
export abstract class AbracadabraBridgedStakedSpellTokenFetcher extends WrapperTemplateTokenFetcher {
  async getApy(): Promise<number> {
    const { data } = await axios.get<{ apr: number }>('/api/v1/ethereum/SpellStakingInfo', {
      baseURL: 'https://analytics.back.popsicle.finance',
    });
    return data.apr;
  }
}
