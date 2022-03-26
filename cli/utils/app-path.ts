import path from 'path';

/**
 * Retrieve a fully formed path to a given application folder.
 * @param appId Camel case application id, which corresponds to the folder name of the app.
 * @returns path to the app
 */
export function appPath(appId: string) {
  return path.resolve('src', 'apps', appId);
}