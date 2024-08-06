import {DropdownData} from '../dropdownData.ts';
import {GetResponse} from './response.ts';

export interface Activity {
  id: number;
  title: string;
  description: string;
  code: string;
  sub_program: DropdownData<number>;
  organization_unit: DropdownData<number>;
}

export type ActivitiesResponse = {
  get: {
    activities_Overview: GetResponse<Activity>;
  };
};
