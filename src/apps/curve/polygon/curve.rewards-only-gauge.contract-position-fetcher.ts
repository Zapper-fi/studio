import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveRewardsOnlyGaugeContractPositionFetcher } from '../common/curve.rewards-only-gauge.contract-position-fetcher';

@PositionTemplate()
export class PolygonCurveRewardsOnlyGaugeContractPositionFetcher extends CurveRewardsOnlyGaugeContractPositionFetcher {
  groupLabel = 'Staking';
  gaugeAddresses = [
    '0x19793b454d3afc7b454f206ffe95ade26ca6912c',
    '0xffbacce0cc7c19d46132f1258fc16cf6871d153c',
    '0x40c0e9376468b4f257d15f8c47e5d0c646c28880',
    '0xb0a366b987d77b5ed5803cbd95c80bb6deab48c0',
    '0x9bd996db02b3f271c6533235d452a56bc2cd195a',
    '0x3b6b158a76fd8ccc297538f454ce7b4787778c7c',
  ];
}
