import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
    SingleStakingFarmDataProps,
    SingleStakingFarmDefinition,
    SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { KwentaContractFactory, KwentaLpStaking } from '../contracts';

const FARMS = [
    {
        address: '0x6077987e8e06c062094c33177eb12c4a65f90b65',
        stakedTokenAddress: '0x56dEa47c40877c2aaC2a689aC56aa56cAE4938d2', // Kwenta/WETH Arrakis vault token
        rewardTokenAddresses: ['0x920Cf626a271321C151D027030D5d08aF699456b'], // Kwenta
    },
];

@PositionTemplate()
export class OptimismKwentaLpStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<KwentaLpStaking> {
    groupLabel = 'LP Staking';

    constructor(
        @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
        @Inject(KwentaContractFactory) protected readonly contractFactory: KwentaContractFactory,
    ) {
        super(appToolkit);
    }

    getContract(address: string): KwentaLpStaking {
        return this.contractFactory.kwentaLpStaking({ address, network: this.network });
    }

    async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
        return FARMS;
    }

    getRewardRates({ contract }: GetDataPropsParams<KwentaLpStaking, SingleStakingFarmDataProps>) {
        return contract.rewardRate();
    }

    getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<KwentaLpStaking, SingleStakingFarmDataProps>) {
        return contract.balanceOf(address);
    }

    getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<KwentaLpStaking, SingleStakingFarmDataProps>) {
        return contract.earned(address);
    }
}
