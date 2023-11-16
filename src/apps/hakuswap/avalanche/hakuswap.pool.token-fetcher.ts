import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { UniswapV2PoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';
import { GetTokenPropsParams, DefaultAppTokenDefinition } from '~position/template/app-token.template.types';

import { HakuswapViemContractFactory } from '../contracts';
import { HakuswapFactory, HakuswapPool } from '../contracts/viem';
import { HakuswapFactoryContract } from '../contracts/viem/HakuswapFactory';
import { HakuswapPoolContract } from '../contracts/viem/HakuswapPool';

const poolNotUsingDecimals = [
  '0x519de4668ea6661d1870928a3033a62dc2acc503',
  '0x1f0bc5c91518d903c0c097bde9741746b4423008',
  '0x29e144ea1abac02b62be7afb877d1bbaca141295',
  '0x6075eccadfc2917d58062af55090b6bd3de258f5',
  '0x6c2782d9632efd35e93d33e25ba75c118682954c',
  '0x3152e0dd889045595d7635d8fc41965cea6209f2',
  '0xeffff893f9423fdb7a5c010cef202ea5a52575a6',
  '0x6f6a5f63cc7b7ddcad76752e633d45f3d5efb0e2',
  '0xffa26cb3458023c4b78c3d10f8bef4704c2fd198',
  '0x6bdd9d3ebb4be7289ccb8d7d8c6d95ee4a37ae7e',
  '0x022057df5019b8c165dda59c360cbc0842488c18',
  '0x8caf27646b392c7fdd49d8c55f3d93dd70cb1692',
];

@PositionTemplate()
export class AvalancheHakuswapPoolTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher<
  HakuswapPool,
  HakuswapFactory
> {
  factoryAddress = '0x2db46feb38c57a6621bca4d97820e1fc1de40f41';
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HakuswapViemContractFactory) protected readonly contractFactory: HakuswapViemContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string): HakuswapPoolContract {
    return this.contractFactory.hakuswapPool({ address, network: this.network });
  }

  getPoolFactoryContract(address: string): HakuswapFactoryContract {
    return this.contractFactory.hakuswapFactory({ address, network: this.network });
  }

  getPoolsLength(contract: HakuswapFactoryContract): Promise<BigNumberish> {
    return contract.read.allPairsLength();
  }

  getPoolAddress(contract: HakuswapFactoryContract, index: number): Promise<string> {
    return contract.read.allPairs([BigInt(index)]);
  }

  getPoolToken0(contract: HakuswapPoolContract): Promise<string> {
    return contract.read.token0();
  }

  getPoolToken1(contract: HakuswapPoolContract): Promise<string> {
    return contract.read.token1();
  }

  async getPoolReserves(contract: HakuswapPoolContract): Promise<BigNumberish[]> {
    const reserves = await contract.read.getReserves();
    return [reserves[0], reserves[1]];
  }

  async getDecimals({
    address,
    contract,
  }: GetTokenPropsParams<HakuswapPool, DefaultAppTokenDefinition, DefaultAppTokenDefinition>): Promise<number> {
    const decimals = !poolNotUsingDecimals.includes(address) ? await contract.read.decimals() : 0;

    return decimals;
  }
}
