import {DropdownData} from '../../../../types/dropdownData';

type InvoiceType = 'manual' | 'accounting';

export const invoiceTypeOptions: DropdownData<InvoiceType>[] = [
  {id: 'manual', title: 'Ručni unos'},
  {id: 'accounting', title: 'Materijalno knjigovodstvo'},
];

export const TypeOptions: DropdownData<boolean>[] = [
  {id: false, title: 'Predračun'},
  {id: true, title: 'Račun'},
];
