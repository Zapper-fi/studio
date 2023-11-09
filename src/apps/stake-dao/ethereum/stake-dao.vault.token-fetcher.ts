import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { StakeDaoContractFactory, StakeDaoVault } from '../contracts';

@PositionTemplate()
export class EthereumStakeDaoVaultTokenFetcher extends AppTokenTemplatePositionFetcher<StakeDaoVault> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StakeDaoViemContractFactory) protected readonly contractFactory: StakeDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StakeDaoVault {
    return this.contractFactory.stakeDaoVault({ address, network: this.network });
  }

  getAddresses() {
    return [
      '0xd935a972758342c8807cf99870eebca8108b4fbf', // frxETH
      '0xdd007cb6005017e548c761c2d12d9aa03961c30a', // STG/USDC
      '0x5a76a7fd20dde55cecefb0803ac3a1051c954eaa', // TricryptoUSDC
      '0x2d1bd6ba23f587abcb405bce008839c8978c5222', // TricryptoUSDT
      '0x37b24ac19504c0c6fc1adc8deb5d24f5c4f6a2f2', // crvUSD/USDT
      '0xbc61f6973ce564effb16cd79b5bc3916ead592e2', // UZD/FRAXBP
      '0x11d87d278432bb2ca6ce175e4a8b4abdade80fd0', // FRAX/USDC
      '0x04718089aa7574785f0ae88d53c19f4df43a4de8', // cvxCRV/CRV
      '0x1513b44a589ffc76d0727968eb55da4110b39422', // SDT/ETH
      '0x5d0cc286fc6282c50ddfcb997ecca35e77a10650', // sdCRV/CRV
      '0xb618ea40cb1f5b08839ba228c8dd58ac3dca12f3', // crvUSD/USDC
      '0x41bd96ad3cb2a96329a88559e055e56bd559461b', // TricryptoLLama
      '0xa0022debeb2275cf05b9c659493f89efe3ab89a6', // Arrakis agEUR/ETH LP
      '0x199faf9aeb75764d08d761e77a188c97ca0f04ea', // dETH/frxETH
      '0x98dd95d0ac5b70b0f4ae5080a1c2eea8c5c48387', // MIM
      '0xd4ed44aa0ac185ad3024f5433442d9aef4b39ed8', // XAI/FRAX
      '0xc60347f8dab2511326981710c689da9f7fe4e375', // ETH+/ETH
      '0x3ea0ad89b647b14c44906d2abe7ba04470c86736', // crvUSD/DOLA
      '0x035652a14e27de1d7ca36bff0c4dfc3e2f0749b4', // stETH
      '0xcbb7e515154e2d746e0afbe1a4c3c7d1b5f87faa', // WETH/frxETH
      '0xd1861b79f54edb964e28aa3c6a3f4282b0751243', // crvUSD/frxETH+SDT
      '0x0cbd1fb1c170ddcf1fd945f50429f84f94e670f8', // Sushi agEUR/ANGLE LP
      '0xd59b663cc1e758f546658dc4649e8724720872fd', // ALUSDFRAX
      '0x903f3c7b4c3b18df9a06157f9fd5176e6a1fde68', // Tricrypto2
      '0x7ca0a95c96cd34013d619effcb02f200a031210d', // sdBAL/B-80BAL-20WETH
      '0xe67b54bf07f5dfd3c7a992627f6bb8c35b239fb4', // StaFi-rETH/ETH
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<StakeDaoVault>) {
    return [{ address: await contract.token(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
