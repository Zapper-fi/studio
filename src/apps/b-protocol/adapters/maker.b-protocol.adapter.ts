import { Inject } from '@nestjs/common';
import _ from 'lodash';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MAKER_DEFINITION } from '~apps/maker';
import { ProductItem } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { BProtocolContractFactory } from '../contracts';

const appId = MAKER_DEFINITION.id;
const groupId = MAKER_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

export class MakerBProtocolAdapter {
  private readonly BCDP_MANGER = '0x3f30c2381cd8b917dd96eb2f1a4f96d91324bbed';
  private readonly CDP_MANAGER = '0x5ef30b9986345249bc32d8928b7ee64de9435e39';
  private readonly GET_CDPS = '0x36a724bd100c39f0ea4d3a20f7097ee01a8ff573';
  private readonly MCD_VAT = '0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b';
  private readonly MCD_SPOT = '0x65c79fcb50ca1594b025960e539ed7a9a6d434a3';
  private readonly PROXY_REGISTRY = '0x4678f0a6958e4d2bc4f1baf7bc52e8f3564f3fe4';
  private readonly JAR = '0x3c36ccf03dab88c1b1ac1eb9c3fb5db0b6763cff';
  private readonly ILKs = [
    {
      name: 'ETH-A',
      code: '0x4554482d41000000000000000000000000000000000000000000000000000000',
    },
    {
      name: 'ETH-B',
      code: '0x4554482d42000000000000000000000000000000000000000000000000000000',
    },
    {
      name: 'ETH-C',
      code: '0x4554482d43000000000000000000000000000000000000000000000000000000',
    },
    {
      name: 'WBTC-A',
      code: '0x574254432d410000000000000000000000000000000000000000000000000000',
    },
  ];

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BProtocolContractFactory) private readonly bProtocolContractFactory: BProtocolContractFactory,
  ) {}

  async getBalances(address: string): Promise<ProductItem | null> {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const contract = this.bProtocolContractFactory.bProtocolGetInfo({
      address: '0x468960199c8045dedcf6aeb33e28dc57346ad3ff',
      network,
    });

    const makerBalancesRaw = await Promise.all(
      this.ILKs.map(async ilk => {
        const userInfo = await contract.callStatic.getInfo(
          address,
          ilk.code,
          this.BCDP_MANGER,
          this.CDP_MANAGER,
          this.GET_CDPS,
          this.MCD_VAT,
          this.MCD_SPOT,
          this.PROXY_REGISTRY,
          this.JAR,
        );

        // Data Props
        const vaultID = Number(userInfo.bCdpInfo.cdp);
        const tokenSymbol = ilk.name.split('-')[0];
        const collateralToken = baseTokens.find(p => p.symbol === tokenSymbol);
        const debtToken = baseTokens.find(p => p.symbol === 'DAI');
        if (!collateralToken || !debtToken) return null;

        const collateral = drillBalance(collateralToken, userInfo.bCdpInfo.ethDeposit.toString());
        const debt = drillBalance(debtToken, userInfo.bCdpInfo.daiDebt.toString(), { isDebt: true });
        const tokens = [collateral, debt].filter(v => Math.abs(v.balanceUSD) > 0);
        const balanceUSD = sumBy(tokens, v => v.balanceUSD);
        const cRatio = debt.balanceUSD === 0 ? 0 : (collateral.balanceUSD / Math.abs(debt.balanceUSD)) * 100;

        // Display Props
        const label = `Maker Vault #${vaultID}`;
        const images = tokens.map(v => getImagesFromToken(v)).flat();

        const position: ContractPositionBalance = {
          type: ContractType.POSITION,
          address: this.BCDP_MANGER,
          appId,
          groupId,
          network,
          tokens,
          balanceUSD,

          dataProps: {
            cRatio,
          },

          displayProps: {
            label,
            images,
          },
        };

        return position;
      }),
    );

    const makerBalances = _.compact(makerBalancesRaw);

    const [collateral, debt] = _.partition(
      makerBalances.flatMap(v => v.tokens),
      v => v.balanceUSD >= 0,
    );
    const collateralUSD = sumBy(collateral, a => a.balanceUSD);
    const debtUSD = sumBy(debt, a => a.balanceUSD);
    const cRatio = debtUSD === 0 ? 0 : (collateralUSD / Math.abs(debtUSD)) * 100;

    return {
      label: 'Maker',
      assets: makerBalances.flat(),
      meta: [
        {
          label: 'Collateral',
          value: collateralUSD,
          type: 'dollar',
        },
        {
          label: 'Debt',
          value: debtUSD,
          type: 'dollar',
        },
        {
          label: 'C-Ratio',
          value: cRatio,
          type: 'pct',
        },
      ],
    };
  }
}
