import Axios from 'axios';

import { BASE_API_URL } from '../homora-v2.constant';

const httpClient = Axios.create({
  baseURL: BASE_API_URL,
  timeout: 5000,
});

export default httpClient;
