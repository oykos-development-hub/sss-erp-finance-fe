import {Dropdown, Theme, Table, Pagination, TrashIcon} from 'client-library';
import {Row} from './styles.ts';
import {salariesOverviewTableHeads} from '../constants.tsx';
import {useEffect, useState} from 'react';
import usePrependedDropdownOptions from '../../../../utils/usePrependedDropdownOptions.ts';
import {mockDropdownOptions, PAGE_SIZE} from '../../../../constants.ts';
import useGetSalaries from '../../../../services/graphQL/salaries/useGetSalaries.ts';
import {Salary} from '../../../../types/graphQL/salaries.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal.tsx';
import useDeleteSalary from '../../../../services/graphQL/salaries/useDeleteSalary.ts';
import {getYearOptions} from '../../../../utils/getYearOptions.ts';
import {getMonthOptions} from '../../../../utils/getMonthOptions.ts';
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import {DropdownData} from '../../../../types/dropdownData.ts';
import {checkIsAdmin} from '../../../../services/checkRoutePermissions.ts';

export interface SalariesOverviewFilters {
  organization_unit_id?: DropdownData<number> | null;
  activity_id?: DropdownData<number> | null;
  id?: DropdownData<number> | null;
  year?: DropdownData<string> | null;
  month?: DropdownData<string> | null;
}
// check if filters are correct
const initialValues = {
  organization_unit_id: undefined,
  activity_id: undefined,
  id: undefined,
  year: undefined,
  month: undefined,
};

const SalariesOverview = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialValues);
  const [showDeleteSalaryModal, setShowDeleteSalaryModal] = useState<number | null>(null);

  const {
    navigation: {navigate},
    alert,
    contextMain,
  } = useAppContext();

  const {organizationUnits} = useGetOrganizationUnits({disable_filters: true});
  const isUserSSS = checkIsAdmin(contextMain?.permissions);

  const organizationUnitsFilter = (): number | undefined => {
    if (isUserSSS) {
      return filters.organization_unit_id ? filters.organization_unit_id : undefined;
    }
    return contextMain?.organization_unit?.id;
  };

  const {salaries, total, loading, refetch} = useGetSalaries({
    page: page,
    size: PAGE_SIZE,
    ...filters,
    organization_unit_id: organizationUnitsFilter(),
  });

  const {deleteSalary} = useDeleteSalary();

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value?.id});
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (page === 1) return;
    setPage(1);
  }, [filters]);

  const handleDeleteSalary = async () => {
    if (!showDeleteSalaryModal) return;
    await deleteSalary(
      showDeleteSalaryModal,
      () => {
        refetch();
        alert.success('Uspješno obrisano.');
      },
      () => alert.error('Greška. Brisanje nije uspjelo.'),
    );
    setShowDeleteSalaryModal(null);
  };

  const dropdownYears = getYearOptions();
  const dropdownMonths = getMonthOptions();
  return (
    <>
      <Row>
        {isUserSSS && (
          <Dropdown
            name="organization_unit_id"
            label="ORGANIZACIONA JEDINICA:"
            placeholder="Odaberi organizacionu jedinicu"
            options={usePrependedDropdownOptions(organizationUnits, 'Sve organizacione jedinice')}
            value={organizationUnits.find(unit => unit.id === filters.organization_unit_id)}
            onChange={value => onFilterChange(value as DropdownData<string>, 'organization_unit_id')}
          />
        )}
        <Dropdown
          label={'AKTIVNOST:'}
          placeholder={'Odaberi aktivnost'}
          options={usePrependedDropdownOptions(mockDropdownOptions, 'Sve aktivnosti')}
          value={filters.activity_id}
          onChange={(value: any) => onFilterChange(value, 'activity_id')}
        />
        <Dropdown
          label={'GODINA:'}
          placeholder={'Odaberi godinu'}
          options={dropdownYears}
          value={dropdownYears.find(year => year.id === filters.year)}
          onChange={(value: any) => onFilterChange(value, 'year')}
        />
        <Dropdown
          label={'MJESEC:'}
          placeholder={'Odaberi mjesec'}
          options={dropdownMonths}
          value={dropdownMonths.find(month => month.id === filters.month)}
          onChange={(value: any) => onFilterChange(value, 'month')}
        />
      </Row>
      <Table
        tableHeads={salariesOverviewTableHeads}
        // data={salaries}
        data={salaries}
        emptyMessage={'Još nema zarada'}
        isLoading={loading}
        style={{marginBottom: 22}}
        onRowClick={(row: Salary) => navigate(`/finance/liabilities-receivables/liabilities/salaries/${row.id}`)}
        tableActions={[
          {
            name: 'delete',
            onClick: row => setShowDeleteSalaryModal(row.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: row => !row.registred && row.is_deletable,
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
      <ConfirmationModal
        open={!!showDeleteSalaryModal}
        subTitle={'Ova zarada će biti trajno izbrisana iz sistema.'}
        onClose={() => setShowDeleteSalaryModal(null)}
        onConfirm={() => handleDeleteSalary()}
      />
    </>
  );
};

export default SalariesOverview;
