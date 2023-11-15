import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  MorphoContractPositionDataProps,
  MorphoContractPositionDefinition,
  MorphoSupplyContractPositionFetcher,
} from '~apps/morpho/common/morpho.supply.contract-position-fetcher';
import { MorphoViemContractFactory } from '~apps/morpho/contracts';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import {
  GetDataPropsParams,
  GetDefinitionsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { MorphoAaveV2 } from '../contracts/viem';

@PositionTemplate()
export class EthereumMorphoAaveV2SupplyContractPositionFetcher extends MorphoSupplyContractPositionFetcher<MorphoAaveV2> {
  groupLabel = 'Morpho Aave';

  morphoAddress = '0x777777c9898d384f785ee44acfe945efdff5f3e0';
  lensAddress = '0x507fa343d0a90786d86c7cd885f5c49263a91ff4';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MorphoViemContractFactory) protected readonly contractFactory: MorphoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.morphoAaveV2({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const morphoAaveV2 = this.contractFactory.morphoAaveV2({ address: this.morphoAddress, network: this.network });

    const morpho = multicall.wrap(morphoAaveV2);
    const markets = await morpho.read.getMarketsCreated();

    return Promise.all(
      markets.map(async marketAddress => {
        const market = this.contractFactory.morphoAToken({ address: marketAddress, network: this.network });
        const marketContract = multicall.wrap(market);
        const supplyTokenAddress = await marketContract.read.UNDERLYING_ASSET_ADDRESS().catch(err => {
          if (isViemMulticallUnderlyingError(err)) return ZERO_ADDRESS;
          throw err;
        });
        return {
          address: this.morphoAddress,
          marketAddress: marketAddress.toLowerCase(),
          supplyTokenAddress: supplyTokenAddress.toLowerCase(),
        };
      }),
    );
  }

  async getDataProps({
    contractPosition,
    multicall,
    definition,
  }: GetDataPropsParams<MorphoAaveV2, MorphoContractPositionDataProps, MorphoContractPositionDefinition>) {
    const lens = this.contractFactory.morphoAaveV2Lens({ address: this.lensAddress, network: this.network });
    const lensContract = multicall.wrap(lens);
    const marketAddress = definition.marketAddress;

    const [supplyRateRaw, borrowRateRaw, totalMarketSupplyRaw, totalMarketBorrowRaw, marketConfiguration] =
      await Promise.all([
        lensContract.read.getAverageSupplyRatePerYear([marketAddress]),
        lensContract.read.getAverageBorrowRatePerYear([marketAddress]),
        lensContract.read.getTotalMarketSupply([marketAddress]),
        lensContract.read.getTotalMarketBorrow([marketAddress]),
        lensContract.read.getMarketConfiguration([marketAddress]),
      ]);

    const secondsPerYear = 3600 * 24 * 365;
    const supplyRate = BigNumber.from(supplyRateRaw[0]);
    const borrowRate = BigNumber.from(borrowRateRaw[0]);
    const supplyApy = Math.pow(1 + +formatUnits(supplyRate.div(secondsPerYear), 27), secondsPerYear) - 1;
    const borrowApy = Math.pow(1 + +formatUnits(borrowRate.div(secondsPerYear), 27), secondsPerYear) - 1;
    const p2pDisabled = marketConfiguration[2];

    const underlyingToken = contractPosition.tokens[0];
    const supplyRaw = BigNumber.from(totalMarketSupplyRaw[0]).add(totalMarketSupplyRaw[1]);
    const supply = +formatUnits(supplyRaw, underlyingToken.decimals);
    const supplyUSD = supply * underlyingToken.price;
    const borrowRaw = BigNumber.from(totalMarketBorrowRaw[0]).add(totalMarketBorrowRaw[1]);
    const matchedUSD = +formatUnits(borrowRaw, underlyingToken.decimals) * underlyingToken.price;
    const borrow = +formatUnits(borrowRaw, underlyingToken.decimals);
    const borrowUSD = borrow * underlyingToken.price;
    const liquidity = supply * underlyingToken.price;

    return {
      marketAddress,
      supplyApy,
      borrowApy,
      liquidity,
      p2pDisabled,
      supply,
      supplyUSD,
      borrow,
      borrowUSD,
      matchedUSD,
    };
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<MorphoAaveV2, MorphoContractPositionDataProps>): Promise<BigNumberish[]> {
    const lens = multicall.wrap(
      this.contractFactory.morphoAaveV2Lens({ address: this.lensAddress, network: this.network }),
    );

    const [[, , supplyRaw], [, , borrowRaw]] = await Promise.all([
      lens.read.getCurrentSupplyBalanceInOf([contractPosition.dataProps.marketAddress, address]),
      lens.read.getCurrentBorrowBalanceInOf([contractPosition.dataProps.marketAddress, address]),
    ]);

    return [supplyRaw, borrowRaw];
  }
}
