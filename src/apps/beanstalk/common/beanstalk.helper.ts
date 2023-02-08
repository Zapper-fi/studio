export const BEANSTALK_ADDRESS = '0xc1e088fc1323b20bcbee9bd1b9fc9546db5624c5';
export const GRAPH_URL = 'https://graph.node.bean.money/subgraphs/name/beanstalk';

export type Token = {
  address: string;
};

export const BEAN: Token = {
  address: '0xbea0000029ad1c77d3d5d23ba2d8893db9d1efab',
};
export const BEANCRV3: Token = {
  address: '0xc9c32cd16bf7efb85ff14e0c8603cc90f6f2ee49',
};
export const urBEAN: Token = {
  address: '0x1bea0050e63e05fbb5d8ba2f10cf5800b6224449',
};
export const urBEANCRV3: Token = {
  address: '0x1bea3ccd22f4ebd3d37d731ba31eeca95713716d',
};
export const CRV3: Token = {
  address: '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490',
};

export const tokens: Token[] = [BEAN, BEANCRV3, urBEAN, urBEANCRV3, CRV3];

export const whitelist: Token[] = [BEAN, BEANCRV3, urBEAN, urBEANCRV3];

export const findByAddress = (address: string) => tokens.find(t => t.address === address);

export const silos = {
  [BEAN.address]: { name: 'Bean', underlying: [BEAN] },
  [BEANCRV3.address]: { name: 'BEAN:3CRV LP', underlying: [BEAN, CRV3] },
  // [urBEAN.address]: { name: 'Unripe Bean', underlying: [BEAN] },
  // [urBEANCRV3.address]: { name: 'Unripe BEAN:3CRV LP', underlying: [BEAN, CRV3] },
};
