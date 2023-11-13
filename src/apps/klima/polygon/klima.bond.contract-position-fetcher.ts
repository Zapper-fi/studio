import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { OlympusBondContractPositionFetcher } from '~apps/olympus/common/olympus.bond.contract-position-fetcher';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { KlimaViemContractFactory } from '../contracts';
import { KlimaBondDepository } from '../contracts/viem';

@PositionTemplate()
export class PolygonKlimaBondContractPositionFetcher extends OlympusBondContractPositionFetcher<KlimaBondDepository> {
  groupLabel = 'Bonds';
  bondDefinitions = [
    {
      address: '0x7de627c56d26529145a5f9d85948ecbeaf9a4b34',
      bondedTokenAddress: '0x2f800db0fdb5223b3c3f354886d907a671414a7f',
      mintedTokenAddress: '0x4e78011ce80ee02d2c3e649fb657e45898257815',
    },
    {
      address: '0x27217c3f5bec4c12fa506a101bc4bd15417aeaa8',
      bondedTokenAddress: '0xfc98e825a2264d890f9a1e68ed50e1526abccacd',
      mintedTokenAddress: '0x4e78011ce80ee02d2c3e649fb657e45898257815',
    },
    {
      address: '0x1e0dd93c81ac7af2974cdb326c85b87dd879389b',
      bondedTokenAddress: '0x9803c7ae526049210a1725f7487af26fe2c24614',
      mintedTokenAddress: '0x4e78011ce80ee02d2c3e649fb657e45898257815',
    },
    {
      address: '0xbf2a35efcd85e790f02458db4a3e2f29818521c5',
      bondedTokenAddress: '0x1e67124681b402064cd0abe8ed1b5c79d2e02f64',
      mintedTokenAddress: '0x4e78011ce80ee02d2c3e649fb657e45898257815',
    },
    {
      address: '0xb5af101742ecae095944f60c384d09453006bfde',
      bondedTokenAddress: '0x5786b267d35f9d011c4750e0b0ba584e1fdbead1',
      mintedTokenAddress: '0x4e78011ce80ee02d2c3e649fb657e45898257815',
    },
    {
      address: '0xf9c3fc299de5f86d9cd6a724e6b44933720f5e6d',
      bondedTokenAddress: '0x64a3b8ca5a7e406a78e660ae10c7563d9153a739',
      mintedTokenAddress: '0x4e78011ce80ee02d2c3e649fb657e45898257815',
    },
  ];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KlimaViemContractFactory) protected readonly contractFactory: KlimaViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.klimaBondDepository({ address, network: this.network });
  }

  async resolveBondDefinitions() {
    return this.bondDefinitions;
  }

  async resolveVestingBalance({
    address,
    contract,
  }: GetTokenBalancesParams<KlimaBondDepository>): Promise<BigNumberish> {
    const [bondInfo, pendingPayout] = await Promise.all([
      contract.read.bondInfo([address]),
      contract.read.pendingPayoutFor([address]),
    ]);

    const vestingBalanceRaw = BigNumber.from(bondInfo[0]).gt(pendingPayout)
      ? BigNumber.from(bondInfo[0]).sub(pendingPayout)
      : BigNumber.from('0');

    return vestingBalanceRaw;
  }

  async resolveClaimableBalance({
    address,
    contract,
  }: GetTokenBalancesParams<KlimaBondDepository>): Promise<BigNumberish> {
    return contract.read.pendingPayoutFor([address]);
  }
}
