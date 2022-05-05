import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveController, CurveDoubleGauge, CurveGauge, CurveNGauge } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';
import { CurveFactoryGaugeAddressHelper } from '../helpers/curve.factory-gauge.address-helper';
import { CurveGaugeIsActiveStrategy } from '../helpers/curve.gauge.is-active-strategy';
import { CurveGaugeRoiStrategy } from '../helpers/curve.gauge.roi-strategy';

export const FARMS = {
  single: [
    '0xfa712ee4788c042e2b7bb55e6cb8ec569c4530c1',
    '0x69fb7c45726cfe2badee8317005d3f94be838840',
    '0xb1f2cdec61db658f091671f5f199635aef202cac',
    '0x7ca5b0a2910b33e9759dc7ddb0413949071d7575',
    '0x705350c4bcd35c9441419ddd5d2f097d7a55410f',
    '0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a',
    '0x4c18e409dc8619bfb6a1cb56d114c3f592e0ae79',
    '0xc5cfada84e902ad92dd40194f0883ad49639b023',
    '0x2db0e83599a91b508ac268a6197b8b14f5e72840',
    '0xc2b1df84112619d190193e48148000e3990bf627',
    '0xf98450b5602fa59cc66e1379dffb6fddc724cfc4',
    '0xbc89cd85491d81c6ad2954e6d0362ee29fca8f53',
    '0xdfc7adfa664b08767b735de28f9e84cd30492aee',
    '0x3b7020743bc2a4ca9eaf9d0722d42e20d6935855',
    '0x3c0ffff15ea30c35d7a85b85c0782d6c94e1d238',
    '0xfd4d8a17df4c27c1dd245d153ccf4499e806c87d',
    '0x055be5ddb7a925bfef3417fc157f53ca77ca7222',
    '0xf5194c3325202f456c95c1cf0ca36f8475c1949f', // ib3CRV Gauge
    '0x359fd5d6417ae3d8d6497d9b2e7a890798262ba4', // tusdCrv Gauge
    '0x72e158d38dbd50a483501c24f792bdaaa3e7d55c', // fraxCrv Gauge
    '0xd4b22fedca85e684919955061fdf353b9d38389b', // busdCrv Gauge
  ],
  double: [
    '0xa90996896660decc6e997655e065b23788857849',
    '0x5f626c30ec1215f4edcc9982265e8b1f411d1352',
    '0x6828bcf74279ee32f2723ec536c22c51eed383c6',
    '0xaea6c312f4b3e04d752946d329693f7293bc2e6d',
    '0x4dc4a289a8e33600d8bd4cf5f6313e43a37adec7',
  ],
  nGauge: [
    '0xd7d147c6bb90a718c3de8c0568f9b560c79fa416',
    '0x11137b10c210b579405c21a07489e28f3c040ab1',
    '0xd662908ada2ea1916b3318327a97eb18ad588b5d',
    '0x90bb609649e0451e5ad952683d64bd2d1f245840',
    '0x182b723a58739a9c974cfdb385ceadb237453c28',
    '0x462253b8f74b72304c145db0e4eebd326b22ca39',
    '0x6d10ed2cf043e6fcf51a0e7b4c2af3fa06695707',
    '0x9b8519a9a00100720ccdc8a120fbed319ca47a14', // lusdCrv Gauge
    '0x824f13f1a2f29cfeea81154b46c0fc820677a637', // rethCrv Gauge
    '0x6955a55416a06839309018a8b0cb72c4ddc11f15', // Trycrypto Gauge
    '0xdefd8fdd20e0f34115c7018ccfb655796f6b2168', // Trycrypto2 Gauge
    '0xd8b712d29381748db89c36bca0138d7c75866ddf', // mimCrv Gauge
    '0xe8060ad8971450e624d5289a10017dd30f5da85f', // eurtCrv Gauge
    '0x1cebdb0856dd985fae9b8fea2262469360b8a3a6', // crvethCrv Gauge
    '0x7e1444ba99dcdffe8fbdb42c02f0005d14f13be1', // crvCRVETH Gauge
    '0x4fd86ce7ecea88f7e0aa78dc12625996fb3a04bc', // crvEURTUSD Gauge
    '0x65ca7dc5cb661fc58de57b1e1af404649a27ad35', // crvEURSUSD Gauge
  ],
  nGaugeV2: [
    '0x9582c4adacb3bce56fea3e590f05c3ca2fb9c477', // alusdCrv Gauge
  ],
};

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumCurveFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurveGaugeRoiStrategy)
    private readonly curveGaugeRoiStrategy: CurveGaugeRoiStrategy,
    @Inject(CurveGaugeIsActiveStrategy)
    private readonly curveGaugeIsActiveStrategy: CurveGaugeIsActiveStrategy,
    @Inject(CurveFactoryGaugeAddressHelper)
    private readonly curveFactoryGaugeAddressHelper: CurveFactoryGaugeAddressHelper,
  ) {}

  private async getSingleGaugeFarms() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveGauge>({
      network,
      appId,
      groupId,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveFarmAddresses: () => FARMS.single,
      resolveImplementation: () => 'single-gauge',
      resolveFarmContract: ({ address, network }) => this.curveContractFactory.curveGauge({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveRewardTokenAddresses: async () => ['0xd533a949740bb3306d119cc777fa900ba034cd52'],
      resolveIsActive: this.curveGaugeIsActiveStrategy.build({
        resolveInflationRate: ({ contract, multicall }) => multicall.wrap(contract).inflation_rate(),
      }),
      resolveRois: this.curveGaugeRoiStrategy.build<CurveGauge, CurveController>({
        resolveControllerContract: ({ network }) =>
          this.curveContractFactory.curveController({
            address: '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb',
            network,
          }),
        resolveInflationRate: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).inflation_rate(),
        resolveWorkingSupply: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).working_supply(),
        resolveRelativeWeight: ({ controllerContract, multicall, address }) =>
          multicall.wrap(controllerContract)['gauge_relative_weight(address)'](address),
      }),
    });
  }

  private async getDoubleGaugeFarms() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveDoubleGauge>({
      network,
      appId,
      groupId,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveFarmAddresses: () => FARMS.double,
      resolveImplementation: () => 'double-gauge',
      resolveFarmContract: ({ address, network }) => this.curveContractFactory.curveDoubleGauge({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveTotalValueLocked: ({ contract, multicall }) => multicall.wrap(contract).totalSupply(),
      resolveRewardTokenAddresses: async ({ contract, multicall }) => {
        const CRV_TOKEN_ADDRESS = '0xd533a949740bb3306d119cc777fa900ba034cd52';
        const bonusRewardTokenAddress = await multicall.wrap(contract).rewarded_token();
        return [CRV_TOKEN_ADDRESS, bonusRewardTokenAddress].filter(v => v !== ZERO_ADDRESS);
      },
      resolveIsActive: this.curveGaugeIsActiveStrategy.build({
        resolveInflationRate: ({ contract, multicall }) => multicall.wrap(contract).inflation_rate(),
      }),
      resolveRois: this.curveGaugeRoiStrategy.build<CurveDoubleGauge, CurveController>({
        resolveControllerContract: ({ network }) =>
          this.curveContractFactory.curveController({
            address: '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb',
            network,
          }),
        resolveInflationRate: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).inflation_rate(),
        resolveWorkingSupply: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).working_supply(),
        resolveRelativeWeight: ({ controllerContract, multicall, address }) =>
          multicall.wrap(controllerContract)['gauge_relative_weight(address)'](address),
      }),
    });
  }

  private async getNGaugeFarms() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveNGauge>({
      network,
      appId,
      groupId,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveFarmAddresses: async () => {
        const factoryGaugeAddresses = await this.curveFactoryGaugeAddressHelper.getGaugeAddresses({
          factoryAddress: '0xb9fc157394af804a3578134a6585c0dc9cc990d4',
          network,
        });

        return [...FARMS.nGauge, ...factoryGaugeAddresses];
      },
      resolveImplementation: () => 'n-gauge',
      resolveTotalValueLocked: ({ contract, multicall }) => multicall.wrap(contract).totalSupply(),
      resolveFarmContract: ({ address, network }) => this.curveContractFactory.curveNGauge({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveRewardTokenAddresses: async ({ contract, multicall }) => {
        const CRV_TOKEN_ADDRESS = '0xd533a949740bb3306d119cc777fa900ba034cd52';
        const bonusRewardTokenAddress = await multicall.wrap(contract).reward_tokens(0);
        return [CRV_TOKEN_ADDRESS, bonusRewardTokenAddress].filter(v => v !== ZERO_ADDRESS);
      },
      resolveIsActive: this.curveGaugeIsActiveStrategy.build({
        resolveInflationRate: ({ contract, multicall }) => multicall.wrap(contract).inflation_rate(),
      }),
      resolveRois: this.curveGaugeRoiStrategy.build<CurveNGauge, CurveController>({
        resolveControllerContract: ({ network }) =>
          this.curveContractFactory.curveController({
            address: '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb',
            network,
          }),
        resolveInflationRate: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).inflation_rate(),
        resolveWorkingSupply: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).working_supply(),
        resolveRelativeWeight: ({ controllerContract, multicall, address }) =>
          multicall.wrap(controllerContract)['gauge_relative_weight(address)'](address),
      }),
    });
  }

  private async getNGaugeV2Farms() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveNGauge>({
      network,
      appId,
      groupId,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveFarmAddresses: async () => FARMS.nGaugeV2,
      resolveImplementation: () => 'n-gauge-v2',
      resolveTotalValueLocked: ({ contract, multicall }) => multicall.wrap(contract).totalSupply(),
      resolveFarmContract: ({ address, network }) => this.curveContractFactory.curveNGauge({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveRewardTokenAddresses: async ({ contract, multicall }) => {
        const CRV_TOKEN_ADDRESS = '0xd533a949740bb3306d119cc777fa900ba034cd52';
        const bonusRewardTokenAddress = await multicall.wrap(contract).reward_tokens(0);
        return [CRV_TOKEN_ADDRESS, bonusRewardTokenAddress].filter(v => v !== ZERO_ADDRESS);
      },
      resolveIsActive: this.curveGaugeIsActiveStrategy.build({
        resolveInflationRate: ({ contract, multicall }) => multicall.wrap(contract).inflation_rate(),
      }),
      resolveRois: this.curveGaugeRoiStrategy.build<CurveNGauge, CurveController>({
        resolveControllerContract: ({ network }) =>
          this.curveContractFactory.curveController({
            address: '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb',
            network,
          }),
        resolveInflationRate: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).inflation_rate(),
        resolveWorkingSupply: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).working_supply(),
        resolveRelativeWeight: ({ controllerContract, multicall, address }) =>
          multicall.wrap(controllerContract)['gauge_relative_weight(address)'](address),
      }),
    });
  }

  async getPositions() {
    return Promise.all([
      this.getSingleGaugeFarms(),
      this.getDoubleGaugeFarms(),
      this.getNGaugeFarms(),
      this.getNGaugeV2Farms(),
    ]).then(v => v.flat());
  }
}
