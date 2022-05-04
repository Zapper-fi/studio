import { Inject } from '@nestjs/common';
import { compact, range } from 'lodash';
import Web3 from 'web3';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { UNISWAP_V2_DEFINITION } from '~apps/uniswap-v2';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { MakerContractFactory } from '../contracts';
import { MAKER_DEFINITION } from '../maker.definition';

const appId = MAKER_DEFINITION.id;
const groupId = MAKER_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

export type MakerVaultContractPositionDataProps = {
  ilkName: string;
};

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumMakerVaultContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(MakerContractFactory)
    private readonly makerContractFactory: MakerContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: UNISWAP_V2_DEFINITION.id,
      groupIds: [UNISWAP_V2_DEFINITION.groups.pool.id],
      network,
    });
    const allTokens = [...appTokens, ...baseTokens];

    // Gather the number of registered ilks
    const ilkRegAddress = '0x5a464c28d19848f44199d003bef5ecc87d090f87';
    const ilkRegContract = this.makerContractFactory.makerIlkRegistry({ address: ilkRegAddress, network });
    const numIlks = await ilkRegContract.count();

    // Gather contract positions
    const contractPositions = await Promise.all(
      range(0, Number(numIlks)).map(async ilkIndex => {
        const ilk = await multicall.wrap(ilkRegContract).get(ilkIndex);
        const ilkName = Web3.utils.hexToAscii(ilk).replace(/\0/g, '');
        const gem = await multicall.wrap(ilkRegContract).gem(ilk);
        const join = await multicall.wrap(ilkRegContract).join(ilk);

        const contractAddress = join.toLowerCase();
        const collateralTokenAddress = gem.toLowerCase();
        const collateralToken = allTokens.find(v => v.address === collateralTokenAddress);
        const debtToken = baseTokens.find(v => v.symbol === 'DAI');
        if (!collateralToken || !debtToken) return null;

        // Data Props
        const tokens = [supplied(collateralToken), borrowed(debtToken)];

        // Display Props
        const label = `${ilkName} Vault`;
        const collateralImages = getImagesFromToken(collateralToken);
        const images = [...collateralImages, getTokenImg(debtToken.address, network)];

        const position: ContractPosition<MakerVaultContractPositionDataProps> = {
          type: ContractType.POSITION,
          address: contractAddress,
          appId: MAKER_DEFINITION.id,
          groupId: MAKER_DEFINITION.groups.vault.id,
          network,
          tokens,

          dataProps: {
            ilkName,
          },

          displayProps: {
            label,
            images,
          },
        };

        return position;
      }),
    );

    return compact(contractPositions);
  }
}
