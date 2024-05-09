import {Button, EyeIcon, SearchIcon, Table, Theme} from 'client-library';
import {ChangeEvent, useState} from 'react';
import {AccountingModal} from '../../components/accountingModal/accountingModal.tsx';
import useAppContext from '../../context/useAppContext.ts';
import {Controls, FilterDropdown, Filters} from '../budget/planning/budgetList/styles.ts';
import {TypesForReceivables} from '../liabilitesAndReceivables/receivables/constants.tsx';
import {tableHeads} from './constants.tsx';
import {FilterInput, Header} from './styles.tsx';
import {useDebounce} from '../../utils/useDebounce.ts';
import {DropdownData} from '../../types/dropdownData.ts';
import useGetObligationsForAccounting from '../../services/graphQL/accounting/useGetObligationsForAccounting.ts';
import useBuildAccountingOrderForObligations from '../../services/graphQL/accounting/useBuildAccountingOrderForObligations.ts';
import {useForm} from 'react-hook-form';

export interface AccountingFilters {
  type?: DropdownData<string> | null;
  search?: string;
}

const initialAccountingFilterValues = {
  type: null,
  search: '',
};

const Accounting = () => {
  const {
    navigation: {navigate},
    contextMain,
    alert,
  } = useAppContext();

  const {handleSubmit} = useForm();

  const [accountingModal, setAccountingtModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [filterValues, setFilterValues] = useState<AccountingFilters>(initialAccountingFilterValues);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {obligationsForAccounting} = useGetObligationsForAccounting(
    contextMain?.organization_unit?.id,
    filterValues.type ? filterValues.type.id : null,
    debouncedSearch,
  );

  const {accountingOrder, loading, buildAccountingOrderForObligations} = useBuildAccountingOrderForObligations();

  const toggleModal = () => {
    setAccountingtModal(prev => !prev);
  };

  const onFilter = (value: DropdownData<string> | ChangeEvent<HTMLInputElement>, name: string) => {
    setFilterValues({...filterValues, [name]: value});
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onCheck = (checked: boolean, currId: number | null) => {
    if (checked && currId) {
      setSelectedRows([...selectedRows, currId]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== currId));
    }
  };

  const onSubmit = async () => {
    if (loading) return;

    const selectedItems = obligationsForAccounting.filter(item => selectedRows.includes(item.id));

    const invoiceID = selectedItems.map(item => item.invoice_id);
    const salaryID = selectedItems.map(item => item.salary_id);

    const filteredInvoice = invoiceID.filter(item => item !== null);
    const filteredSalary = salaryID.filter(item => item !== null);

    const payload = {
      date_of_booking: new Date(),
      organization_unit_id: contextMain?.organization_unit?.id,
      invoice_id: filteredInvoice,
      salary_id: filteredSalary,
    };

    buildAccountingOrderForObligations(
      payload,
      () => {
        toggleModal();
      },
      () => alert.error('Došlo je do greške. Pokušajte kasnije.'),
    );

    return;
  };

  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown
            label="VRSTA OBAVEZE:"
            options={[{id: '', title: 'Sve'}, ...TypesForReceivables]}
            name="type"
            value={filterValues.type}
            onChange={value => onFilter(value as DropdownData<string>, 'type')}
          />
          <FilterInput
            name="search"
            label="PRETRAGA:"
            onChange={onSearch}
            value={search}
            rightContent={<SearchIcon style={{marginLeft: 10, marginRight: 10}} stroke={Theme.palette.gray500} />}
          />
        </Filters>
        <Controls>
          <Button content="Knjiži" variant="primary" style={{width: 130}} size="sm" onClick={handleSubmit(onSubmit)} />
        </Controls>
      </Header>
      <Table
        tableHeads={tableHeads}
        data={obligationsForAccounting}
        style={{marginBottom: 22}}
        checkedRows={selectedRows}
        checkboxes
        onCheck={onCheck}
        tableActions={[
          {
            name: 'view',
            onClick: row => {
              if (row.type === 'invoices') {
                navigate(`/finance/liabilities-receivables/liabilities/invoices/${row.invoice_id}`);
              } else if (row.type === 'contracts') {
                navigate(`/finance/liabilities-receivables/liabilities/contracts/${row.invoice_id}`);
              } else if (row.type === 'decisions') {
                navigate(`/finance/liabilities-receivables/liabilities/decisions/${row.invoice_id}`);
              } else if (row.type === 'salaries') {
                navigate(`/finance/liabilities-receivables/liabilities/salaries/${row.salary_id}`);
              }
            },
            tooltip: () => 'Pregled',
            icon: <EyeIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />

      <AccountingModal open={accountingModal} onClose={toggleModal} data={accountingOrder} />
    </>
  );
};

export default Accounting;
