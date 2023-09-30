import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GravitaVesselContractPositionFetcher } from '../common/gravita.vessel.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumGravitaVesselContractPositionFetcher extends GravitaVesselContractPositionFetcher {
  vesselManagerAddress = '0x6adaa3eba85c77e8566b73aefb4c2f39df4046ca';
  borrowerOperationsAddress = '0x89f1eccf2644902344db02788a790551bb070351';
  collateralTokenAddresses = [
    '0x5979d7b546e38e414f7e9822514be443a4800529', // wstETH
    '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // WETH
    '0x8ffdf2de812095b1d19cb146e4c004587c0a0692', // LUSD
    '0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8', // rETH
  ];
}
