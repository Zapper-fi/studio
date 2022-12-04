import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GmxEsGmxTokenFetcher } from '../common/gmx.es-gmx.token-fetcher';

@PositionTemplate()
export class AvalancheGmxEsGmxTokenFetcher extends GmxEsGmxTokenFetcher {
  groupLabel = 'esGMX';
  isExcludedFromTvl = true;

  esGmxAddress = '0xff1489227bbaac61a9209a08929e4c2a526ddd17';
  gmxAddress = '0x62edc0692bd897d2295872a9ffcac5425011c661';
}
