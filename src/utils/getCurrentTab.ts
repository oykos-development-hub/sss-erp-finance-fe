import {ExtendedTab} from '../constants.ts';

export const getCurrentTab = (pathname: string, tabs: ExtendedTab[]) => {
  const name = pathname.split('/').pop();
  return tabs.find(tab => tab.routeName === name)?.id;
};
