import {yupResolver} from '@hookform/resolvers/yup';
import {EditIconTwo, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../../context/useAppContext.ts';
import useDeleteFixedDeposit from '../../../services/graphQL/fixedDeposits/useDeleteFixedDeposit.ts';
import useGetFixedDeposits from '../../../services/graphQL/fixedDeposits/useGetFixedDeposits.ts';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';
import {FixedDepositStatus, FixedDepositType, FixedDepositsOptions} from '../../../types/deposits.ts';
import {FixedDeposit} from '../../../types/graphQL/fixedDeposits.ts';
import {optionsNumberSchema, optionsStringSchema} from '../../../utils/formSchemas.ts';
import {useDebounce} from '../../../utils/useDebounce.ts';
import {FilterInput} from '../../accounting/styles.tsx';
import {FilterDropdown, Filters} from '../../budget/planning/budgetList/styles.ts';
import {tableHeads} from './constants.tsx';
import {Header} from '../styles.ts';
import {checkActionRoutePermissions, checkIsAdmin} from '../../../services/checkRoutePermissions.ts';
import usePrependedDropdownOptions from '../../../utils/usePrependedDropdownOptions.ts';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';

const financeDepositFilterSchema = yup.object({
  status: optionsStringSchema.default(null),
  organization_unit_id: optionsNumberSchema.default(null),
  search: yup.string(),
});

type FinancialDepositFilterType = yup.InferType<typeof financeDepositFilterSchema>;

const FixedDepositOverview = ({type}: {type: FixedDepositType}) => {
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const {
    contextMain: {organization_unit, permissions},
    navigation: {navigate},
    alert,
    breadcrumbs,
  } = useAppContext();
  const deletePermittedRoutes = checkActionRoutePermissions(permissions, 'delete');
  const deletePermission = deletePermittedRoutes.includes('/finance/deposit/fixed');
  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/finance/deposit/fixed');

  const {register, control, watch} = useForm<FinancialDepositFilterType>({
    resolver: yupResolver(financeDepositFilterSchema),
  });

  const {search, status, organization_unit_id} = watch();

  const debouncedSearch = useDebounce(search, 500);

  const {organizationUnits} = useGetOrganizationUnits({disable_filters: true});
  const isUserSSS = checkIsAdmin(permissions);

  const organizationUnitsFilter = (): number | undefined => {
    if (isUserSSS) {
      return organization_unit_id?.id ? organization_unit_id?.id : undefined;
    }
    return organization_unit?.id;
  };

  const {data, loading, refetch} = useGetFixedDeposits({
    search: debouncedSearch,
    status: status?.title as FixedDepositStatus,
    organization_unit_id: organizationUnitsFilter(),
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
          {isUserSSS && (
            <Controller
              control={control}
              name="organization_unit_id"
              render={({field: {name, value, onChange}}) => (
                <FilterDropdown
                  label="ORGANIZACIONA JEDINICA:"
                  options={usePrependedDropdownOptions(organizationUnits, 'Sve organizacione jedinice')}
                  onChange={onChange}
                  value={value}
                  name={name}
                  placeholder="Odaberi organizacionu jedinicu"
                />
              )}
            />
          )}
          <Controller
            control={control}
            name="status"
            render={({field: {name, value, onChange}}) => (
              <FilterDropdown
                label="STATUS:"
                options={usePrependedDropdownOptions(FixedDepositsOptions, 'Svi statusi')}
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
          breadcrumbs.add({name: row.case_number, to: `/finance/deposit/fixed/${type}/${row.id}`});
          navigate(`/finance/deposit/fixed/${type}/${row.id}`);
        }}
        tableActions={[
          {
            name: 'edit',
            onClick: row => {
              navigate(`/finance/deposit/fixed/${type}/${row.id}`);
            },
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            shouldRender: () => updatePermission,
          },
          {
            name: 'delete',
            onClick: row => setDeleteItemId(row.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: () => deletePermission,
          },
        ]}
      />
      {deletePermission && deleteItemId && (
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
