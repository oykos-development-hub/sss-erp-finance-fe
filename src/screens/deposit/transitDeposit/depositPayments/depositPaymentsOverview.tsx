import {yupResolver} from '@hookform/resolvers/yup';
import {EditIconTwo, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../../../context/useAppContext';
import useDeleteDepositPayment from '../../../../services/graphQL/transitDeposits/useDeleteDepositPayment';
import useGetDepositPayments from '../../../../services/graphQL/transitDeposits/useGetDepositPayments';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal';
import {FixedDepositStatus} from '../../../../types/deposits';
import {FixedDeposit} from '../../../../types/graphQL/fixedDeposits';
import {optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas';
import {useDebounce} from '../../../../utils/useDebounce';
import {FilterInput} from '../../../accounting/styles';
import {FilterDropdown, Filters} from '../../../budget/planning/budgetList/styles';
import {Header} from '../../styles';
import {DepositPaymentStatusOptions, depositPaymentTableHeads} from './constants';
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import usePrependedDropdownOptions from '../../../../utils/usePrependedDropdownOptions.ts';

const depositPaymentFilterSchema = yup.object({
  status: optionsStringSchema.default(null),
  organization_unit_id: optionsNumberSchema.default(null),
  search: yup.string(),
});

type DepositPaymentFilterType = yup.InferType<typeof depositPaymentFilterSchema>;

const DepositPaymentsOverview = () => {
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const {
    contextMain: {organization_unit},
    navigation: {navigate},
    alert,
    breadcrumbs,
  } = useAppContext();

  const {register, control, watch} = useForm<DepositPaymentFilterType>({
    resolver: yupResolver(depositPaymentFilterSchema),
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

  const {data, loading, refetch} = useGetDepositPayments({
    search: debouncedSearch,
    status: status?.title as FixedDepositStatus,
    organization_unit_id: organizationUnitsFilter(),
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
                label="TIP RAČUNA:"
                options={usePrependedDropdownOptions(DepositPaymentStatusOptions, 'Svi računi')}
                onChange={onChange}
                value={value}
                name={name}
                placeholder="Odaberi tip računa"
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
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
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
