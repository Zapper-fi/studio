import Axios from 'axios';
import _ from 'lodash';

export type EaseRcaVaultDetails = {
    symbol: string;
    name: string;
    address: string;
    apy: number;
};

const init = async () => {
    const endpoint = 'https://app.ease.org/api/v1/vaults';
    const ethData = await Axios.get<EaseRcaVaultDetails[]>(endpoint).then(v => v.data);
    // const ethData = data.filter(({ network }) => network === 'eth');
    const addresses = ethData.map(({ address }) => address.toLowerCase());
    const rcaAddressToDetails = _.keyBy(ethData, v => v.address.toLowerCase());
    return addresses as any;
}

init();