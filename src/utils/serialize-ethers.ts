import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';
import _ from 'lodash';

const isPureArray = (obj: any): obj is any[] => {
  const props = Object.getOwnPropertyNames(obj);
  return _.isArray(obj) && props.every(key => key === 'length' || _.isInteger(_.toNumber(key)));
};

export const serializeEthersResult = (obj: Record<string, any>) => {
  if (isPureArray(obj)) {
    return obj.map(innerObj => serializeEthersResult(innerObj));
  } else if (_.isObject(obj) && !isBigNumberish(obj)) {
    return _.mapValues(obj, val => serializeEthersResult(val));
  } else if (_.isString(obj) || _.isBoolean(obj) || _.isNumber(obj)) {
    return obj;
  } else {
    return _.toString(obj);
  }
};
