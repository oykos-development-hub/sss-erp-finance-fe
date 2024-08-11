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
import {optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas';
import {useDebounce} from '../../../../utils/useDebounce';
import {FilterInput} from '../../../accounting/styles';
import {FilterDropdown, Filters} from '../../../budget/planning/budgetList/styles';
import {Header} from '../../styles';
import {willStatusOptions, willTableHeads} from './constants';
import {checkActionRoutePermissions} from '../../../../services/checkRoutePermissions.ts';
import usePrependedDropdownOptions from '../../../../utils/usePrependedDropdownOptions.ts';
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';

const willDepositSchema = yup.object({
  status: optionsStringSchema.default(null),
  organization_unit_id: optionsNumberSchema.default(null),
  search: yup.string(),
});

type WillDepositFilterType = yup.InferType<typeof willDepositSchema>;

const WillOverview = () => {
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const {
    contextMain: {organization_unit, permissions},
    navigation: {navigate},
    alert,
    breadcrumbs,
  } = useAppContext();
  const deletePermittedRoutes = checkActionRoutePermissions(permissions, 'delete');
  const deletePermission = deletePermittedRoutes.includes('/finance/deposit/fixed');

  const {register, control, watch} = useForm<WillDepositFilterType>({
    resolver: yupResolver(willDepositSchema),
  });

  const {search, status, organization_unit_id} = watch();

  const debouncedSearch = useDebounce(search, 500);

  const {organizationUnits} = useGetOrganizationUnits({disable_filters: true});
  // TODO replace with logic from permissions
  const isUserSSS = organization_unit?.title === 'Sekretarijat Sudskog savjeta';

  const organizationUnitsFilter = (): number | undefined => {
    if (isUserSSS) {
      return organization_unit_id?.id ? organization_unit_id?.id : undefined;
    }
    return organization_unit?.id;
  };

  const {
    data: wills,
    loading,
    refetch,
  } = useGetWills({
    search: debouncedSearch,
    status: status?.title as FixedDepositStatus,
    organization_unit_id: organizationUnitsFilter(),
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

  const organizationUnitOptions = usePrependedDropdownOptions(organizationUnits, 'Sve organizacione jedinice');

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
                  options={organizationUnitOptions}
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
                options={usePrependedDropdownOptions(willStatusOptions, 'Svi statusi')}
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
            shouldRender: () => deletePermission,
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
