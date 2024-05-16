import {yupResolver} from '@hookform/resolvers/yup';
import {EditIcon, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../../../context/useAppContext';
import useDeleteDepositPayment from '../../../../services/graphQL/transitDeposits/useDeleteDepositPayment';
import useGetDepositPayments from '../../../../services/graphQL/transitDeposits/useGetDepositPayments';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal';
import {FixedDepositStatus} from '../../../../types/deposits';
import {FixedDeposit} from '../../../../types/graphQL/fixedDeposits';
import {optionsStringSchema} from '../../../../utils/formSchemas';
import {useDebounce} from '../../../../utils/useDebounce';
import {FilterInput} from '../../../accounting/styles';
import {FilterDropdown, Filters} from '../../../budget/planning/budgetList/styles';
import {Header} from '../../styles';
import {DepositPaymentStatusOptions, depositPaymentTableHeads} from './constants';

const depositPaymentFilterSchema = yup.object({
  status: optionsStringSchema.default(null),
  search: yup.string(),
});

type DepositPaymentFilterType = yup.InferType<typeof depositPaymentFilterSchema>;

const DepositPaymentsOverview = () => {
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const {
    contextMain: {
      organization_unit: {id: organization_unit_id},
    },
    navigation: {navigate},
    alert,
    breadcrumbs,
  } = useAppContext();

  const {register, control, watch} = useForm<DepositPaymentFilterType>({
    resolver: yupResolver(depositPaymentFilterSchema),
  });

  const {search, status} = watch();

  const debouncedSearch = useDebounce(search, 500);

  const {data, loading, refetch} = useGetDepositPayments({
    search: debouncedSearch,
    status: status?.title as FixedDepositStatus,
    organization_unit_id: organization_unit_id,
  });

  const {deleteDepositPayment} = useDeleteDepositPayment();

  const handleDelete = async () => {
    if (!deleteItemId) return;

    await deleteDepositPayment(
      deleteItemId,
      () => {
        refetch();
        alert.success('Uspješno obrisana uplata na račun.');
      },
      () => alert.error('Greška. Brisanje uplate nije uspjelo.'),
    );

    setDeleteItemId(null);
  };

  return (
    <>
      <Header>
        <Filters>
          <Controller
            control={control}
            name="status"
            render={({field: {name, value, onChange}}) => (
              <FilterDropdown
                label="STATUS:"
                options={DepositPaymentStatusOptions}
                onChange={onChange}
                value={value}
                name={name}
                placeholder="Izaberite status"
              />
            )}
          />
          <FilterInput label="PRETRAGA:" rightContent={<SearchIcon />} {...register('search')} placeholder="Pretraži" />
        </Filters>
      </Header>
      <Table
        tableHeads={depositPaymentTableHeads}
        data={data.items}
        style={{marginBottom: 22}}
        isLoading={loading}
        onRowClick={(row: FixedDeposit) => {
          breadcrumbs.add({name: row.case_number, to: `/finance/deposit/transit/payments/${row.id}`});
          navigate(`/finance/deposit/transit/payments/${row.id}`);
        }}
        tableActions={[
          {
            name: 'edit',
            onClick: row => {
              navigate(`/finance/deposit/transit/payments/${row.id}`);
            },
            icon: <EditIcon stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'delete',
            onClick: row => setDeleteItemId(row.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />
      {deleteItemId && (
        <ConfirmationModal
          open={true}
          onClose={() => setDeleteItemId(null)}
          onConfirm={handleDelete}
          subTitle="Da li ste sigurni da želite da izbrišete ovu uplatu?"
        />
      )}
    </>
  );
};

export default DepositPaymentsOverview;
