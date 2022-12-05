import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

type UserBalanceResponse = {
  token: string;
  balance: number;
  available: number;
  locked: number;
}[];

const isAxiosError = (error: any): error is AxiosError => error.isAxiosError !== undefined;

@Injectable()
export class RhinoFiApiClient {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getUserBalances(address: string) {
    try {
      const { data } = await axios.post<UserBalanceResponse>(
        `https://api.rhino.fi/v1/trading/r/getBalanceForUser/${address}`,
      );

      return data;
    } catch (err) {
      if (isAxiosError(err) && [404, 401].includes(err.response?.status ?? 500)) {
        // 404: User is not in rhino.fi
        // 401: User can hard refresh after they enable public access
        return [];
      } else {
        throw err;
      }
    }
  }
}
