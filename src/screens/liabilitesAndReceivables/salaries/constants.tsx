import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils.ts';
import {DropdownData} from '../../../types/dropdownData.ts';
import {UserProfile} from '../../../types/graphQL/userProfiles.ts';

export const salariesOverviewTableHeads: TableHead[] = [
  // TODO change accessors to correct ones
  {title: 'Broj', accessor: 'id'},
  {
    title: 'Aktivnost',
    accessor: 'activity',
    type: 'custom',
    renderContents: (activity: DropdownData<string>) => <Typography content={activity.title} variant="bodySmall" />,
  },
  {title: 'Mjesec', accessor: 'month'},
  {
    title: 'Datum obračuna',
    accessor: 'date_of_calculation',
    type: 'custom',
    renderContents: (date: string) => <Typography content={parseDate(date)} variant="bodySmall" />,
  },
  {title: 'Neto iznos', accessor: 'net_price'},
  {title: 'Ukupni bruto', accessor: 'gross_price'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export enum AdditionalSalaryExpenseType {
  contributions = 'Doprinosi',
  taxes = 'Porezi',
  suspensions = 'Obustave',
  subtaxes = 'Prirezi',
  banks = 'Banke',
}

export function generateUsersDropdownOptions(users: UserProfile[]) {
  return users?.map(item => {
    return {
      id: item.id,
      title: item.first_name + ' ' + item.last_name,
    };
  });
}

export const mockedActivitiesDropdownOption: DropdownData<number>[] = [{id: 0, title: 'Aktivnost'}];
