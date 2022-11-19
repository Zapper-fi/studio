import { Inject } from '@nestjs/common';
import { ContractPositionBalanceHelper } from '~app-toolkit';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
    SingleStakingFarmDataProps,
    SingleStakingFarmDefinition,
    SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { KwentaContractFactory, KwentaStaking } from '../contracts';

const FARMS = [
    {
        address: '0x6e56A5D49F775BA08041e28030bc7826b13489e0',
        stakedTokenAddress: '0x920Cf626a271321C151D027030D5d08aF699456b', // Kwenta
        rewardTokenAddresses: ['0x920Cf626a271321C151D027030D5d08aF699456b'], // Kwenta
    },
];

@PositionTemplate()
export class OptimismKwentaStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<KwentaStaking> {
    groupLabel = 'Staking';

    constructor(
        @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
        @Inject(KwentaContractFactory) protected readonly contractFactory: KwentaContractFactory,
    ) {
        super(appToolkit);
    }

    getContract(address: string): KwentaStaking {
        return this.contractFactory.kwentaStaking({ address, network: this.network });
    }

    async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
        return FARMS;
    }

    getRewardRates({ contract }: GetDataPropsParams<KwentaStaking, SingleStakingFarmDataProps>) {
        return contract.rewardRate();
    }

    getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<KwentaStaking, SingleStakingFarmDataProps>) {
        return contract.balanceOf(address);
    }

    getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<KwentaStaking, SingleStakingFarmDataProps>) {
        return contract.earned(address);
    }
}
