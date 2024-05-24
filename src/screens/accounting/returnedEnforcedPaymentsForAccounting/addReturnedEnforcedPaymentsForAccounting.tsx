import {Button, EyeIcon, SearchIcon, Table, Theme} from 'client-library';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {AccountingPaymentOrdersModal} from '../../../components/accountingPaymentOrdersModal/accountingPaymentOrdersModal.tsx';
import useAppContext from '../../../context/useAppContext.ts';
import useBuildAccountingOrderForObligations from '../../../services/graphQL/accounting/useBuildAccountingOrderForObligations.ts';
import useGetReturnedEnforcedPaymentsForAccounting from '../../../services/graphQL/accounting/useGetReturnedEnforcedPaymentsForAccounting.ts';
import {useDebounce} from '../../../utils/useDebounce.ts';
import {Controls, Filters} from '../../budget/planning/budgetList/styles.ts';
import {tableHeadsForAccountingPaymentOrders} from '../constants.tsx';
import {FilterInput, Header} from '../styles.tsx';

const AddReturnedEnforcedPaymentsForAccounting = () => {
  const {
    navigation: {navigate},
    contextMain,
    alert,
  } = useAppContext();

  const {handleSubmit} = useForm();

  const [accountingModal, setAccountingtModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {returnedEnforcedPaymentsForAccounting} = useGetReturnedEnforcedPaymentsForAccounting(
    contextMain?.organization_unit?.id,
    debouncedSearch,
  );

  const {accountingOrder, loading, buildAccountingOrderForObligations} = useBuildAccountingOrderForObligations();

  const toggleModal = () => {
    setAccountingtModal(prev => !prev);
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

    const selectedItems = returnedEnforcedPaymentsForAccounting.filter(item => selectedRows.includes(item.id));

    const return_enforced_payment_id = selectedItems.map(item => item.payment_order_id);

    const payload = {
      date_of_booking: new Date(),
      organization_unit_id: contextMain?.organization_unit?.id,
      payment_order_id: null,
      enforced_payment_id: null,
      return_enforced_payment_id: return_enforced_payment_id,
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
        tableHeads={tableHeadsForAccountingPaymentOrders}
        data={returnedEnforcedPaymentsForAccounting}
        style={{marginBottom: 22}}
        checkedRows={selectedRows}
        checkboxes
        onCheck={onCheck}
        tableActions={[
          {
            name: 'view',
            onClick: row => {
              navigate(`/finance/liabilities-receivables/receivables/enforced-payments/${row.payment_order_id}`);
            },
            tooltip: () => 'Pregled',
            icon: <EyeIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />

      <AccountingPaymentOrdersModal
        open={accountingModal}
        onClose={() => setAccountingtModal(false)}
        data={accountingOrder}
      />
    </>
  );
};

export default AddReturnedEnforcedPaymentsForAccounting;
