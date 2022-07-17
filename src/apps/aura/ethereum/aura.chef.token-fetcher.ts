import { Inject } from '@nestjs/common';
import { BigNumber, utils } from 'ethers';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { BALANCER_V2_DEFINITION } from '~apps/balancer-v2';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AURA_DEFINITION } from '../aura.definition';
import { BalancerPool } from '../aura.types';
import { AuraContractFactory } from '../contracts';
import { AuraBalancerPoolsHelper } from '../helpers/aura.balancer-pools-helper';

type GetAuraBALStableParams = { auraBAL: AppTokenPosition | null; balancerPool: BalancerPool };

const appId = AURA_DEFINITION.id;
const groupId = AURA_DEFINITION.groups.chef.id;
const network = Network.ETHEREUM_MAINNET;

const AURA_BAL_ADDRESS = '0x616e8bfa43f920657b3497dbf40d6b1a02d4608d';
const B_80BAL_20WETH_ADDRESS = '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56';
const STABLE_POOL_ID = '0x3dd0843a028c86e0b760b1a76929d1c5ef93a2dd000200000000000000000249';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAuraChefTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) private readonly auraContractFactory: AuraContractFactory,
    @Inject(AuraBalancerPoolsHelper) private readonly auraBalancerPoolsHelper: AuraBalancerPoolsHelper,
  ) {}

  async getPositions() {
    const balancerPool = await this.auraBalancerPoolsHelper.getBalancerPool(STABLE_POOL_ID);
    if (!balancerPool) {
      return [];
    }

    const auraBAL = await this.getAuraBAL(balancerPool);

    const auraBALStable = await this.getAuraBALStable({ auraBAL, balancerPool });

    return compact([auraBAL, auraBALStable]);
  }

  private async getAuraBALPrice(balancerPool: BalancerPool) {
    const { tokens, totalLiquidity, totalShares } = balancerPool;

    const auraBAL = tokens.find(token => token.address === AURA_BAL_ADDRESS);
    if (!auraBAL) {
      return null;
    }

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
    if (!tokenData) {
      return null;
    }

    const { address, symbol, decimals } = tokenData;

    const contract = this.appToolkit.globalContracts.erc20({ address, network });
    const totalSupplyRaw = await contract.totalSupply();

    const supply = Number(totalSupplyRaw) / 10 ** decimals;

    const price = await this.getAuraBALPrice(balancerPool);
    if (!price) {
      return null;
    }

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

  async getAuraBALStable({ auraBAL, balancerPool }: GetAuraBALStableParams) {
    if (!auraBAL) {
      return null;
    }

    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: BALANCER_V2_DEFINITION.id,
      network,
      groupIds: [BALANCER_V2_DEFINITION.groups.pool.id],
    });

    const b80BAL20WETH = appTokens.find(token => token.address.toLowerCase() === B_80BAL_20WETH_ADDRESS);
    if (!b80BAL20WETH) {
      return null;
    }

    const { symbol, address, totalLiquidity, totalShares } = balancerPool;

    const tokens = [auraBAL, b80BAL20WETH];

    const price = totalLiquidity / totalShares;

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address,
      network,
      appId,
      groupId,
      symbol,
      decimals: 18,
      supply: totalShares,
      price,
      pricePerShare: 1,
      tokens,
      dataProps: {
        liquidity: totalLiquidity,
      },
      displayProps: {
        label: symbol,
        images: tokens.map(v => getTokenImg(v.address, network)),
        statsItems: [
          {
            label: 'Liquidity',
            value: buildDollarDisplayItem(totalLiquidity),
          },
        ],
      },
    };

    return token;
  }
}
