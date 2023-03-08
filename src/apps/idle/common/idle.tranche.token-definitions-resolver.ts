import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { IdleContractFactory } from '../contracts';

@Injectable()
export class IdleTranchesDefinitionsResolver {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IdleContractFactory) protected readonly contractFactory: IdleContractFactory,
  ) {}

  @Cache({
    key: network => `studio:idle:${network}:tranches-definitions`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getTranchesDefinitionsData(network: Network) {
    const multicall = this.appToolkit.getMulticall(network);

    const perpYieldTranchesAddresses = [
      '0x34dcd573c5de4672c8248cd12a99f875ca112ad8', // stETH
      '0xf87ec7e1ee467d7d78862089b92dd40497cba5b8', // stMATIC
      '0x4ccaf1392a17203edab55a1f2af3079a8ac513e7', // FRAX-3crv
      '0x7ecfc031758190eb1cb303d8238d553b1d4bc8ef', // ste-3Crv
      '0x008c589c471fd0a13ac2b9338b69f5f7a1a843e1', // alUSD-3crv
      '0x858f5a3a5c767f8965cf7b77c51fd178c4a92f05', // 3EUR
      '0xf324dca1dc621fcf118690a9c6bae40fbd8f09b7', // pBTC-crv
      '0xf5a3d259bfe7288284bd41823ec5c8327a314054', // eUSDC
      '0x46c1f702a6aad1fd810216a5ff15aab1c62ca826', // eDAI
      '0xd5469df8ca36e7eaedb35d428f28e13380ec8ede', // eUSDT
      '0x2398bc075fa62ee88d7fab6a18cd30bff869bda4', // eagEUR
      '0xf615a552c000b114ddaa09636bbf4205de49333c', // eUSDC staking
      '0x860b1d25903dbdffec579d30012da268aeb0d621', // eUSDT staking
      '0xec964d06cd71a68531fc9d083a142c48441f391c', // eWETH staking
      '0xdbcee5ae2e9daf0f5d93473e08780c9f45dfeb93', // USDC (wintermute)
      '0xdce26b2c78609b983cf91cccd43e238353653b0e', // DAI (folkvang)
    ];

    return Promise.all(
      perpYieldTranchesAddresses.map(async address => {
        const perpYieldTranchesContract = this.contractFactory.idlePerpYieldTranches({
          address,
          network,
        });
        const [juniorAddressRaw, seniorAddressRaw, underlyingTokenAddressRaw] = await Promise.all([
          multicall.wrap(perpYieldTranchesContract).BBTranche(),
          multicall.wrap(perpYieldTranchesContract).AATranche(),
          multicall.wrap(perpYieldTranchesContract).token(),
        ]);

        return {
          perpYieldTrancheAddress: address,
          juniorAddress: juniorAddressRaw.toLowerCase(),
          seniorAddress: seniorAddressRaw.toLowerCase(),
          underlyingTokenAddress: underlyingTokenAddressRaw.toLowerCase(),
        };
      }),
    );
  }

  async getJuniorTrancheAddresses(network: Network) {
    const trancheDefinitions = await this.getTranchesDefinitionsData(network);

    return trancheDefinitions.map(tranche => {
      return {
        address: tranche.juniorAddress,
        underlyingTokenAddress: tranche.underlyingTokenAddress,
        cdoAddress: tranche.perpYieldTrancheAddress,
      };
    });
  }

  async getSeniorTrancheAddresses(network: Network) {
    const trancheDefinitions = await this.getTranchesDefinitionsData(network);

    return trancheDefinitions.map(tranche => {
      return {
        address: tranche.seniorAddress,
        underlyingTokenAddress: tranche.underlyingTokenAddress,
        cdoAddress: tranche.perpYieldTrancheAddress,
      };
    });
  }
}
