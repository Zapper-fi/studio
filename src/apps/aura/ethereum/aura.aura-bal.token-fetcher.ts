import { Inject } from '@nestjs/common';
import { BigNumber, utils } from 'ethers';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AURA_DEFINITION } from '../aura.definition';
import { BalancerPool } from '../aura.types';
import { AuraBalancerPoolsHelper } from '../helpers/aura.balancer-pools-helper';

const appId = AURA_DEFINITION.id;
const groupId = AURA_DEFINITION.groups.auraBal.id;
const network = Network.ETHEREUM_MAINNET;

const AURA_BAL_ADDRESS = '0x616e8bfa43f920657b3497dbf40d6b1a02d4608d';
const STABLE_POOL_ID = '0x3dd0843a028c86e0b760b1a76929d1c5ef93a2dd000200000000000000000249';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAuraBalTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuraBalancerPoolsHelper) private readonly auraBalancerPoolsHelper: AuraBalancerPoolsHelper,
  ) {}

  async getPositions() {
    const balancerPool = await this.auraBalancerPoolsHelper.getBalancerPool(STABLE_POOL_ID);
    if (!balancerPool) return [];

    const auraBAL = await this.getAuraBAL(balancerPool);
    return compact([auraBAL]);
  }

  private async getAuraBALPrice(balancerPool: BalancerPool) {
    const { tokens, totalLiquidity, totalShares } = balancerPool;

    const auraBAL = tokens.find(token => token.address === AURA_BAL_ADDRESS);
    if (!auraBAL) return null;

    // Single-sided join: add 100 auraBAL
    const auraBALAmount = utils.parseUnits('100', auraBAL.decimals);
    const maxAmountsIn = tokens.map(token => (token.address === AURA_BAL_ADDRESS ? auraBALAmount : BigNumber.from(0)));

    const { bptOut } = await this.auraBalancerPoolsHelper.getBPTOut({ balancerPool, maxAmountsIn });
    const bptPerAuraBALRaw = bptOut.mul(utils.parseEther('1')).div(auraBALAmount);
    const bptPerAuraBAL = Number(bptPerAuraBALRaw) / 10 ** 18;

    const bptPrice = totalLiquidity / totalShares;
    const auraBALPrice = bptPrice / bptPerAuraBAL;
    return auraBALPrice;
  }

  private async getAuraBAL(balancerPool: BalancerPool) {
    const tokenData = balancerPool.tokens.find(token => token.address === AURA_BAL_ADDRESS);
    if (!tokenData) return null;

    const { address, symbol, decimals } = tokenData;
    const contract = this.appToolkit.globalContracts.erc20({ address, network });
    const totalSupplyRaw = await contract.totalSupply();

    const supply = Number(totalSupplyRaw) / 10 ** decimals;
    const price = await this.getAuraBALPrice(balancerPool);
    if (!price) return null;

    const liquidity = price * supply;

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address,
      tokens: [],
      price,
      pricePerShare: 1,
      symbol,
      decimals,
      supply,
      network,
      dataProps: {},
      displayProps: {
        label: symbol,
        images: [getTokenImg(address)],
        statsItems: [
          {
            label: 'Liquidity',
            value: buildDollarDisplayItem(liquidity),
          },
        ],
      },
    };

    return token;
  }
}
