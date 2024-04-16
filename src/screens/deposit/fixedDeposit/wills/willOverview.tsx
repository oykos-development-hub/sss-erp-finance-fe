import {yupResolver} from '@hookform/resolvers/yup';
import {EditIcon, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../../../context/useAppContext';
import useDeleteWill from '../../../../services/graphQL/wills/useDeleteWill';
import useGetWills from '../../../../services/graphQL/wills/useGetWills';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal';
import {FixedDepositStatus} from '../../../../types/deposits';
import {Will} from '../../../../types/graphQL/wills';
import {optionsStringSchema} from '../../../../utils/formSchemas';
import {useDebounce} from '../../../../utils/useDebounce';
import {FilterInput} from '../../../accounting/styles';
import {FilterDropdown, Filters} from '../../../budget/planning/budgetList/styles';
import {Header} from '../../styles';
import {willStatusOptions, willTableHeads} from './constants';

const willDepositSchema = yup.object({
  status: optionsStringSchema.default(null),
  search: yup.string(),
});

type WillDepositFilterType = yup.InferType<typeof willDepositSchema>;

const WillOverview = () => {
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const {
    contextMain: {organization_unit_id},
    navigation: {navigate},
    alert,
    breadcrumbs,
  } = useAppContext();

  const {register, control, watch} = useForm<WillDepositFilterType>({
    resolver: yupResolver(willDepositSchema),
  });

  const {search, status} = watch();

  const debouncedSearch = useDebounce(search, 500);

  const {
    data: wills,
    loading,
    refetch,
  } = useGetWills({
    search: debouncedSearch,
    status: status?.title as FixedDepositStatus,
    organization_unit_id: organization_unit_id,
  });

  const {deleteWill} = useDeleteWill();

  const handleDelete = async () => {
    if (!deleteItemId) return;

    await deleteWill(
      deleteItemId,
      () => {
        refetch();
        alert.success('Uspješno obrisan testament.');
      },
      () => alert.error('Greška. Brisanje testament nije uspjelo.'),
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
                options={willStatusOptions}
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
        tableHeads={willTableHeads}
        data={wills}
        style={{marginBottom: 22}}
        isLoading={loading}
        onRowClick={(row: Will) => {
          breadcrumbs.add({name: row.case_number_si, to: `/finance/deposit/fixed/wills/${row.id}`});
          navigate(`/finance/deposit/fixed/wills/${row.id}`);
        }}
        tableActions={[
          {
            name: 'edit',
            onClick: row => {
              navigate(`/finance/deposit/fixed/wills/${row.id}`);
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
          subTitle="Da li ste sigurni da želite da izbrišete ovaj testament?"
        />
      )}
    </>
  );
};

export default WillOverview;
