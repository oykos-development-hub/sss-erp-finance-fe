import {yupResolver} from '@hookform/resolvers/yup';
import {EditIconTwo, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../../../context/useAppContext';
import useDeleteDepositPaymentOrder from '../../../../services/graphQL/transitDeposits/useDeleteDepositPaymentOrder';
import useGetDepositPaymentOrders from '../../../../services/graphQL/transitDeposits/useGetDepositPaymentOrders';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal';
import {FixedDepositStatus} from '../../../../types/deposits';
import {FixedDeposit} from '../../../../types/graphQL/fixedDeposits';
import {optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas';
import {useDebounce} from '../../../../utils/useDebounce';
import {FilterInput} from '../../../accounting/styles';
import {FilterDropdown, Filters} from '../../../budget/planning/budgetList/styles';
import {Header} from '../../styles';
import {DepositPaymentOrderStatusOptions, depositPaymentOrderTableHeads} from './constants';
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import usePrependedDropdownOptions from '../../../../utils/usePrependedDropdownOptions.ts';

const depositPaymentOrderFilterSchema = yup.object({
  status: optionsStringSchema.default(null),
  organization_unit_id: optionsNumberSchema.default(null),
  search: yup.string(),
});

type DepositPaymentOrderFilterType = yup.InferType<typeof depositPaymentOrderFilterSchema>;

const DepositPaymentOrderOverview = () => {
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const {
    contextMain: {organization_unit},
    navigation: {navigate},
    alert,
    breadcrumbs,
  } = useAppContext();

  const {register, control, watch} = useForm<DepositPaymentOrderFilterType>({
    resolver: yupResolver(depositPaymentOrderFilterSchema),
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

  const {data, loading, refetch} = useGetDepositPaymentOrders({
    search: debouncedSearch,
    status: status?.title as FixedDepositStatus,
    organization_unit_id: organizationUnitsFilter(),
  });

  const {deleteDepositPaymentOrder} = useDeleteDepositPaymentOrder();

  const handleDelete = async () => {
    if (!deleteItemId) return;

    await deleteDepositPaymentOrder(
      deleteItemId,
      () => {
        refetch();
        alert.success('Uspješno obrisan nalog za plaćanje.');
      },
      () => alert.error('Greška. Brisanje naloga za plaćanje.'),
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
                options={usePrependedDropdownOptions(DepositPaymentOrderStatusOptions, 'Svi statusi')}
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
        tableHeads={depositPaymentOrderTableHeads}
        data={data.items}
        style={{marginBottom: 22}}
        isLoading={loading}
        onRowClick={(row: FixedDeposit) => {
          breadcrumbs.add({name: row.case_number, to: `/finance/deposit/transit/payment-orders/${row.id}`});
          navigate(`/finance/deposit/transit/payment-orders/${row.id}`);
        }}
        tableActions={[
          {
            name: 'edit',
            onClick: row => {
              navigate(`/finance/deposit/transit/payment-orders/${row.id}`);
            },
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            shouldRender: row => row.status !== 'Plaćen',
          },
          {
            name: 'delete',
            onClick: row => setDeleteItemId(row.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: row => row.status !== 'Plaćen',
          },
        ]}
      />
      {deleteItemId && (
        <ConfirmationModal
          open={true}
          onClose={() => setDeleteItemId(null)}
          onConfirm={handleDelete}
          subTitle="Da li ste sigurni da želite da izbrišete ovaj nalog za plaćanje?"
        />
      )}
    </>
  );
};

export default DepositPaymentOrderOverview;
