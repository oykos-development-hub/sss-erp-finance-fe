import {ExtendedTab} from '../constants';

//TODO remove any and add routeName to Tab interface in devkit
export const getRouteName = (tabName: string, tabs: ExtendedTab[]) => {
  const tabIndex = tabs.findIndex(tab => tab.title === tabName);
  return tabs[tabIndex].routeName;
};
