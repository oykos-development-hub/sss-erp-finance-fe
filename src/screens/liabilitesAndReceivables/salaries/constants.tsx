import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils.ts';
import {DropdownData} from '../../../types/dropdownData.ts';
import {UserProfile} from '../../../types/graphQL/userProfiles.ts';
import {formatCurrency} from '../../../utils/currencyUtils.ts';

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
  {
    title: 'Neto iznos',
    accessor: 'net_price',
    type: 'custom',
    renderContents: (net_price: number) => <Typography content={formatCurrency(net_price)} variant="bodySmall" />,
  },
  {
    title: 'Ukupni bruto',
    accessor: 'gross_price',
    type: 'custom',
    renderContents: (gross_price: number) => <Typography content={formatCurrency(gross_price)} variant="bodySmall" />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export enum AdditionalSalaryExpenseType {
  contributions = 'Doprinosi',
  taxes = 'Porezi',
  suspensions = 'Obustave',
  subtaxes = 'Prirezi',
  banks = 'Banke',
}

export const contributionsTitleOptions: DropdownData<string>[] = [
  {id: 'Doprinos za PIO (zaposleni)', title: 'Doprinos za PIO (zaposleni)'},
  {id: 'Doprinos za nezaposlenost (zaposleni)', title: 'Doprinos za nezaposlenost (zaposleni)'},
  {id: 'Doprinos za PIO (poslodavac)', title: 'Doprinos za PIO (poslodavac)'},
  {id: 'Doprinos za nezaposlenost (poslodavac)', title: 'Doprinos za nezaposlenost (poslodavac)'},
  {id: 'Doprinos za Fond rada', title: 'Doprinos za Fond rada'},
  {id: 'Doprinos za zdravstvo (zaposleni)', title: 'Doprinos za zdravstvo (zaposleni)'},
  {id: 'Doprinos za zdravstvo (poslodavac)', title: 'Doprinos za zdravstvo (poslodavac)'},
];

export function generateUsersDropdownOptions(users: UserProfile[]) {
  return users?.map(item => {
    return {
      id: item.id,
      title: item.first_name + ' ' + item.last_name,
    };
  });
}

export const tableHeads: TableHead[] = [
  {
    title: 'Konto troška',
    width: '200px',
    accessor: 'account_amounts',
    type: 'custom',
    renderContents: (_, row) => {
      return <Typography content={row?.account} />;
    },
  },
  {
    title: 'Ukupan iznos',
    width: '200px',
    accessor: 'account_amounts',
    type: 'custom',
    renderContents: (_, row) => <Typography content={formatCurrency(row?.amount)} />,
  },
];
