import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AAVE_AMM_DEFINITION = appDefinition({
  id: 'aave-amm',
  name: 'Aave AMM',
  description: `Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers. The Aave AMM market enables liquidity providers (“LPs”) of Uniswap and Balancer to use their LP tokens as collateral in the Aave Protocol.`,
  url: 'https://aave.com/',
  tags: [AppTag.LENDING],

  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    stableDebt: {
      id: 'stable-debt',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    variableDebt: {
      id: 'variable-debt',
      type: GroupType.TOKEN,
      label: 'Lending',
    },
  },

  supportedNetworks: { [Network.ETHEREUM_MAINNET]: [AppAction.VIEW] },
  primaryColor: '#1c1d26',

  links: {
    github: 'https://github.com/aave',
    twitter: 'https://twitter.com/AaveAave',
    discord: 'https://discord.gg/CvKUrqM',
    telegram: 'https://t.me/Aavesome',
    medium: 'https://medium.com/aave',
  },

  token: {
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(AAVE_AMM_DEFINITION.id)
export class AaveAmmAppDefinition extends AppDefinition {
  constructor() {
    super(AAVE_AMM_DEFINITION);
  }
}
