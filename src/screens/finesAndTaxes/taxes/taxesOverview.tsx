import {Pagination, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {feeSubcategoryOptions, feeTypeOptions, PAGE_SIZE} from '../../../constants.ts';
import useGetFees from '../../../services/graphQL/fees/useGetFees.ts';
import {FilterInput} from '../../accounting/styles.tsx';
import {FilterDropdown, Filters} from '../../budget/planning/budgetList/styles.ts';
import {tableHeadsTaxesOverview} from './constants.tsx';
import {Header} from './styles.ts';
import {FinesOverviewItem} from '../../../types/graphQL/finesOverview.ts';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';
import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import useDeleteFee from '../../../services/graphQL/fees/useDeleteFee.ts';
import {useDebounce} from '../../../utils/useDebounce.ts';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';
import usePrependedDropdownOptions from '../../../utils/usePrependedDropdownOptions.ts';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import {DropdownData} from '../../../types/dropdownData.ts';
import {EditIconTwo} from '@oykos-development/devkit-react-ts-styled-components';

const initialValues = {
  fee_type_id: null,
  fee_subcategory_id: null,
  organization_unit_id: null,
};

const TaxesOverview = () => {
  const {
    navigation: {navigate},
    alert,
    contextMain: {permissions, organization_unit},
  } = useAppContext();

  const {organizationUnits} = useGetOrganizationUnits({disable_filters: true});
  const createPermittedRoutes = checkActionRoutePermissions(permissions, 'create');
  const isUserSSS = createPermittedRoutes.includes('/finance');

  const organizationUnitsFilter = (): number | undefined => {
    if (isUserSSS) {
      return filters.organization_unit_id ? filters.organization_unit_id : undefined;
    }
    return organization_unit?.id;
  };

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialValues);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {fees, refetch, total, loading} = useGetFees({
    page: page,
    size: PAGE_SIZE,
    ...filters,
    search: debouncedSearch || undefined,
    organization_unit_id: organizationUnitsFilter(),
  });
  const [showDeleteFeeModal, setShowDeleteFeeModal] = useState<number | null>(null);

  const deletePermittedRoutes = checkActionRoutePermissions(permissions, 'delete');
  const deletePermission = deletePermittedRoutes.includes('/finance/fines-taxes/taxes');
  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/finance/fines-taxes/taxes');
  // TO DO implement the logic when the BE is done
  const {deleteFee} = useDeleteFee();

  const handleDeleteFee = async () => {
    if (!showDeleteFeeModal) return;

    await deleteFee(
      showDeleteFeeModal,
      () => {
        refetch();
        alert.success('Uspješno obrisano.');
      },
      () => {
        alert.error('Greška. Brisanje nije uspjelo.');
      },
    );
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value?.id});
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const filterDropdownOptionsType = usePrependedDropdownOptions(feeTypeOptions, 'Sve vrste');
  const filterDropdownOptionsSubcategory = usePrependedDropdownOptions(feeSubcategoryOptions, 'Sve potkategorije');
  const organizationUnitOptions = usePrependedDropdownOptions(organizationUnits, 'Sve organizacione jedinice');

  return (
    <>
      <Header>
        <Filters>
          {isUserSSS && (
            <FilterDropdown
              name="organization_unit_id"
              label="ORGANIZACIONA JEDINICA:"
              placeholder="Odaberi organizacionu jedinicu"
              options={organizationUnitOptions}
              value={organizationUnitOptions.find(unit => unit.id === filters.organization_unit_id)}
              onChange={value => onFilterChange(value as DropdownData<string>, 'organization_unit_id')}
            />
          )}
          <FilterDropdown
            name="fee_type_id"
            value={filterDropdownOptionsType.find(option => option.id === filters?.fee_type_id)}
            onChange={(value: any) => onFilterChange(value, 'fee_type_id')}
            label="VRSTA TAKSE:"
            options={filterDropdownOptionsType}
          />
          <FilterDropdown
            name="fee_subcategory_id"
            value={filterDropdownOptionsSubcategory.find(option => option.id === filters?.fee_subcategory_id)}
            onChange={(value: any) => onFilterChange(value, 'fee_subcategory_id')}
            label="POTKATEGORIJA TAKSE:"
            options={filterDropdownOptionsSubcategory}
          />

          <FilterInput
            label="PRETRAGA:"
            rightContent={<SearchIcon />}
            name="search"
            onChange={onSearch}
            value={search}
          />
        </Filters>
      </Header>
      <Table
        tableHeads={tableHeadsTaxesOverview}
        data={fees}
        isLoading={loading}
        style={{marginBottom: 22}}
        emptyMessage={'Još uvjek nema taksi'}
        onRowClick={(row: FinesOverviewItem) => navigate(`/finance/fines-taxes/taxes/${row.id}`)}
        tableActions={[
          {
            name: 'edit',
            onClick: row => navigate(`/finance/fines-taxes/taxes/${row.id}`),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            shouldRender: row => updatePermission && row?.status?.title !== 'Plaćeno',
          },
          {
            name: 'delete',
            onClick: row => setShowDeleteFeeModal(row.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: row => deletePermission && row?.status?.title !== 'Plaćeno',
          },
        ]}
      />
      <Pagination
        pageCount={total ? Math.ceil(total / PAGE_SIZE) : 1}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={PAGE_SIZE}
        pageRangeDisplayed={3}
        style={{marginTop: '20px'}}
      />
      {deletePermission && (
        <ConfirmationModal
          open={!!showDeleteFeeModal}
          subTitle={'Ova taksa će biti trajno izbrisana iz sistema.'}
          onClose={() => setShowDeleteFeeModal(null)}
          onConfirm={() => handleDeleteFee()}
        />
      )}
    </>
  );
};

export default TaxesOverview;
