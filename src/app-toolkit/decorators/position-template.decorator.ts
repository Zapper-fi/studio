import path from 'path';

import { Injectable } from '@nestjs/common';
import { Class } from 'type-fest';

import { Network } from '~types';
import { getStack } from '~utils/stack';

const getTemplateFragments = (filePath: string) => {
  const basename = path.basename(filePath);
  const network = path.basename(path.dirname(filePath)) as Network;
  const [appId, groupId] = basename.split('.');

  if (!Object.values(Network).includes(network)) throw new Error('Invalid network folder name for template');
  return { network, appId, groupId };
};

export const PositionTemplate = () => {
  return (target: Class<any>) => {
    const [, , , templateFile] = getStack();

    try {
      const { appId, groupId, network } = getTemplateFragments(templateFile.getFileName());
      target.prototype.appId = appId;
      target.prototype.network = network;
      target.prototype.groupId = groupId;
    } catch (e) {
      console.error(e);
    }

    return Injectable()(target);
  };
};
