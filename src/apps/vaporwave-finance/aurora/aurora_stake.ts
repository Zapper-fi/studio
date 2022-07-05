export const auroraStakePools = [
  {
    id: 'vwave-weth',
    name: 'VWAVE',
    logo: 'single-assets/VWAVE.png',
    token: 'VWAVE',
    tokenDecimals: 18,
    tokenAddress: '0x2451dB68DeD81900C4F16ae1af597E9658689734', //  staking token, VWAVE token
    tokenOracle: 'tokens',
    tokenOracleId: 'VWAVE',
    earnedToken: 'WETH',
    vaultPlatform: 'Vaporwave',
    earnedTokenDecimals: 18,
    earnedTokenAddress: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB', //  WETH
    earnContractAddress: '0x586009baA80010833637f4C371bca2496EA70225', //  VWAVE reward pool
    earnedOracle: 'tokens',
    earnedOracleId: 'WETH',
    partnership: false,
    status: 'active',
    fixedStatus: true,
    partners: [
      {
        logo: 'stake/vwave/vaporwave.png',
        background: '',
        text: "Vaporwave Finance is the first Revenue-Sharing Yield Optimizer on Aurora, enabling users to earn autocompounded yield on their crypto. Did you know also that you can own a piece of Vaporwave itself? Vaporwave runs on its governance token, VWAVE. The token has a maximum supply of 50,000; no more will ever be minted! In the future, holders of VWAVE will be able to create and vote on important DAO proposals, and you become dividend-eligible to earn a share of every compounding harvest on Vaporwave vaults, hour by hour. You just need to stake VWAVE in this reward pool, or in the autocompounding VWAVE Maxi vault on the main page. For this pool, WETH dividends are gathered and sent proportionally to each staker. Stake here, return later to claim the WETH you've earned.",
        website: 'https://vaporwave.farm',
        social: {
          telegram: 'http://t.me/Vaporwavefinancechat',
          twitter: 'https://twitter.com/vwavefinance',
        },
      },
    ],
  },
  //  BEGIN VAPORWAVE LP POOL
  {
    id: 'vaporwave-vwave-near',
    name: 'Vaporwave',
    logo: 'single-assets/vwave-near-TrisolarisLP.svg',
    assets: ['VWAVE', 'NEAR'],
    token: 'vwave-near-TrisolarisLP',
    tokenDecimals: 18,
    tokenAddress: '0xFd3fDA44cd7F1EA9e9856B56d21F64FC1A417b8E', //  vault token
    tokenOracle: 'lps',
    vaultPlatform: 'Vaporwave',
    tokenOracleId: 'vaporwave-vwave-near',
    isVaporLP: true,
    earnedToken: 'VWAVE',
    earnedTokenDecimals: 18,
    earnedTokenAddress: '0x2451dB68DeD81900C4F16ae1af597E9658689734', //  reward token earned by boost
    earnContractAddress: '0x1a753380E261F0EafFD7282EC978D90B4d3ce31E', //  contract address of reward pool
    earnedOracle: 'tokens', //  basis for earned token
    earnedOracleId: 'VWAVE', //  reward token oracle
    partnership: false, //  is partnership
    status: 'active',
    fixedStatus: true,
    isMooStaked: false,
    // periodFinish: 1651323716,   //  UNIX
    partners: [
      {
        text: 'Trisolaris is the largest DEX by volume on Aurora.',
        website: 'https://www.trisolaris.io/#/swap',
        social: {
          telegram: 'https://t.me/TrisolarisLabs',
          twitter: 'https://twitter.com/trisolarislabs',
        },
      },
    ],
  },
];

export default auroraStakePools
