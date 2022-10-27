import { Inject } from '@nestjs/common';
import { BigNumber, utils } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, DefaultAppTokenDataProps } from '~position/template/app-token.template.types';

import { AuraBalancerPoolResolver } from '../common/aura.balancer-pool.resolver';
import { AuraBalToken, AuraContractFactory } from '../contracts';

export type AuraBalTokenDefinition = {
  address: string;
};

@PositionTemplate()
export class EthereumAuraBalTokenFetcher extends AppTokenTemplatePositionFetcher<
  AuraBalToken,
  DefaultAppTokenDataProps,
  AuraBalTokenDefinition
> {
  groupLabel = 'auraBAL';
  AURA_BAL_ADDRESS = '0x616e8bfa43f920657b3497dbf40d6b1a02d4608d';
  STABLE_POOL_ID = '0x3dd0843a028c86e0b760b1a76929d1c5ef93a2dd000200000000000000000249';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) protected readonly contractFactory: AuraContractFactory,
    @Inject(AuraBalancerPoolResolver)
    private readonly balancerPoolResolver: AuraBalancerPoolResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AuraBalToken {
    return this.contractFactory.auraBalToken({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return [this.AURA_BAL_ADDRESS];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x5c6ee304399dbdb9c8ef030ab642b10820db8f56'];
  }

  async getPrice(): Promise<number> {
    const balancerPool = await this.balancerPoolResolver.getBalancerPool(this.STABLE_POOL_ID);

    const { tokens, totalLiquidity, totalShares } = balancerPool;

    const auraBAL = tokens.find(token => token.address === this.AURA_BAL_ADDRESS);
    if (!auraBAL) return 0;

    // Single-sided join: add 100 auraBAL
    const auraBALAmount = utils.parseUnits('100', auraBAL.decimals);
    const maxAmountsIn = tokens.map(token =>
      token.address === this.AURA_BAL_ADDRESS ? auraBALAmount : BigNumber.from(0),
    );

    const { bptOut } = await this.balancerPoolResolver.getBPTOut({ balancerPool, maxAmountsIn });
    const bptPerAuraBALRaw = bptOut.mul(utils.parseEther('1')).div(auraBALAmount);
    const bptPerAuraBAL = Number(bptPerAuraBALRaw) / 10 ** 18;

    const bptPrice = totalLiquidity / totalShares;
    const auraBALPrice = bptPrice / bptPerAuraBAL;
    return auraBALPrice;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<AuraBalToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<AuraBalToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}
