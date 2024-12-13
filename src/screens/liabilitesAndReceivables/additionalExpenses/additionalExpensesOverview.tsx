import {Dropdown, Input, Pagination, SearchIcon, Table, Theme, Divider} from 'client-library';
import {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {PAGE_SIZE, StatusOptions} from '../../../constants';
import useAppContext from '../../../context/useAppContext';
import useAdditionalExpensesOverview from '../../../services/graphQL/additionalExpensesOverview/useAdditionalExpensesOverview';
import useGetSuppliers from '../../../services/graphQL/suppliers/useGetSuppliers';
import {DropdownData} from '../../../types/dropdownData';
import {Supplier} from '../../../types/graphQL/suppliers';
import {getYearOptions} from '../../../utils/getYearOptions';
import {useDebounce} from '../../../utils/useDebounce';
import {Row} from '../decisions/decisionsOverview/styles';
import {tableHeads} from './constants';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import SectionBox from '../../../shared/sectionBox';
import {MainTitle} from '../../accounting/styles';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import usePrependedDropdownOptions from '../../../utils/usePrependedDropdownOptions.ts';
import {checkIsAdmin} from '../../../services/checkRoutePermissions.ts';

export interface AdditionalExpensesOverviewFilters {
  year?: DropdownData<number> | null;
  status?: DropdownData<string> | null;
  search?: string;
  subject_id?: DropdownData<string> | null;
  organization_unit_id?: DropdownData<number> | null;
}

const initialAdditionalExpensesFilterValues = {
  year: null,
  status: null,
  search: '',
  subject_id: null,
  organization_unit_id: null,
};

const AdditionalExpensesOverview = () => {
  const {contextMain} = useAppContext();
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<AdditionalExpensesOverviewFilters>(
    initialAdditionalExpensesFilterValues,
  );

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {organizationUnits} = useGetOrganizationUnits({disable_filters: true});
  const isUserSSS = checkIsAdmin(contextMain?.permissions);

  const organizationUnitsFilter = (): number | undefined => {
    if (isUserSSS) {
      return filterValues.organization_unit_id ? filterValues.organization_unit_id.id : undefined;
    }
    return contextMain?.organization_unit?.id;
  };

  const {additionalExpenses, total} = useAdditionalExpensesOverview({
    page: page,
    size: PAGE_SIZE,
    status: filterValues.status ? filterValues.status.id : '',
    year: filterValues.year ? Number(filterValues.year.id) : null,
    subject_id: filterValues.subject_id ? filterValues.subject_id.id : null,
    search: debouncedSearch,
    organization_unit_id: organizationUnitsFilter(),
  });

  const onFilter = (value: DropdownData<string> | ChangeEvent<HTMLInputElement>, name: string) => {
    if ('target' in value) {
      setFilterValues({...filterValues, [name]: value.target.value});
    } else {
      setFilterValues({...filterValues, [name]: value});
    }
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (page === 1) return;
    setPage(1);
  }, [debouncedSearch, filterValues]);

  const {suppliers} = useGetSuppliers({});

  const suppliersOptions = useMemo(() => {
    const options = suppliers.map((supplier: Supplier) => ({
      id: supplier.id,
      title: supplier.title,
    }));
    options.unshift({id: 0, title: 'Svi dobavljači'});
    return options;
  }, [suppliers]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="VEZANI TROŠKOVI" />
        <Divider color="#615959" height="1px" />
        <Row>
          {isUserSSS && (
            <Dropdown
              name="organization_unit_id"
              label="ORGANIZACIONA JEDINICA:"
              placeholder="Odaberi organizacionu jedinicu"
              options={usePrependedDropdownOptions(organizationUnits, 'Sve organizacione jedinice')}
              value={filterValues.organization_unit_id}
              onChange={value => onFilter(value as DropdownData<string>, 'organization_unit_id')}
            />
          )}
          <Dropdown
            label="SUBJEKT:"
            placeholder={'Odaberi subjekt'}
            options={suppliersOptions}
            value={filterValues.subject_id}
            onChange={value => onFilter(value as DropdownData<string>, 'subject_id')}
          />
          <Dropdown
            label="GODINA:"
            options={getYearOptions(10, true, 1)}
            value={filterValues.year}
            name="year"
            onChange={value => onFilter(value as DropdownData<string>, 'year')}
            placeholder="Odaberite godinu"
          />
          <Dropdown
            name="status"
            label="STATUS:"
            placeholder="Odaberi status"
            options={StatusOptions}
            value={filterValues.status}
            onChange={value => onFilter(value as DropdownData<string>, 'status')}
          />
          <Input
            name="search"
            label="PRETRAGA:"
            placeholder="Unesi pojam"
            onChange={onSearch}
            value={search}
            rightContent={<SearchIcon style={{marginLeft: 10, marginRight: 10}} stroke={Theme.palette.gray500} />}
          />
        </Row>
        <div style={{marginTop: 20}}>
          <Table tableHeads={tableHeads} data={additionalExpenses} />
        </div>

        <Pagination
          pageCount={total ? Math.ceil(total / PAGE_SIZE) : 0}
          onChange={onPageChange}
          variant="filled"
          itemsPerPage={PAGE_SIZE}
          pageRangeDisplayed={3}
          style={{marginTop: '20px'}}
        />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default AdditionalExpensesOverview;
