import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';
import { compact, flatten, isEqual, uniqWith } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { DisplayProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { YieldProtocolContractFactory } from '../contracts';
import {
  artsQuery,
  ilksQuery,
  YieldArtsRes,
  YieldIlksRes,
  YieldVaultContractPositionDataProps,
} from '../ethereum/yield-protocol.borrow.contract-position-fetcher';
import { YIELD_PROTOCOL_DEFINITION } from '../yield-protocol.definition';

import { CAULDRON, LADLE } from './yield-protocol.balance-fetcher';
import { yieldV2ArbitrumSubgraph } from './yield-protocol.lend.token-fetcher';

const appId = YIELD_PROTOCOL_DEFINITION.id;
const groupId = YIELD_PROTOCOL_DEFINITION.groups.borrow.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumYieldProtocolBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolContractFactory) private readonly yieldProtocolContractFactory: YieldProtocolContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const cauldron = this.yieldProtocolContractFactory.cauldron({ address: CAULDRON, network });

    const { assets: ilks } = await this.appToolkit.helpers.theGraphHelper.request<YieldIlksRes>({
      endpoint: yieldV2ArbitrumSubgraph,
      query: ilksQuery,
    });

    const { seriesEntities: artsRes } = await this.appToolkit.helpers.theGraphHelper.request<YieldArtsRes>({
      endpoint: yieldV2ArbitrumSubgraph,
      query: artsQuery,
    });

    // get distinct debt assets
    const distinctArts = uniqWith(artsRes, isEqual);

    const positions = await Promise.all(
      ilks.map(async ilk => {
        const { assetId: ilkId, id: ilkAddress } = ilk;
        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
        const _ilk = baseTokens.find(v => v.address === ilkAddress.toLowerCase());

        if (!_ilk) return;

        return await Promise.all(
          distinctArts.map(async art => {
            const {
              baseAsset: { assetId: artId, id: artAddress },
            } = art;

            const _art = baseTokens.find(v => v.address === artAddress.toLowerCase());
            if (!_art) return null;

            const [{ max: maxDebt }, { ratio }] = await Promise.all([
              multicall.wrap(cauldron).debt(artId, ilkId),
              multicall.wrap(cauldron).spotOracles(artId, ilkId),
            ]);

            // assume this is an invalid art/ilk pair if the max debt has not been set
            if (maxDebt.eq(ethers.constants.Zero)) return null;

            const minCollatRatio = ratio / 10 ** 6; // ratio uses 6 decimals for all pairs
            const minCollateralizationRatio = `${(minCollatRatio * 100).toString()}%`;

            const tokens = [supplied(_ilk), borrowed(_art)];

            const displayProps: DisplayProps = {
              label: `Yield Debt/Collateral Pair`,
              secondaryLabel: `${getLabelFromToken(_art)} Debt and ${getLabelFromToken(_ilk)} Collateral`,
              images: [getImagesFromToken(_art)[0], getImagesFromToken(_ilk)[0]],
            };

            const position: ContractPosition<YieldVaultContractPositionDataProps> = {
              type: ContractType.POSITION,
              appId,
              groupId,
              address: LADLE,
              network,
              tokens,
              dataProps: {
                minCollateralizationRatio,
              },
              displayProps,
            };

            return position;
          }),
        );
      }),
    );
    return compact(flatten(positions));
  }
}
