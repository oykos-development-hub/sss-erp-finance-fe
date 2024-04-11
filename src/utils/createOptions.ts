import {DropdownData} from '../types/dropdownData';

export const createOptions = (configObj: {[key: number]: string}) =>
  Object.entries(configObj).map(([key, value]) => ({id: key, title: value}));

export const createDropdownOptions = (array: any[], idKey?: string, titleKey?: string): DropdownData<number>[] => {
  if (array) {
    return array.map((object: any) => ({
      id: object[idKey ?? 'id'] as DropdownData<number>['id'],
      title: object[titleKey ?? 'title'] as DropdownData<number>['title'],
    }));
  } else return [];
};
