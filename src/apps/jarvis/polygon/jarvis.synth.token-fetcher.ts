import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { JarvisSynthTokenFetcher } from '../common/jarvis.synth.token-fetcher';

@PositionTemplate()
export class PolygonJarvisSynthTokenFetcher extends JarvisSynthTokenFetcher {
  groupLabel = 'Synths';
  poolAddresses = [
    '0x36572797cc569a74731e0738ef56e3b8ce3f309c',
    '0x30e97dc680ee97ff65b5188d34fb4ea20b38d710',
    '0x06440a2da257233790b5355322dad82c10f0389a',
    '0x8734cf40a402d4191bd4d7a64beef12e4c452def',
    '0x72e7da7c0dd3c082dfe8f22343d6ad70286e07bd',
    '0x65a7b4ff684c2d08c115d55a4b089bf4e92f5003',
    '0x36d6d1d6249fbc6ebd0fc28fd46c846fb69b9074',
    '0xaec757bf73cc1f4609a1459205835dd40b4e3f29',
    '0x7ac6515f4772fcb6eeef978f60d996b21c56089d',
    '0x25e9f976f5020f6bf2d417b231e5f414b7700e31',
    '0x63b5891895a57c31d5ec2a8a5521b6ee67700f9f',
    '0x8ae34663b4622336818e334dc42f92c41efbfa35',
    '0x166e4b3ec3f81f32f0863b9cd63621181d6bfed5',
    '0xc8442072cf1e131506eac7df33ea8910e1d5cfdd',
    '0xbe813590e1b191120f5df3343368f8a2f579514c',
    '0x874b8d8e818c79166f00b64fb161925e3e95921f',
    '0x9db17967f2c14beea791a2fd4654f8ddc11d990b',
  ];
}
