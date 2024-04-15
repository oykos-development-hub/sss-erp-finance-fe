export enum Tabs {
  Overview = 'overview',
  NewEntry = 'add-new',
}

export const stockTabs = [
  {id: Tabs.Overview, title: 'Pregled', routeName: 'overview'},
  {id: Tabs.NewEntry, title: 'Unos', routeName: 'add-new'},
];

export const getCurrentTab = (pathname: string) => {
  const path = pathname.split('/');
  const name = path[path.length - 1];
  return stockTabs.find(tab => tab.routeName === name)?.id;
};

export const getRouteName = (tabName: string) => {
  const tabIndex = stockTabs.findIndex(tab => tab.title === tabName);
  return stockTabs[tabIndex].routeName;
};
