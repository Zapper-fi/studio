import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isClaimable } from '~position/position.utils';
import {
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { StakeDaoViemContractFactory } from '../contracts';
import { StakeDaoGauge } from '../contracts/viem';

const LOCKER_GAUGE_ADDRESSES = [
  '0x7f50786a0b15723d741727882ee99a0bf34e3466', // sdCRV
  '0x50dc9ae51f78c593d4138263da7088a973b8184e', // sdPENDLE
  '0x3e8c72655e48591d93e6dfda16823db0ff23d859', // sdBAL
  '0xf3c6e8fbb946260e8c2a55d48a5e01c82fd63106', // sdFRAX
  '0xe58101d3848e12dad6d7b5981dc11411bb267d2f', // sdFPIS
  '0x5adf559f5d24aacbe4fa3a3a4f44fdc7431e6b52', // sdYFI
  '0xe55843a90672f7d8218285e51ee8ff8e233f35d5', // sdANGLE
  '0x9c9d06c7378909c6d0a2a0017bb409f7fb8004e0', // sdAPW
  '0xa291faeef794df6216f196a63f514b5b22244865', // sdBPT
  '0xbcfe5c47129253c6b8a9a00565b3358b488d42e0', // sdFXN
  '0x5b75c60d45bfb053f91b5a9eae22519dfaa37bb6', // sdMAV
];

const LIQUID_LOCKER_BOOST_GAUGE_ADDRESSES = [
  '0x131dc928f9dad07f43ceff269e1674b7ebbfcbb1', // frxETH
  '0xa89b9c336764c9ae5f64bc19688601341974bc22', // STG/USDC
  '0x1250c0bb1e9d5831b052826b3eedb05cf91cca69', // Passive sEUR
  '0x991c79db98da75ead9f47286b64f63b878c52354', // Passive stETH
  '0x44b4e01c249e35b2803f947c5ccb9868c3421437', // TriCrypto USDC
  '0xdd571e39aa0df0bf142f6b81cba5923ddacf06a7', // TriCrypto USDT
  '0x4875d5e7987c93431e6db9dc53a136f46270f0dc', // crvUSD/USDT
  '0x3d27863670089841bbfd98b5440582b5958ecd55', // Passive sETH
  '0x62c6f1f58c0cc5915c9d414a470f06e137c3dbdb', // UZD/FRAXBP
  '0xbe77585f4159e674767acf91284160e8c09b96d8', // FRAX/USDC
  '0xc0a63f4f3033a1f09804624f9666fd214925fd06', // cvxCRV/CRV
  '0xa9812ed1077938e88577be7a8eaf097b5337ff5b', // sdCRV/CRV
  '0x1f1a798cbdf4e9d533ceb9386e0a19b8c3f99121', // crvUSD/USDC
  '0x608e4105e49ce2562521e31936815e2e20da6609', // Tricrypto Llama
  '0x5dfdf492e52112d670be9df5bdc6b500e35479ac', // Arrakis agEUR/ETH LP
  '0x63f222079608eec2ddc7a9acdcd9344a21428ce7', // agEUR/EUROC
  '0xc891a1bacf802127874054e703b386346fe94b00', // SDT/ETH
  '0x799b35467c53f388d0c41d5f4efff8bad7b33e96', // dETH/frxETH
  '0x28766020a5a8d3325863bf533459130ddb0c3657', // MIM
  '0x4b95f9f85857341cc2876c15c88091a04ee5cb31', // XAI/FRAX BP
  '0xe94aff2bd6a12dd16c21648cae71d2b47e405a9c', // ETH+/ETH
  '0xf95e265f70874a0261f8f4a59822451c86f65b68', // crvUSD/DOLA
  '0x9b85d6e87350c021616ae3da78b9b1335c68283a', // 3EUR
  '0x087143ddec7e00028aa0e446f486eab8071b1f53', // stETH
  '0xaefae2adaf173f58c3cdc57f324ce967991d76b0', // WETH/frxETH
  '0x46fbc1bb799c1d71548f69ad0603dccdb52d8341', // crvUSD+frxETH+SDT
  '0x6492891c4b0d69d057bb3707c54a62cf0878e05e', // sushi agEUR/Angle LP
  '0x1b31c86024145583ff37024a6b9aa8581a5070de', // ALUSDFRAXBP
  '0x4d69ad5f243571aa9628bd88ebffa2c913427b0b', // Tricrypto2
  '0x76fb1951f3395031b3ec703a16567ab92e792770', // sdBAL/b-80BAL-20WETH
  '0xcc640eaf32bd2ac28a6dd546eb2d713c3bcaf321', // Passive 3CRV
  '0x0bdabcdc2d2d41789a8f225f66adbdc0cbdf6641', // StaFi-rETH/ETH
  '0xc6a0b204e28c05838b8b1c36f61963f16ecd64c4', // baoUSD/LUSD
  '0x531167abe95375ec212f2b5417ef05a9953410c1', // sdCRV/CRV
  '0x081312d469377507c05b9ae89340eb6fce8242e9', // crvUSD/XAI
  '0x83eb53801ddac98ecaaa6ee5ed859f08b1f4d905', // COIL/FRAXBP
  '0xac9978db68e11ebb9ffdb65f31053a69522b6320', // sanUSDC
];

@PositionTemplate()
export class EthereumStakeDaoGaugeContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<StakeDaoGauge> {
  groupLabel = 'Gauges';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StakeDaoViemContractFactory) protected readonly contractFactory: StakeDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.stakeDaoGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    return [...LOCKER_GAUGE_ADDRESSES, ...LIQUID_LOCKER_BOOST_GAUGE_ADDRESSES];
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<StakeDaoGauge>) {
    return contract.read.staking_token();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<StakeDaoGauge>) {
    const rewardTokenAddresses = await Promise.all(
      range(0, 4).map(async i => contract.read.reward_tokens([BigInt(i)])),
    );
    return rewardTokenAddresses.map(v => v.toLowerCase()).filter(v => v !== ZERO_ADDRESS);
  }

  async getRewardRates({ contract, contractPosition }: GetDataPropsParams<StakeDaoGauge, SingleStakingFarmDataProps>) {
    const claimableTokens = contractPosition.tokens.filter(isClaimable);
    const rewardData = await Promise.all(claimableTokens.map(ct => contract.read.reward_data([ct.address])));
    return rewardData.map(v => v[3]);
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<StakeDaoGauge, SingleStakingFarmDataProps>): Promise<BigNumberish> {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<StakeDaoGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(v => contract.read.claimable_reward([address, v.address])));
  }
}
