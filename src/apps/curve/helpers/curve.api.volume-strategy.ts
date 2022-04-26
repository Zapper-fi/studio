import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { CurvePoolDefinition } from '../curve.types';

type CurveApysResponse = {
  apy: {
    day: Record<string, number>;
    week: Record<string, number>;
    month: Record<string, number>;
  };
  volume: Record<string, number>;
};

@Injectable()
export class CurveApiVolumeStrategy {
  build({ statsUrl }: { statsUrl: string }) {
    let promise: Promise<CurveApysResponse> | null = null;
    let expiry: number | null = null;

    const fetchCachedVolumeData = async () => {
      if (promise && expiry && Date.now() < expiry) return promise;
      expiry = Date.now() + 30 * 1000;
      promise = Axios.get<CurveApysResponse>(statsUrl).then(v => v.data);
      return promise;
    };

    return async ({ definition, price }: { definition: CurvePoolDefinition; price: number }) => {
      const data = await fetchCachedVolumeData();
      return price * Number(data.volume[definition.queryKey ?? ''] ?? 0);
    };
  }
}
