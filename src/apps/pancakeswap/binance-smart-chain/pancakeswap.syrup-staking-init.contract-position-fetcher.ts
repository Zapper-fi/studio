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

import { PancakeswapViemContractFactory } from '../contracts';
import { PancakeswapSmartChefInit } from '../contracts/viem/PancakeswapSmartChefInit';

// @TODO: Should be indexed from BQ events or logs
// https://github.com/pancakeswap/pancake-frontend/blob/develop/packages/pools/src/constants/pools/56.ts

const FARMS = [
  '0xa5d57c5dca083a7051797920c78fb2b19564176b',
  '0xd1c395bcdc2d64ac6544a34a36185483b00530a1',
  '0xc581345e1648cce154978ea80bf8a584ec8afde0',
  '0xed53944b1c0ceecde1a413fdb4d0496e1a08ab58',
  '0x9593462ff51a14633b243ba3d054a8183d057a02',
  '0x641b1f2781b34a493e4308a0a3f1c7e042a9b952',
  '0x0d53e0f2eb384777442e4eb813d8f5facc742206',
  '0x84e3208578ee7db397a3d584d97fea107b15bf35',
  '0x7092e029e4ce660f9ac081bf6d8a339be602398b',
  '0xa581349f26de887700045f9b7d148775d422fda2',
  '0xe76a31cf974ba5819ce86cb4667a4bf05174bc59',
  '0x6e0272a70075f6782f6842730107e9abf74c5cc7',
  '0x60c4998c058bac8042712b54e7e43b892ab0b0c4',
  '0xd1d03a3d4c27884a8703cdb78504737c9e9a159e',
  '0x260f95f5b7fd8eda720ed9d0829164de35b048ab',
  '0x346a1b672c5cbb6ae21715428f77a0049b29b332',
  '0xcd1be742b04db005e2c445a11bde6d13dd9dd454',
  '0xd5668e936b951292ddf8c84553cc58f85948f816',
  '0x80762101bd79d6e7a175e9678d05c7f815b8d7d7',
  '0xaaf43935a526df88ab57fc69b1d80a8d35e1de82',
  '0x921ea7e12a66025f2bd287edbff6dc5ceabd6477',
  '0xead7b8fc5f2e5672fae9dcf14e902287f35cb169',
  '0x1c9e3972fdba29b40954bb7594da6611998f8830',
  '0xa34832efe74133763a85060a64103542031b0a7e',
  '0x92c07c325ce7b340da2591f5e9cbb1f5bab73fcf',
  '0x25ca61796d786014ffe15e42ac11c7721d46e120',
  '0xad8f6a9d58012dca2303226b287e80e5fe27eff0',
  '0x1a777ae604cfbc265807a46db2d228d4cc84e09d',
  '0x09e727c83a75ffdb729280639edbf947db76eeb7',
  '0x2718d56ae2b8f08b3076a409bbf729542233e451',
  '0x2461ea28907a2028b2bca40040396f64b4141004',
  '0x9e31aef040941e67356519f44bca07c5f82215e5',
  '0x1c0c7f3b07a42efb4e15679a9ed7e70b2d7cc157',
  '0x56bfb98ebef4344df2d88c6b80694cba5efc56c8',
  '0x07984abb7489cd436d27875c07eb532d4116795a',
  '0xf1fa41f593547e406a203b681df18accc3971a43',
  '0x13a40bfab005d9284f8938fbb70bf39982580e4d',
  '0x0914b2d9d4dd7043893def53ecfc0f1179f87d5c',
  '0xd97ee2bfe79a4d4ab388553411c462fbb536a88c',
  '0x2efe8772eb97b74be742d578a654ab6c95bf18db',
  '0x7f103689cabe17c2f70da6faa298045d72a943b8',
  '0xbd52ef04db1ad1c68a8fa24fa71f2188978ba617',
  '0x73bb10b89091f15e8fed4d6e9eba6415df6acb21',
  '0xdd52fab121376432dbcbb47592742f9d86cf8952',
  '0x2b8751b7141efa7a9917f9c6fea2cea071af5ee7',
  '0xfdfb4dbe94916f9f55dbc2c14ea8b3e386ecd9f9',
  '0x79f5f7ddadefa0a9e850dffc4fba77e5172fe701',
  '0x9b861a078b2583373a7a3eef815be1a39125ae08',
  '0xa35caa9509a2337e22c54c929146d5f7f6515794',
  '0x6e63b2b96c77532ea7ec2b3d3bfa9c8e1d383f3c',
  '0xfef4b7a0194159d89717efa592384d42b28d3926',
  '0x2d26e4b9a5f19ed5bb7af221dc02432d31deb4da',
  '0xd008416c2c9cf23843bd179aa3cefedb4c8d1607',
  '0xd9b63bb6c62fe2e9a641699a91e680994b8b0081',
  '0xcc2d359c3a99d9cfe8e6f31230142eff1c828e6d',
  '0x65c0940c50a3c98aeec95a115ae62e9804588713',
  '0x6f660c58723922c6f866a058199ff4881019b4b5',
  '0xc28c400f2b675b25894fa632205ddec71e432288',
  '0x8d018823d13c56d62ffb795151a9e629c21e047b',
  '0x4d1ec426d0d7fb6bf344dd372d0502edd71c8d88',
  '0xcb41a72067c227d6ed7bc7cfacd13ece47dfe5e9',
  '0xcecba456fefe5b18d43df23419e7ab755b436655',
  '0x8ed7acf12b08274d5cdaf03d43d0e54bcbdd487e',
  '0xc4b15117bc0be030c20754ff36197641477af5d1',
  '0xb72def58d0832f747d6b7197471fe20aea7eb463',
  '0xb38b78529bcc895da16ce2978d6cd6c56e8cffc3',
  '0x2e101b5f7f910f2609e5ace5f43bd274b1de09aa',
  '0x52733ad7b4d09bf613b0389045e33e2f287afa04',
  '0x401b9b97bdbc3197c1adfab9652dc78040bd1e13',
  '0xbedb490970204cb3cc7b0fea94463bed67d5364d',
  '0xb6e510ae2da1ab4e350f837c70823ab75091780e',
  '0x8aa5b2c67852ed5334c8a7f0b5eb0ef975106793',
  '0x3b804460c3c62f0f565af593984159f13b1ac976',
  '0x455f4d4cc4d6ca15441a93c631e82aaf338ad843',
  '0xde4aef42bb27a2cb45c746acde4e4d8ab711d27c',
  '0x57d3524888ded4085d9124a422f13b27c8a43de7',
  '0xb56299d8fbf46c509014b103a164ad1fc65ea222',
  '0x5e49531ba07be577323e55666d46c6217164119e',
  '0xbb472601b3cb32723d0755094ba80b73f67f2af3',
  '0x583a36816f3b8401c4fdf682203e0cada6997740',
  '0x28050e8f024e05f9ddbef5f60dd49f536dba0cf0',
  '0xb2b62f88ab82ed0bb4ab4da60d9dc9acf9e816e5',
  '0xd1812e7e28c39e78727592de030fc0e7c366d61a',
  '0x97058cf9b36c9ef1622485cef22e72d6fea32a36',
  '0xe595456846155e23b24cc9cbee910ee97027db6d',
  '0xae611c6d4d3ca2cee44cd34eb7aac29d5a387fcf',
  '0x135827eaf9746573c0b013f18ee12f138b9b0384',
  '0x09b8a5f51c9e245402057851ada274174fa00e2a',
  '0x53a2d1db049b5271c6b6db020dba0e8a7c4eb90d',
  '0x4da8da81647ee0aa7350e9959f3e4771eb753da0',
  '0x0446b8f8474c590d2249a4acdd6eedbc2e004bca',
  '0x391240a007bfd8a59ba74978d691219a76c64c5c',
  '0x017dea5c58c2bcf57fa73945073df7ad4052a71c',
  '0x6bd94783cacef3fb7eaa9284f1631c464479829f',
  '0x7c71723fb1f9cfb250b702cfc4ebd5d9ab2e83d9',
  '0x9c8813d7d0a61d30610a7a5fdef9109e196a3d77',
  '0xa07a91da6d10173f33c294803684bceede325957',
  '0x88c321d444c88acf3e747dc90f20421b97648903',
  '0x3c7234c496d76133b48bd6a342e7aea4f8d87fc8',
  '0x64473c33c360f315cab38674f1633505d1d8dcb2',
  '0x5cc7a19a50be2a6b2540ebcd55bd728e732e59c3',
  '0x2666e2494e742301ffc8026e476acc1710a775ed',
  '0x6ac2213f09a404c86aff506aa51b6a5bf1f6e24e',
  '0x35bd47263f7e57368df76339903c53baa99076e1',
  '0x62dec3a560d2e8a84d30752ba454f97b26757877',
  '0x44d1f81e80e43e935d66d65874354ef91e5e49f6',
  '0x4ea43fce546975aae120c9eeceb172500be4a02b',
  '0x567fd708e788e51b68666b9310ee9df163d60fae',
  '0x36f9452083fc9bc469a31e7966b873f402292433',
  '0xc612680457751d0d01b5d901ad08132a3b001900',
  '0x336bcd59f2b6eb7221a99f7a50fd03c6bf9a306b',
  '0x2b3974dda76b2d408b7d680a27fbb0393e3cf0e1',
  '0xfa67f97eeee6de55d179ecabbfe701f27d9a1ed9',
  '0x48852322a185dc5fc733ff8c8d7c6dcbd2b3b2a2',
  '0xf4d0f71698f58f221911515781b05e808a8635cb',
  '0x9dceb1d92f7e0361d0766f3d98482424df857654',
  '0xb77f1425ec3a7c78b1a1e892f72332c8b5e8ffcb',
  '0xb9ff4da0954b300542e722097671ead8cf337c17',
  '0xb19395702460261e51edf7a7b130109c64f13af9',
  '0x6e113ecb9ff2d271140f124c2cc5b5e4b5700c9f',
  '0x7baf1763ce5d0da8c9d85927f08a8be9c481ce50',
  '0x2b8d6c9c62bfc1bed84724165d3000e61d332cab',
  '0x8a06ff2748edcba3fb4e44a6bfda4e46769e557b',
  '0x3eba95f5493349bbe0cad33eaae05dc6a7e26b90',
  '0x593edbd14a5b7eec828336accca9c16cc12f04be',
  '0xd714738837944c3c592477249e8edb724a76e068',
  '0x8ea9f2482b2f7b12744a831f81f8d08714adc093',
  '0x8e8125f871eb5ba9d55361365f5391ab437f9acc',
  '0x0e09205e993f78cd5b3a5df355ae98ee7d0b5834',
  '0xf9f00d41b1f4b3c531ff750a9b986c1a530f33d9',
  '0x4af531ecd50167a9402ce921ee6436dd4cfc04fd',
  '0x9b4bac2d8f69853aa29cb45478c77fc54532ac22',
  '0x20ee70a07ae1b475cb150dec27930d97915726ea',
  '0x017556dffb8c6a52fd7f4788adf6fb339309c81b',
  '0xdaa711ecf2ac0bff5c82fceeae96d0008791cc49',
  '0x74af842ecd0b6588add455a47aa21ed9ba794108',
  '0x42d41749d6e9a1c5b47e27f690d4531f181b2159',
  '0xbebd44824631b55991fa5f2bf5c7a4ec96ff805b',
  '0x55131f330c886e3f0cae389cedb23766ac9aa3ed',
  '0x01453a74a94687fa3f99b80762435855a13664f4',
  '0x0032ceb978fe5fc8a5d5d6f5adfc005e76397e29',
  '0x439b46d467402cebc1a2fa05038b5b696b1f4417',
  '0x377ae5f933aa4cfa41fa03e2cae8a2befccf53b2',
  '0xce3ebac3f549ebf1a174a6ac3b390c179422b5f6',
  '0xd26dec254c699935c286cd90e9841dcabf1af72d',
  '0x93e2867d9b74341c2d19101b7fbb81d6063cca4d',
  '0x3b644e44033cff70bd6b771904225f3dd69dfb6d',
  '0x0a687d7b951348d681f7ed5eea84c0ba7b9566dc',
  '0x417df1c0e6a498eb1f2247f99032a01d4fafe922',
  '0xdc8943d806f9dd64312d155284abf780455fd345',
  '0xa90a894e5bc20ab2be46c7e033a38f8b8eaa771a',
  '0x34ac807e34e534fe426da1e11f816422774aae1c',
  '0x31fa2f516b77c4273168b284ac6d9def5aa6dafb',
  '0x7112f8988f075c7784666ab071927ae4109a8076',
  '0x126dfbcef85c5bf335f8be99ca4006037f417892',
  '0x4f0ad2332b1f9983e8f63cbee617523bb7de5031',
  '0x9483ca44324de06802576866b9d296f7614f45ac',
  '0x72ceec6e2a142678e703ab0710de78bc819f4ce0',
  '0x1c6ed21d3313822ae73ed0d94811ffbbe543f341',
  '0x1ac0d0333640f57327c83053c581340ebc829e30',
  '0xc707e5589aeb1dc117b0bb5a3622362f1812d4fc',
  '0x22106cdcf9787969e1672d8e6a9c03a889cda9c5',
  '0x999b86e8bba3d4f05afb8155963999db70afa97f',
  '0x2d17ec6cd0af737b2ade40ea527d41ceeedc166f',
  '0x0f96e19bdc787e767ba1e8f1add0f62cbdad87c8',
  '0xa79d37ce9df9443ef4b6dec2e38a8ecd35303adc',
  '0xdc37a2b2a6a62008beee029e36153df8055a8ada',
];

@PositionTemplate()
export class BinanceSmartChainPancakeswapSyrupStakingInitContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<PancakeswapSmartChefInit> {
  groupLabel = 'Syrup Staking';
  currentBlock = 0;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapViemContractFactory) protected readonly contractFactory: PancakeswapViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pancakeswapSmartChefInit({ address, network: this.network });
  }

  async getFarmAddresses() {
    const provider = this.appToolkit.getNetworkProvider(this.network);
    this.currentBlock = await provider.getBlockNumber();

    return FARMS;
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<PancakeswapSmartChefInit>) {
    return contract.read.stakedToken();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<PancakeswapSmartChefInit>) {
    return [await contract.read.rewardToken()];
  }

  async getRewardRates({ contract }: GetDataPropsParams<PancakeswapSmartChefInit>) {
    const end = await contract.read.bonusEndBlock();
    if (Number(end) > this.currentBlock) return [0];
    return [await contract.read.rewardPerBlock()];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PancakeswapSmartChefInit>) {
    return `Earn ${getLabelFromToken(contractPosition.tokens[1])}`;
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<PancakeswapSmartChefInit>) {
    return contract.read.userInfo([address]).then(v => v[0]);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<PancakeswapSmartChefInit>) {
    return contract.read.pendingReward([address]);
  }
}
