import {Button, EyeIcon, SearchIcon, Table, Theme, Datepicker} from 'client-library';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {AccountingPaymentOrdersModal} from '../../../components/accountingPaymentOrdersModal/accountingPaymentOrdersModal.tsx';
import useAppContext from '../../../context/useAppContext.ts';
import useBuildAccountingOrderForObligations from '../../../services/graphQL/accounting/useBuildAccountingOrderForObligations.ts';
import useGetPaymentOrdersForAccounting from '../../../services/graphQL/accounting/useGetPaymentOrdersForAccounting.ts';
import {useDebounce} from '../../../utils/useDebounce.ts';
import {Controls, Filters} from '../../budget/planning/budgetList/styles.ts';
import {tableHeadsForAccountingPaymentOrders} from '../constants.tsx';
import {FilterInput, Header} from '../styles.tsx';
import {parseDateForBackend} from '../../../utils/dateUtils.ts';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

interface AccountingFilters {
  date_of_start?: Date;
  date_of_end?: Date;
}

const initialAccountingFilterValues = {
  date_of_start: undefined,
  date_of_end: undefined,
};

const AddAccountingPaymentOrder = () => {
  const {
    navigation: {navigate},
    contextMain,
    alert,
  } = useAppContext();
  const createPermittedRoutes = checkActionRoutePermissions(contextMain?.permissions, 'create');
  const createPermission = createPermittedRoutes.includes('/finance/accounting/payment-orders');

  const {handleSubmit} = useForm();
  const [filterValues, setFilterValues] = useState<AccountingFilters>(initialAccountingFilterValues);
  const [accountingModal, setAccountingtModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {paymentOrdersForAccounting} = useGetPaymentOrdersForAccounting(
    contextMain?.organization_unit?.id,
    debouncedSearch,
    filterValues.date_of_start ? parseDateForBackend(filterValues.date_of_start) : null,
    filterValues.date_of_end ? parseDateForBackend(filterValues.date_of_end) : null,
  );

  const {accountingOrder, loading, buildAccountingOrderForObligations} = useBuildAccountingOrderForObligations();

  const toggleModal = () => {
    setAccountingtModal(prev => !prev);
  };

  const onFilter = (value: Date, name: string) => {
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

    const selectedItems = paymentOrdersForAccounting.filter(item => selectedRows.includes(item.id));

    const payment_order_id = selectedItems.map(item => item.payment_order_id);

    const payload = {
      date_of_booking: new Date(),
      organization_unit_id: contextMain?.organization_unit?.id,
      payment_order_id: payment_order_id,
      invoice_id: null,
      salary_id: null,
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
        {createPermission && (
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
        )}
      </Header>
      <Table
        tableHeads={tableHeadsForAccountingPaymentOrders}
        data={paymentOrdersForAccounting}
        style={{marginBottom: 22}}
        checkedRows={selectedRows}
        checkboxes={createPermission}
        onCheck={onCheck}
        tableActions={[
          {
            name: 'view',
            onClick: row => {
              navigate(`/finance/liabilities-receivables/receivables/payment-orders/${row.payment_order_id}`);
            },
            tooltip: () => 'Pregled',
            icon: <EyeIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />

      <AccountingPaymentOrdersModal open={accountingModal} onClose={toggleModal} data={accountingOrder} />
    </>
  );
};

export default AddAccountingPaymentOrder;
