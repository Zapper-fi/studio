import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OlympusBondContractPositionHelper } from '../helpers/olympus.bond.contract-position-helper';
import { OLYMPUS_DEFINITION } from '../olympus.definition';

@Register.ContractPositionFetcher({
  appId: OLYMPUS_DEFINITION.id,
  groupId: OLYMPUS_DEFINITION.groups.bond.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumOlympusBondContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(OlympusBondContractPositionHelper)
    private readonly olympusContractPositionHelper: OlympusBondContractPositionHelper,
  ) {}
  async getPositions(): Promise<ContractPosition[]> {
    const network = Network.ETHEREUM_MAINNET;
    const depositories = [
      { depositoryAddress: '0xc20cfff07076858a7e642e396180ec390e5a02f7', symbol: 'OHM-FRAX LP' },
      { depositoryAddress: '0x8510c8c2b6891e04864fa196693d44e6b6ec2514', symbol: 'FRAX' },
      { depositoryAddress: '0x575409f8d77c12b05fed8b455815f0e54797381c', symbol: 'DAI' },
      { depositoryAddress: '0x956c43998316b6a2f21f89a1539f73fb5b78c151', symbol: 'OHM-DAI SLP' },
      { depositoryAddress: '0xe6295201cd1ff13ced5f063a5421c39a1d236f1c', symbol: 'WETH' },
      { depositoryAddress: '0x10c0f93f64e3c8d0a1b0f4b87d6155fd9e89d08d', symbol: 'LUSD' },
    ];
    const mintedTokenAddress = '0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5'; // Since OHM v1 and OHM have the same symbol

    return this.olympusContractPositionHelper.getPositions({
      appId: OLYMPUS_DEFINITION.id,
      network,
      groupId: OLYMPUS_DEFINITION.groups.bond.id,
      depositories,
      mintedTokenAddress,
    });
  }
}
