import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {Count} from './types/graphQL/counts';

export const PAGE_SIZE = 10;

export enum UserRole {
  ADMIN = 1,
  MANAGER_OJ = 2,
  // TODO change when new role is added to BE
  OFFICIAL_FOR_FINANCE = 88,
}

export interface ExtendedTab extends Tab {
  routeName: string;
}
export const budgetTabs: ExtendedTab[] = [
  {id: 1, title: 'Summary', routeName: 'summary', disabled: false},
  {id: 2, title: 'Financial', routeName: 'financial', disabled: false},
  {id: 3, title: 'Non-Financial', routeName: 'non-financial', disabled: false},
];

export const invoicesTabs: ExtendedTab[] = [
  {id: 1, title: 'Pregled računa', routeName: '', disabled: false},
  {id: 2, title: 'Unos računa', routeName: 'add-invoice', disabled: false},
];

export enum ScreenTitlesEnum {
  summary = 'Budžet',
  financial = 'Financial',
  'non-financial' = 'Non-Financial',
  invoices = 'Pregled računa',
  'add-invoice' = 'Unos računa',
  'add-decision' = 'Unos rešenja',
  decisions = 'Pregled rešenja',
  'add-contract' = 'Unos ugovora',
  contracts = 'Pregled ugovora',
  salaries = 'Pregled zarada',
  'add-salary' = 'Unos zarada',
  'requests' = 'Zahtjevi',
}

export const decisionTabs: ExtendedTab[] = [
  {id: 1, title: 'Pregled rešenja', routeName: '', disabled: false},
  {id: 2, title: 'Unos rešenja', routeName: 'entry', disabled: false},
];

export const contractTabs: ExtendedTab[] = [
  {id: 1, title: 'Pregled ugovora', routeName: '', disabled: false},
  {id: 2, title: 'Unos ugovora', routeName: 'entry', disabled: false},
];
export const salariesTabs: ExtendedTab[] = [
  {id: 1, title: 'Pregled zarada', routeName: '', disabled: false},
  {id: 2, title: 'Unos zarada', routeName: 'entry', disabled: false},
];

// budget tabs for finance official budget screen
export const budgetTabsForOfficial: ExtendedTab[] = [
  {id: 1, title: 'Pregled', routeName: '', disabled: false},
  {id: 2, title: 'Zahtjevi', routeName: 'entry', disabled: false},
];

// TODO remove when all dropdown data is fetched from BE
export const mockDropdownOptions = [
  {id: 1, title: 'Option 1'},
  {id: 2, title: 'Option 2'},
  {id: 3, title: 'Option 3'},
];

export const invoiceTypeOptions = [
  {id: 1, title: 'Ručni unos'},
  {id: 2, title: 'Materijalno knjigovodstvo'},
];

export const actTypeOptions = [
  {id: 1, title: 'Rješenje'},
  {id: 2, title: 'Presuda'},
];

export function generateDropdownOptions(counts: Count[]) {
  return counts?.map(item => {
    const dropdownTitle = `${item.serial_number} - ${item.title}`;

    return {
      id: item.id,
      title: dropdownTitle,
      original_title: item.title,
    };
  });
}

export const requiredError = 'Ovo polje je obavezno';

export const feeTypeOptions = [
  {id: 1, title: 'Tužba'},
  {id: 2, title: 'Presuda'},
];

export const feeSubcategoryOptions = [{id: 1, title: 'Kopiranje'}];

export const StatusOptions = [
  {id: '', title: 'Svi statusi'},
  {id: 'Kreiran', title: 'Kreiran'},
  {id: 'Djelimično na nalogu', title: 'Djelimično na nalogu'},
  {id: 'Na nalogu', title: 'Na nalogu'},
];
