import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SolaceBondsContractPositionFetcher } from '../common/solace.bonds.contract-position-fetcher';

@PositionTemplate()
export class PolygonSolaceBondsContractPositionFetcher extends SolaceBondsContractPositionFetcher {
  groupLabel = 'Bonds';
  bondTellerAddresses = [
    '0x501ace677634fd09a876e88126076933b686967a', // DAI Bond
    '0x501ace367f1865dea154236d5a8016b80a49e8a9', // ETH Bond
    '0x501ace7e977e06a3cb55f9c28d5654c9d74d5ca9', // USDC Bond
    '0x501acef0d0c73bd103337e6e9fd49d58c426dc27', // WBTC Bond
    '0x501ace5ceec693df03198755ee80d4ce0b5c55fe', // USDT Bond
    '0x501acef4f8397413c33b13cb39670ad2f17bfe62', // FRAX Bond
    '0x501ace133452d4df83ca68c684454fcba608b9dd', // MATIC Bond
  ];
}
