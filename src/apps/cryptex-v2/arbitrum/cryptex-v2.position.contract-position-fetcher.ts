import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ContractPositionFetcher } from 'cryptex-v2.position.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumContractPositionFetcher extends ContractPositionFetcher {
  groupLabel = 'Positions';
  collateralAddress = '0xaf8ced28fce00abd30463d55da81156aa5aeeec2';
  positions = [
    {
      lpAddress: '0xEa281a4c70Ee2ef5ce3ED70436C81C0863A3a75a', // TVA - LP
      shortAddress: '0x4243b34374cfb0a12f184b92f52035d03d4f7056', 
      longAddress: '0x1cd33f4e6edeee8263aa07924c2760cf2ec8aad0',
      rebateAddresses: [
        '0x938F145D5f3ABf681618Dcc5c71f095B870747Ba', // Rebates
      ],
    },
  ];
}
