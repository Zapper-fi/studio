import { Inject } from '@nestjs/common';
import { BigNumber, utils } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { DefaultAppTokenDataProps } from '~position/template/app-token.template.types';

import { AuraBalancerPoolResolver } from '../common/aura.balancer-pool.resolver';
import { AuraViemContractFactory } from '../contracts';
import { AuraBalToken } from '../contracts/viem';

export type AuraBalTokenDefinition = {
  address: string;
};

@PositionTemplate()
export class EthereumAuraAuraBalTokenFetcher extends AppTokenTemplatePositionFetcher<
  AuraBalToken,
  DefaultAppTokenDataProps,
  AuraBalTokenDefinition
> {
  groupLabel = 'auraBAL';

  AURA_BAL_ADDRESS = '0x616e8bfa43f920657b3497dbf40d6b1a02d4608d';
  BAL_WETH_ADDRESS = '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56';
  POOL_ID = '0x3dd0843a028c86e0b760b1a76929d1c5ef93a2dd000200000000000000000249';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraViemContractFactory) protected readonly contractFactory: AuraViemContractFactory,
    @Inject(AuraBalancerPoolResolver)
    private readonly balancerPoolResolver: AuraBalancerPoolResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.auraBalToken({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return [this.AURA_BAL_ADDRESS];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: this.BAL_WETH_ADDRESS, network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getPrice(): Promise<number> {
    const balancerPool = await this.balancerPoolResolver.getBalancerPool(this.POOL_ID);

    const { tokens, totalLiquidity, totalShares } = balancerPool;

    const auraBAL = tokens.find(token => token.address === this.AURA_BAL_ADDRESS);
    if (!auraBAL) return 0;

    // Single-sided join: add 100 auraBAL
    const auraBALAmount = utils.parseUnits('100', auraBAL.decimals);
    const maxAmountsIn = tokens.map(token =>
      token.address === this.AURA_BAL_ADDRESS ? auraBALAmount : BigNumber.from(0),
    );

    const [bptOut] = await this.balancerPoolResolver.getBPTOut({ balancerPool, maxAmountsIn });
    const bptPerAuraBALRaw = BigNumber.from(bptOut).mul(utils.parseEther('1')).div(auraBALAmount);
    const bptPerAuraBAL = Number(bptPerAuraBALRaw) / 10 ** 18;

    const bptPrice = totalLiquidity / totalShares;
    const auraBALPrice = bptPrice / bptPerAuraBAL;
    return auraBALPrice;
  }
}
