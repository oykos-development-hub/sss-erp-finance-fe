import {Button, Datepicker, EyeIcon, SearchIcon, Table, Theme} from 'client-library';
import {ChangeEvent, useState} from 'react';
import {useForm} from 'react-hook-form';
import {AccountingModal} from '../../../components/accountingModal/accountingModal.tsx';
import useAppContext from '../../../context/useAppContext.ts';
import useBuildAccountingOrderForObligations from '../../../services/graphQL/accounting/useBuildAccountingOrderForObligations.ts';
import useGetObligationsForAccounting from '../../../services/graphQL/accounting/useGetObligationsForAccounting.ts';
import {DropdownData} from '../../../types/dropdownData.ts';
import {useDebounce} from '../../../utils/useDebounce.ts';
import {Controls, FilterDropdown, Filters} from '../../budget/planning/budgetList/styles.ts';
import {TypesForReceivables} from '../../liabilitesAndReceivables/receivables/constants.tsx';
import {tableHeads} from '../constants.tsx';
import {FilterInput, Header} from '../styles.tsx';
import {parseDateForBackend} from '../../../utils/dateUtils.ts';

export interface AccountingFilters {
  type?: DropdownData<string> | null;
  search?: string;
  date_of_start?: Date;
  date_of_end?: Date;
}

const initialAccountingFilterValues = {
  type: null,
  search: '',
  date_of_start: undefined,
  date_of_end: undefined,
};

const AddAccountingObligations = () => {
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
    filterValues.date_of_start ? parseDateForBackend(filterValues.date_of_start) : null,
    filterValues.date_of_end ? parseDateForBackend(filterValues.date_of_end) : null,
  );

  const {accountingOrder, loading, buildAccountingOrderForObligations} = useBuildAccountingOrderForObligations();

  const toggleModal = () => {
    setAccountingtModal(prev => !prev);
  };

  const onFilter = (value: DropdownData<string> | ChangeEvent<HTMLInputElement> | Date, name: string) => {
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
      payment_order_id: null,
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

          <Datepicker
            label="DATUM DOKUMENTA OD:"
            selected={filterValues.date_of_start ? new Date(filterValues.date_of_start) : null}
            onChange={date => onFilter(date as Date, 'date_of_start')}
          />
          <Datepicker
            label="DATUM DOKUMENTA DO:"
            selected={filterValues.date_of_end ? new Date(filterValues.date_of_end) : null}
            onChange={date => onFilter(date as Date, 'date_of_end')}
          />
        </Filters>
        <Controls>
          <Button
            content="Knjiži"
            variant="primary"
            style={{width: 130}}
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={!selectedRows.length}
          />
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

export default AddAccountingObligations;
