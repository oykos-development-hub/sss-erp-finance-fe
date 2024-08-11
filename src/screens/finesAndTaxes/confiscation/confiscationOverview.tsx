import {Pagination, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {PAGE_SIZE} from '../../../constants.ts';
import {tableHeadsConfiscationOverview} from './constants.tsx';
import {Header} from './styles.ts';
import {FilterInput} from '../../accounting/styles.tsx';
import {Filters, FilterDropdown} from '../../budget/planning/budgetList/styles.ts';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';
import {ProceduralCostOverviewItem} from '../../../types/graphQL/proceduralCosts.ts';
import {useState} from 'react';
import {TypeOfFines} from '../fines/constants.tsx';
import {useDebounce} from '../../../utils/useDebounce.ts';
import useAppContext from '../../../context/useAppContext.ts';
import useGetPropertyBenefitsConfiscations from '../../../services/graphQL/propertyBenefitsConfiscation/useGetPropertyBenefitsConfiscation.ts';
import useDeletePropertyBenefitsConfiscation from '../../../services/graphQL/propertyBenefitsConfiscation/useDeletePropertyBenefitsConfiscation.ts';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';
import usePrependedDropdownOptions from '../../../utils/usePrependedDropdownOptions.ts';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import {DropdownData} from '../../../types/dropdownData.ts';

const initialValues = {
  property_benefits_confiscation_type_id: null,
  organization_unit_id: null,
};
const ConfiscationOverview = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialValues);
  const [search, setSearch] = useState('');
  const [showDeleteProceduralCostModal, setShowDeleteProceduralCostModal] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const {
    navigation: {navigate},
    alert,
    contextMain: {permissions, organization_unit},
  } = useAppContext();

  const {organizationUnits} = useGetOrganizationUnits({disable_filters: true});
  // TODO replace with logic from permissions
  const isUserSSS = organization_unit?.title === 'Sekretarijat Sudskog savjeta';

  const organizationUnitsFilter = (): number | undefined => {
    if (isUserSSS) {
      return filters.organization_unit_id ? filters.organization_unit_id : undefined;
    }
    return organization_unit?.id;
  };

  const deletePermittedRoutes = checkActionRoutePermissions(permissions, 'delete');
  const deletePermission = deletePermittedRoutes.includes('/finance/fines-taxes/confiscation');

  const {propertyBenefitsConfiscations, total, refetch, loading} = useGetPropertyBenefitsConfiscations({
    page: page,
    size: PAGE_SIZE,
    ...filters,
    organization_unit_id: organizationUnitsFilter(),
    search: debouncedSearch,
  });

  const {deletePropertyBenefitsConfiscation} = useDeletePropertyBenefitsConfiscation();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value?.id});
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const filterDropdownOptions = usePrependedDropdownOptions(TypeOfFines, 'Sve vrste');

  const handleDeleteProceduralCost = async () => {
    if (!showDeleteProceduralCostModal) return;
    await deletePropertyBenefitsConfiscation(
      showDeleteProceduralCostModal,
      () => {
        refetch();
        alert.success('Uspješno obrisano.');
      },
      () => alert.error('Greška. Brisanje nije uspjelo.'),
    );
    setShowDeleteProceduralCostModal(null);
  };

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
            name="property_benefits_confiscation_type_id"
            value={filterDropdownOptions.find(option => option.id === filters?.property_benefits_confiscation_type_id)}
            onChange={(value: any) => onFilterChange(value, 'property_benefits_confiscation_type_id')}
            label="VRSTA TROŠKOVA POSTUPKA:"
            options={filterDropdownOptions}
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
        tableHeads={tableHeadsConfiscationOverview}
        data={propertyBenefitsConfiscations}
        isLoading={loading}
        style={{marginBottom: 22}}
        emptyMessage={'Još uvjek nema podataka o oduzimanju imovine'}
        onRowClick={(row: ProceduralCostOverviewItem) => navigate(`/finance/fines-taxes/confiscation/${row.id}`)}
        tableActions={[
          {
            name: 'delete',
            onClick: row => setShowDeleteProceduralCostModal(row.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: () => deletePermission,
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
          open={!!showDeleteProceduralCostModal}
          subTitle={'Ovo oduzimanje imovinske koristi će biti trajno izbrisano iz sistema.'}
          onClose={() => setShowDeleteProceduralCostModal(null)}
          onConfirm={() => handleDeleteProceduralCost()}
        />
      )}
    </>
  );
};

export default ConfiscationOverview;
