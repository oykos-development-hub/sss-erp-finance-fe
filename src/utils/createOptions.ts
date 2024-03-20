export const createOptions = (configObj: {[key: number]: string}) =>
  Object.entries(configObj).map(([key, value]) => ({id: key, title: value}));
