import {yupResolver} from '@hookform/resolvers/yup';
import {EditIcon, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../../context/useAppContext.ts';
import useDeleteFixedDeposit from '../../../services/graphQL/fixedDeposits/useDeleteFixedDeposit.ts';
import useGetFixedDeposits from '../../../services/graphQL/fixedDeposits/useGetFixedDeposits.ts';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';
import {FixedDepositStatus, FixedDepositType, FixedDepositsOptions} from '../../../types/deposits.ts';
import {FixedDeposit} from '../../../types/graphQL/fixedDeposits.ts';
import {optionsStringSchema} from '../../../utils/formSchemas.ts';
import {useDebounce} from '../../../utils/useDebounce.ts';
import {FilterInput} from '../../accounting/styles.tsx';
import {FilterDropdown, Filters} from '../../budget/planning/budgetList/styles.ts';
import {tableHeads} from './financeDeposit/constants.tsx';
import {Header} from './financeDeposit/styles.tsx';

const financeDepositFilterSchema = yup.object({
  status: optionsStringSchema.default(null),
  search: yup.string(),
});

type FinancialDepositFilterType = yup.InferType<typeof financeDepositFilterSchema>;

const FixedDepositOverview = ({type}: {type: FixedDepositType}) => {
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const {
    contextMain: {organization_unit_id},
    navigation: {navigate},
    alert,
  } = useAppContext();

  const {register, control, watch} = useForm<FinancialDepositFilterType>({
    resolver: yupResolver(financeDepositFilterSchema),
  });

  const {search, status} = watch();

  const debouncedSearch = useDebounce(search, 500);

  const {data, loading, refetch} = useGetFixedDeposits({
    search: debouncedSearch,
    status: status?.title as FixedDepositStatus,
    organization_unit_id: organization_unit_id,
    type,
  });

  const {deleteFixedDeposit} = useDeleteFixedDeposit();

  const handleDelete = async () => {
    if (!deleteItemId) return;

    await deleteFixedDeposit(
      deleteItemId,
      () => {
        refetch();
        alert.success('Uspješno obrisan depozit.');
      },
      () => alert.error('Greška. Brisanje depozita nije uspjelo.'),
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
                options={FixedDepositsOptions}
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
        tableHeads={tableHeads}
        data={data.items}
        style={{marginBottom: 22}}
        isLoading={loading}
        onRowClick={(row: FixedDeposit) => {
          navigate(`/finance/deposit/fixed/financial/${row.id}`);
        }}
        tableActions={[
          {
            name: 'edit',
            onClick: row => {
              navigate(`/finance/deposit/fixed/financial/${row.id}`);
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
          subTitle="Da li ste sigurni da želite da izbrišete ovaj depozit?"
        />
      )}
    </>
  );
};

export default FixedDepositOverview;
