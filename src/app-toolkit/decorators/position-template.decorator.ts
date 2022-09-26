import path from 'path';

import { Injectable } from '@nestjs/common';
import { Class } from 'type-fest';

import { Network } from '~types';
import { getStack } from '~utils/stack';

export const getTemplateFragments = (filePath: string) => {
  const filename = path.basename(filePath);

  const networkFromDir = path.basename(path.dirname(filePath)) as Network;
  const appIdFromDir = path.basename(path.resolve(filePath, '..', '..'));
  const [appIdFromFile, groupIdFromFile] = filename.split('.');

  if (!Object.values(Network).includes(networkFromDir)) throw new Error('Invalid network folder name for template');
  if (appIdFromFile !== appIdFromDir) throw new Error('App ID folder/file value mismatch');

  return { network: networkFromDir, appId: appIdFromDir, groupId: groupIdFromFile };
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
