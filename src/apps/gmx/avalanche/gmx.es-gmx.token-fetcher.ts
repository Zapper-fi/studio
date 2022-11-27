import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { GmxEsGmxTokenFetcher } from '../common/gmx.es-gmx.token-helper';
import { GMX_DEFINITION } from '../gmx.definition';

@Injectable()
export class AvalancheGmxEsGmxTokenFetcher extends GmxEsGmxTokenFetcher {
  appId = GMX_DEFINITION.id;
  groupId = GMX_DEFINITION.groups.esGmx.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'esGMX';
  isExcludedFromTvl = true;

  esGmxAddress = '0xff1489227bbaac61a9209a08929e4c2a526ddd17';
  gmxAddress = '0x62edc0692bd897d2295872a9ffcac5425011c661';
}
