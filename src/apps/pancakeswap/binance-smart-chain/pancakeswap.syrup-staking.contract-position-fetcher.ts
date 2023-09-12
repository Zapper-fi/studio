import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import {
  GetTokenDefinitionsParams,
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';
import { SingleStakingFarmDynamicTemplateContractPositionFetcher } from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { PancakeswapContractFactory, PancakeswapSmartChef } from '../contracts';

// @TODO: Should be indexed from BQ events or logs
// https://github.com/pancakeswap/pancake-frontend/blob/develop/src/config/constants/pools.tsx

const FARMS = [
  '0xaf3efe5fceebc603eada6a2b0172be11f7405102',
  '0xf73fdeb26a8c7a4abf3809d3db11a06ba5c13d0e',
  '0xaac7171afc93f4b75e1268d208040b152ac65e32',
  '0x2c6017269b4324d016ca5d8e3267368652c18905',
  '0x675434c68f2672c983e36cf10ed13a4014720b79',
  '0x05d6c2d1d687eacfb5e6440d5a3511e91f2201a8',
  '0xd623a32da4a632ce01766c317d07cb2cad56949b',
  '0xdf75f38dbc98f9f26377414e567abcb8d57cca33',
  '0xce64a930884b2c68cd93fc1c7c7cdc221d427692',
  '0xc1e70edd0141c454b834deac7dddea413424aef9',
  '0x189d8228cdfdc404bd9e5bd65ff958cb5fd8855c',
  '0x0196c582216e2463f052e2b07ef8667bec9fb17a',
  '0x8f84106286c9c8a42bc3555c835e6e2090684ab7',
  '0xa8d32b31ecb5142f067548bf0424389ee98faf26',
  '0xc59aa49ae508050c2df653e77be13822fff02e9a',
  '0x14aea62384789eda98f444ccb970f6730877d3f9',
  '0xebb87df24d65977cbe62538e4b3cfbd5d0308642',
  '0x40918ef8efff4aa061656013a81e0e5a8a702ea7',
  '0x44ec1b26035865d9a7c130fd872670cd7ebac2bc',
  '0x1329ad151de6c441184e32e108401126ae850937',
  '0x9bbdc92474a7e7321b78dcda5ef35f4981438760',
  '0x46530d79b238f809e80313e73715b160c66677af',
  '0x47fd853d5bad391899172892f91faa6d0cd8a2aa',
  '0xe25ab6f05bbf6c1be953bf2d7df15b3e01b8e5a5',
  '0xeb8fd597921e3dd37b0f103a2625f855e2c9b9b5',
  '0xabfd8d1942628124ab971937154f826bce86dcbc',
  '0x526d3c204255f807c95a99b69596f2f9f72345e5',
  '0xaa2082bee04fc518300ec673f9497ffa6f669db8',
  '0x9096625bc0d36f5eda6d44e511641667d89c28f4',
  '0x78bd4db48f8983c3c36c8eafbef38f6ac7b55285',
  '0x35418e14f5aa615c4f020efba6e01c5dbf15add2',
  '0x3c7cc49a35942fbd3c2ad428a6c22490cd709d03',
  '0xf795739737abcfe0273f4dced076460fdd024dd9',
  '0x06ff8960f7f4ae572a3f57fae77b2882be94bf90',
  '0xe4dd0c50fb314a8b2e84d211546f5b57edd7c2b9',
  '0xb627a7e33db571be792b0b69c5c2f5a8160d5500',
  '0xadbffa25594af8bc421ecadf54d057236a99781e',
  '0x3e31488f08ebce6f2d8a2aa512aefa49a3c7dfa7',
  '0x453a75908fb5a36d482d5f8fe88eca836f32ead5',
  '0x509c99d73fb54b2c20689708b3f824147292d38e',
  '0xf1bd5673ea4a1c415ec84fa3e402f2f7788e7717',
  '0xb4c68a1c565298834360bbff1652284275120d47',
  '0x153e62257f1aae05d5d253a670ca7585c8d3f94f',
  '0xf682d186168b4114ffdbf1291f19429310727151',
  '0xaddae5f4db84847ac9d947aed1304a8e7d19f7ca',
  '0x4c32048628d0d32d4d6c52662fb4a92747782b56',
  '0x47642101e8d8578c42765d7abcfd0ba31868c523',
  '0x07f8217c68ed9b838b0b8b58c19c79bace746e9a',
  '0x580dc9bb9260a922e3a4355b9119db990f09410d',
  '0x6f0037d158ed1aee395e1c12d21ae8583842f472',
  '0x423382f989c6c289c8d441000e1045e231bd7d90',
  '0x0a595623b58dfde6eb468b613c11a7a8e84f09b9',
  '0x9e6da246d369a41dc44673ce658966caf487f7b2',
  '0x2c0f449387b15793b9da27c2d945dbed83ab1b07',
  '0x0c3d6892aa3b23811af3bd1bbea8b0740e8e4528',
  '0x75c91844c5383a68b7d3a427a44c32e3ba66fe45',
  '0xc58954199e268505fa3d3cb0a00b7207af8c2d1d',
  '0xa5137e08c48167e363be8ec42a68f4f54330964e',
  '0x6f31b87f51654424ce57e9f8243e27ed13846cdb',
  '0xce54ba909d23b9d4be0ff0d84e5ae83f0add8d9a',
  '0x3e677dc00668d69c2a7724b9afa7363e8a56994e',
  '0x5ac8406498dc1921735d559cec271bed23b294a7',
  '0xb69b6e390cba1f68442a886bc89e955048dae7e3',
  '0xae3001ddb18a6a57bec2c19d71680437ca87ba1d',
  '0x02aa767e855b8e80506fb47176202aa58a95315a',
  '0x1c736f4fb20c7742ee83a4099fe92aba61dfca41',
  '0x02861b607a5e87daf3fd6ec19dfb715f1b371379',
  '0x73e4e8d010289267dee3d1fc48974b60363963ce',
  '0xe0565fbb109a3f3f8097d8a9d931277bfd795072',
  '0xc3693e3cbc3514d5d07ea5b27a721f184f617900',
  '0x2b02d43967765b18e31a9621da640588f3550efd',
  '0x212bb602418c399c29d52c55100fd6bba12bea05',
  '0x04ae8ca68a116278026fb721c06dce709ed7013c',
  '0x1714baae9dd4738cdea07756427fa8d4f08d9479',
  '0xccd0b93cc6ce3dc6dfaa9db68f70e5c8455ac5bd',
  '0x9cb24e9460351bc51d4066bc6aed1f3809b02b78',
  '0x2dcf4cdff4dd954683fe0a6123077f8a025b66cf',
  '0x6efa207acde6e1cab77c1322cbde9628929ba88f',
  '0xd0b738ec507571176d40f28bd56a0120e375f73a',
  '0xf7a31366732f08e8e6b88519dc3e827e04616fc9',
  '0x9f23658d5f4ced69282395089b0f8e4db85c6e79',
  '0xb6fd2724cc9c90dd31da35dbdf0300009dcef97d',
  '0x108bfe84ca8bce0741998cb0f60d313823cec143',
  '0x4a26b082b432b060b1b00a84ee4e823f04a6f69a',
  '0x3cc08b7c6a31739cfed9d8d38b484fdb245c79c8',
  '0xd18e1aeb349ef0a6727ece54597d98d263e05cab',
  '0x68c7d180bd8f7086d91e65a422c59514e4afd638',
  '0xbe65d7e42e05ad2c4ad28769dc9c5b4b6eaff2c7',
  '0x1500fa1afbfe4f4277ed0345cdf12b2c9ca7e139',
  '0x624ef5c2c6080af188af96ee5b3160bb28bb3e02',
  '0x0554a5d083abf2f056ae3f6029e1714b9a655174',
  '0x543467b17ca5de50c8bf7285107a36785ab57e56',
  '0x65afeafaec49f23159e897efbdce19d94a86a1b6',
  '0x1ad34d8d4d79dde88c9b6b8490f8fc67831f2cae',
  '0x326d754c64329ad7cb35744770d56d0e1f3b3124',
  '0x42afc29b2dea792974d1e9420696870f1ca6d18b',
  '0xbb2b66a2c7c2fffb06ea60bead69741b3f5bf831',
  '0xfb1088dae0f03c5123587d2babb3f307831e6367',
  '0x9c4ebada591ffec4124a7785cabcfb7068fed2fb',
  '0x90f995b9d46b32c4a1908a8c6d0122e392b3be97',
  '0xdc8c45b7f3747ca9caaeb3fa5e0b5fce9430646b',
  '0xff02241a2a1d2a7088a344309400e9fe74772815',
  '0xdc938ba1967b06d666da79a7b1e31a8697d1565e',
  '0x07a0a5b67136d40f4d7d95bc8e0583bafd7a81b9',
  '0x21a9a53936e812da06b7623802dec9a1f94ed23a',
  '0xe7f9a439aa7292719ac817798ddd1c4d35934aaf',
  '0xcec2671c81a0ecf7f8ee796efa6dbdc5cb062693',
];

@PositionTemplate()
export class BinanceSmartChainPancakeswapSyrupStakingContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<PancakeswapSmartChef> {
  groupLabel = 'Syrup Staking';
  currentBlock = 0;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory) protected readonly contractFactory: PancakeswapContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pancakeswapSmartChef({ address, network: this.network });
  }

  async getFarmAddresses() {
    const provider = this.appToolkit.getNetworkProvider(this.network);
    this.currentBlock = await provider.getBlockNumber();

    return FARMS;
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<PancakeswapSmartChef>) {
    return contract.syrup();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<PancakeswapSmartChef>) {
    return [await contract.rewardToken()];
  }

  async getRewardRates({ contract }: GetDataPropsParams<PancakeswapSmartChef>) {
    const end = await contract.bonusEndBlock();
    if (Number(end) > this.currentBlock) return [0];
    return [await contract.rewardPerBlock()];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PancakeswapSmartChef>) {
    return `Earn ${getLabelFromToken(contractPosition.tokens[1])}`;
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<PancakeswapSmartChef>) {
    return contract.userInfo(address).then(v => v.amount);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<PancakeswapSmartChef>) {
    return contract.pendingReward(address);
  }
}
