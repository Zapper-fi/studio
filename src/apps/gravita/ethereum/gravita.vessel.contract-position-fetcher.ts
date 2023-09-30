import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GravitaVesselContractPositionFetcher } from '../common/gravita.vessel.contract-position-fetcher';

@PositionTemplate()
export class EthereumGravitaVesselContractPositionFetcher extends GravitaVesselContractPositionFetcher {
  vesselManagerAddress = '0xdb5dacb1dfbe16326c3656a88017f0cb4ece0977';
  borrowerOperationsAddress = '0x2bca0300c2aa65de6f19c2d241b54a445c9990e2';
  collateralTokenAddresses = [
    '0xae78736cd615f374d3085123a210448e74fc6393', // rETH
    '0xb9d7dddca9a4ac480991865efef82e01273f79c3', // bLUSD
    '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0', // wstETH
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // wETH
    '0xf951e335afb289353dc249e82926178eac7ded78', // swETH
    '0xac3e018457b222d93114458476f3e3416abbe38f', // sfrxETH
  ];
}
