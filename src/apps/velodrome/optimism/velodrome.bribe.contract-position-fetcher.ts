import axios from 'axios';
import { Inject, NotImplementedException } from '@nestjs/common';
import { MetaType } from '~position/position.interface';
import _, { range, sumBy } from 'lodash';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { ContractPositionBalance } from '~position/position-balance.interface';
import {
    GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';

import { VelodromeContractFactory, VelodromeBribe } from '../contracts';
import { DefaultDataProps } from '~position/display.interface';

export type VelodromeBribeDefinition = {
    address: string;
    name: string;
};

interface VelodromeApiPairData {
    gauge: GaugeData;
    symbol: string;
    address: string;
}

interface GaugeData {
    wrapped_bribe_address: string;
}

@PositionTemplate()
export class OptimismVelodromeBribeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<VelodromeBribe> {
    constructor(
        @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
        @Inject(VelodromeContractFactory) protected readonly contractFactory: VelodromeContractFactory,
    ) {
        super(appToolkit);
    }
    veTokenAddress = '0x9c7305eb78a432ced5c4d14cac27e8ed569a2e26';
    veVoteAddress = '0x09236cff45047dbee6b921e00704bed6d6b8cf7e';
    groupLabel = 'Bribe';

    getContract(address: string): VelodromeBribe {
        return this.contractFactory.velodromeBribe({ address, network: this.network });
    }

    async getDefinitions(): Promise<VelodromeBribeDefinition[]> {
        const { data } = await axios.get<{ data: VelodromeApiPairData[] }>('https://api.velodrome.finance/api/v1/pairs');
        var definitions = new Array;
        data.data.filter(v => !!v).filter(v => !!v.gauge).forEach(pool => {
            const wBribeAddress = pool.gauge.wrapped_bribe_address;
            if (wBribeAddress != null) {
                definitions.push({ address: wBribeAddress, name: pool.symbol });
            }
        }
        );
        return definitions;
    }

    async getTokenDefinitions({ contract }) {
        const numRewards = Number(await contract.rewardsListLength());
        const bribeTokens = await Promise.all(range(numRewards).map(async n => await contract.rewards(n)));
        const baseTokens = await this.appToolkit.getBaseTokenPrices(this.network);
        var tokenDefinitions = new Array();
        for (let token of bribeTokens) {
            const tokenFound = baseTokens.find(p => p.address === token);
            if (tokenFound) {
                tokenDefinitions.push({
                    metaType: MetaType.CLAIMABLE,
                    address: token,
                    network: this.network,
                });
            }
        }
        return tokenDefinitions;
    }

    async getLabel({ definition }: GetDisplayPropsParams<VelodromeBribe, DefaultDataProps, VelodromeBribeDefinition>): Promise<string> {
        return `${definition.name} Bribe`;
    }

    getTokenBalancesPerPosition(): never {
        throw new NotImplementedException();
    }

    async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
        const multicall = this.appToolkit.getMulticall(this.network);
        const escrow = multicall.wrap(this.contractFactory.velodromeVe({ address: this.veTokenAddress, network: this.network }));
        const veCount = Number(await escrow.balanceOf(address));
        if (veCount === 0) {
            return [];
        };

        const veTokenIds = await Promise.all(range(veCount).map(async i => {
            const tokenId = await escrow.tokenOfOwnerByIndex(address, i);
            return tokenId;
        }))

        const contractPositions = await this.appToolkit.getAppContractPositions({
            appId: this.appId,
            network: this.network,
            groupIds: [this.groupId],
        });

        const balances = await Promise.all(contractPositions.map(async contractPosition => {
            const bribeTokens = contractPosition.tokens;
            const bribeContract = multicall.wrap(this.getContract(contractPosition.address));

            var tokenBalances = new Array;
            for (let bribeToken of bribeTokens) {
                var tokenBalance = 0;
                for (let veTokenId of veTokenIds) {
                    const balance = await multicall.wrap(bribeContract).earned(bribeToken.address, veTokenId);
                    tokenBalance += Number(balance);
                }
                tokenBalances.push(tokenBalance);
            }

            const nonZeroBalancesRaw = tokenBalances.filter(balance => balance > 0);
            const allTokens = contractPosition.tokens.map((cp, idx) =>
                drillBalance(cp, nonZeroBalancesRaw[idx]?.toString() ?? '0'),
            );

            const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
            const balanceUSD = sumBy(tokens, t => t.balanceUSD);

            const balance: ContractPositionBalance = { ...contractPosition, tokens, balanceUSD };

            return balance;
        }),
        );
        return _.compact(balances);
    }
}

