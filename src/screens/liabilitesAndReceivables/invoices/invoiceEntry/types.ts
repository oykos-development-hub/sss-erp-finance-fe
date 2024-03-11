import {DropdownData} from '../../../../types/dropdownData';

type InvoiceType = 'manual' | 'accounting';

export const invoiceTypeOptions: DropdownData<InvoiceType>[] = [
  {id: 'manual', title: 'Ručni unos'},
  {id: 'accounting', title: 'Materijalno knjigovodstvo'},
];
