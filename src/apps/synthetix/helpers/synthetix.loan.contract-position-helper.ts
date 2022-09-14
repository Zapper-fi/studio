import { Inject, Injectable } from '@nestjs/common';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';
import { borrowed, supplied } from '~position/position.utils';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { ContractPosition } from '~position/position.interface';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';
import { ContractType } from '~position/contract.interface';

export type SynthetixLoanContractPositionHelperParams = {
    loanContractAddress: string;
    network: Network;
};

@Injectable()
export class SynthetixLoanContractPositionHelper {
    constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) { }

    async getPositions({ loanContractAddress, network }: SynthetixLoanContractPositionHelperParams) {
        // const loanContractAddress = '0x308ad16ef90fe7cacb85b784a603cb6e71b1a41a';

        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

        const ethToken = baseTokens.find(p => p.address === ZERO_ADDRESS);
        const susdToken = baseTokens.find(p => p.symbol === 'sUSD')!;
        const sethToken = baseTokens.find(p => p.symbol === 'sETH')!;
        const tokens = [
            supplied(ethToken),
            borrowed(susdToken),
            borrowed(sethToken)];

        // Display Props
        const label = SYNTHETIX_DEFINITION.groups.loan.label;
        const images = [
            getTokenImg(ethToken.address, network),
            getTokenImg(susdToken.address, network),
            getTokenImg(sethToken.address, network)];

        const position: ContractPosition = {
            type: ContractType.POSITION,
            address: loanContractAddress,
            appId: SYNTHETIX_DEFINITION.id,
            groupId: SYNTHETIX_DEFINITION.groups.loan.id,
            network,
            tokens,
            dataProps: {
            },
            displayProps: {
                label,
                images,
            },
        };

        return [position];
    }
}