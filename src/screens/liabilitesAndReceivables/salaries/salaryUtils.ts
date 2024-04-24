import {Supplier} from '../../../types/graphQL/suppliers.ts';

export const getSuppliersDropdown = (suppliers: Supplier[]) => {
  return suppliers.map(supplier => {
    return {
      id: supplier.id,
      title: supplier.title,
      bank_accounts: supplier.bank_accounts,
    };
  });
};
