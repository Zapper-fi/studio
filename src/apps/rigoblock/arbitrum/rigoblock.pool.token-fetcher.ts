import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RigoblockPoolTokenFetcher } from '../common/rigoblock.pool.token-fetcher';

@PositionTemplate()
export class ArbitrumRigoblockPoolTokenFetcher extends RigoblockPoolTokenFetcher {
  groupLabel: string = 'Smart Pools';
  blockedTokenAddresses = [
    '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
    '0x46ca8ed5465cb859bb3c3364078912c25f4d74de', // KTN
    '0x873484f654a7203296931f529680449e8a642898', // iETHV
    '0x3c998a2c7408b1043a047a3fe10114483ed1958d', // MYM
    '0xdab8c8776a4041415a60ed6b339d8e667cf2a934', // PERPI
    '0xdf6b7b551a09ddb8d879165b870e6085db027036', // BRCF
    '0x79f707d68cd49ca5d9aeb33affd4477c3ea8ea8f', // ETHV
    '0x9842989969687f7d249d01cae1d2ff6b7b6b6d35', // CRYPTO
    '0xbad58ed9b5f26a002ea250d7a60dc6729a4a2403', // PBX
    '0x7f4638a58c0615037decc86f1dae60e55fe92874', // GRG
  ];
}
