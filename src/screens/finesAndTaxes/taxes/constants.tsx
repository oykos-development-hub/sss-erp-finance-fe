import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils.ts';
import {DropdownData} from '../../../types/dropdownData.ts';
import {FileItem} from '../../../types/fileUploadType.ts';

export enum Tabs {
  TaxesOverview = 1,
  AddTaxes = 2,
}
export const stockTabs = [
  {id: Tabs.TaxesOverview, title: 'Pregled taksi', routeName: 'taxes'},
  {id: Tabs.AddTaxes, title: 'Dodaj takse', routeName: 'add-taxes'},
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

export const tableHeadsTaxesOverview: TableHead[] = [
  {
    title: 'Subjekat',
    accessor: 'subject',
    type: 'text',
  },
  {
    title: 'JMBG',
    accessor: 'jmbg',
    type: 'text',
  },
  {
    title: 'Datum izvršnosti',
    accessor: 'execution_date',
    type: 'custom',
    renderContents: value => <Typography content={parseDate(value)} variant="bodyMedium" />,
  },
  {
    title: 'Broj rešenja/presude',
    accessor: 'decision_number',
    type: 'text',
  },
  {
    title: 'Konto',
    accessor: 'court_account',
    type: 'custom',
    renderContents: value => <Typography content={value?.title} variant="bodyMedium" />,
  },
  {
    title: 'Poziv na broj odobrenja',
    accessor: 'payment_reference_number',
    type: 'text',
  },
  {
    title: 'Visina takse',
    accessor: 'amount',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: value => <Typography content={value?.title} variant="bodyMedium" />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsAddTaxes: TableHead[] = [
  {
    title: 'Način plaćanja',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Iznos',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Datum uplate',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Uplatiti do',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Broj izvoda',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Poziv na broj odobrenja',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Poziv na broj zaduženja',
    accessor: '',
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export type FeeDetails = {
  fee_all_payments_amount: number;
  fee_left_to_pay_amount: number;
};

export type Fee = {
  amount: number;
  court_account: DropdownData<number>;
  created_at: string;
  debit_reference_number: string;
  decision_date: string;
  decision_number: string;
  description: string;
  execution_date: string;
  fee_details: FeeDetails;
  fee_subcategory: DropdownData<number>;
  fee_type: DropdownData<number>;
  file: FileItem[];
  id: number;
  jmbg: string;
  payment_deadline_date: string;
  payment_reference_number: string;
  residence: string;
  status: DropdownData<string>;
  subject: string;
  updated_at: string;
};
