import inquirer from 'inquirer';

import { AppTag } from '../../src/app/app.interface';
import { Network } from '../../src/types/network.interface';

export const promptAppName = async () => {
  return inquirer
    .prompt<{ name: string }>({
      name: 'name',
      message: 'What is the name of your app?',
    })
    .then(v => v.name);
};

export const promptAppId = async (defaultId?: string) => {
  return inquirer
    .prompt<{ id: string }>({
      name: 'id',
      message: 'What is the ID of your app?',
      default: defaultId,
      validate: v => {
        if (v.length === 0) return 'ID is required';
        if (!/[a-z0-9]+(?:-[a-z0-9]+)*/.test(v)) return 'ID must be kebab-case';
        return true;
      },
    })
    .then(v => v.id);
};

export const promptAppDescription = async () => {
  return inquirer
    .prompt<{ description: string }>({
      name: 'description',
      message: 'What is the description of your app?',
    })
    .then(v => v.description);
};

export const promptAppUrl = async () => {
  return inquirer
    .prompt<{ url: string }>({
      name: 'url',
      message: 'What is the URL of your app?',
    })
    .then(v => v.url);
};

export const promptAppTags = async () => {
  return inquirer
    .prompt<{ tags: AppTag[] }>({
      name: 'tags',
      message: 'Select (at least one) tag representing your app',
      type: 'checkbox',
      choices: Object.values(AppTag).map(name => ({ name })),
      validate: v => {
        if (v.length === 0) return 'At least one network is required';
        return true;
      },
    })
    .then(v => v.tags);
};

export const promptAppNetworks = async () => {
  return inquirer
    .prompt<{ networks: Network[] }>({
      name: 'networks',
      message: 'Select (at least one) network supported by the app',
      type: 'checkbox',
      choices: Object.values(Network)
        .filter(v => v !== Network.BITCOIN_MAINNET)
        .map(name => ({ name })),
      validate: v => {
        if (v.length === 0) return 'At least one network is required';
        return true;
      },
    })
    .then(v => v.networks);
};
