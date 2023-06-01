import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ThalesVaultContractPositionFetcher } from '../common/thales.vault.contract-position-fetcher';

@PositionTemplate()
export class OptimismThalesVaultContractPositionFetcher extends ThalesVaultContractPositionFetcher {
  vaultDefinitions = [
    { address: '0xb484027cb0c538538bad2be492714154f9196f93', name: 'Thales Discount' },
    { address: '0x43318de9e8f65b591598f17add87ae7247649c83', name: 'Thales Degen Discount' },
    { address: '0x6c7fd4321183b542e81bcc7de4dfb88f9dbca29f', name: 'Thales Safu Discount' },
    { address: '0xc922f4cde42dd658a7d3ea852caf7eae47f6cecd', name: 'Overtime Discount' },
    { address: '0xbaac5464bf6e767c9af0e8d4677c01be2065fd5f', name: 'Overtime Degen Discount' },
    { address: '0x43d19841d818b2ccc63a8b44ce8c7def8616d98e', name: 'Overtime Safu Discount' },
    { address: '0x8285047f33c26c1bf5b387f2b07f21a2af29ace2', name: 'Overtime Parlay Discount' },
    { address: '0x5e2b49c68f1fd68af1354c377eacec2f05632d3f', name: 'Overtime Upsettoor' },
  ];
}
