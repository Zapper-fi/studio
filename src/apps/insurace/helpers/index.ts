import _ from 'lodash';

import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import configs from '../config';
import { InsuraceContractFactory } from '../contracts';
import { INSURACE_DEFINITION } from '../insurace.definition';

export type InsuraceMiningDataProps = {
  apy: number;
  liquidity: number;
};

const appId = INSURACE_DEFINITION.id;
const groupId = INSURACE_DEFINITION.groups.mining.id;

const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export async function getMiningPositions(
  network: Network,
  appToolkit: IAppToolkit,
  contractFactory: InsuraceContractFactory,
): Promise<AppTokenPosition<InsuraceMiningDataProps>[]> {
  const config = configs[network];

  if (config == null) {
    return [];
  }

  const pools = config.governanceMiningPools.concat(config.underwritingMiningPools).concat(config.liquidityMiningPools);

  const multicall = appToolkit.getMulticall(network);

  const baseTokenDependencies = await appToolkit.getBaseTokenPrices(network);
  const appTokenDependencies = await appToolkit.getAppTokenPositions({
    appId: 'uniswap-v2',
    groupIds: ['pool'],
    network,
  });

  const allTokenDependencies = [...baseTokenDependencies, ...appTokenDependencies];

  const insur = allTokenDependencies.find(item => item.address === config.insur);

  if (insur == null) {
    return [];
  }

  const contractPool = contractFactory.stakersPoolV2({
    address: config.contract.StakersPoolV2,
    network,
  });

  const tokens = await Promise.all(
    pools.map(async pool => {
      const { underlyingAddress, lpAddress } = pool;

      const underlyingToken =
        underlyingAddress === NATIVE_TOKEN_ADDRESS
          ? allTokenDependencies.find(item => item.address === ZERO_ADDRESS)
          : allTokenDependencies.find(item => item.address === underlyingAddress);

      if (underlyingToken == null) {
        return null;
      }

      const contractLp = contractFactory.erc20({
        address: lpAddress,
        network,
      });

      const [symbol, decimals, supplyRaw, underlyingAmount, totalInsurPerBlock, totalPoolWeight, poolWeight] =
        await Promise.all([
          multicall.wrap(contractLp).symbol(),
          multicall.wrap(contractLp).decimals(),
          multicall.wrap(contractLp).totalSupply(),
          multicall.wrap(contractPool).stakedAmountPT(pool.underlyingAddress),
          multicall.wrap(contractPool).rewardPerBlock(),
          multicall.wrap(contractPool).totalPoolWeight(),
          multicall.wrap(contractPool).poolWeightPT(pool.lpAddress),
        ]);

      const supply = Number(supplyRaw) / 10 ** decimals;
      const underlyingSupply = Number(underlyingAmount) / 10 ** underlyingToken.decimals;

      const pricePerShare = underlyingSupply / supply;
      const price = pricePerShare * underlyingToken.price;

      const insurPerBlock = totalPoolWeight.lte(0)
        ? 0
        : Number(totalInsurPerBlock.mul(poolWeight).div(totalPoolWeight)) / 10 ** insur.decimals;

      const blocksPerYear = (365 * 24 * 60 * 60) / config.blockTime;
      const liquidity = underlyingSupply * underlyingToken.price;
      const apy = liquidity <= 0 ? 0 : (insurPerBlock * blocksPerYear * insur.price) / liquidity;

      const token: AppTokenPosition<InsuraceMiningDataProps> = {
        type: ContractType.APP_TOKEN,
        appId,
        groupId,
        address: lpAddress,
        network,
        symbol,
        decimals,
        supply,
        tokens: [underlyingToken],
        price,
        pricePerShare,
        dataProps: {
          apy,
          liquidity,
        },
        displayProps: {
          label: `${underlyingToken.symbol} Pool`,
          images: getImagesFromToken(underlyingToken),
        },
      };

      return token;
    }),
  );

  return _.compact(tokens);
}
