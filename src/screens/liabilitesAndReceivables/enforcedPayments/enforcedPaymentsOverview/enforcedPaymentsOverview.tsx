import {Button, Divider, Dropdown, EditIconTwo, Input, Pagination, SearchIcon, Table, Theme} from 'client-library';
import {ChangeEvent, useState} from 'react';
import {PAGE_SIZE} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetEnforcedPayment from '../../../../services/graphQL/enforcedPayments/useGetEnforcedPayment.ts';
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import {MainTitle} from '../../../../shared/pageElements.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../../shared/sectionBox.ts';
import {DropdownData} from '../../../../types/dropdownData.ts';
import {EnforcedPaymentItem} from '../../../../types/graphQL/enforcedPaymentTypes.ts';
import {useDebounce} from '../../../../utils/useDebounce.ts';
import {Row} from '../../decisions/decisionsOverview/styles.ts';
import {enforcedPaymentsStatusOptions, tableHeads} from '../constants.tsx';
import {ButtonOverviewWrapper, FilterWrapper, RowWrapper} from '../styles.ts';

export interface EnforcedPaymentsOverviewFilters {
  year?: DropdownData<string> | null;
  organization_unit_id?: DropdownData<number> | null;
  status?: DropdownData<string> | null;
  search?: string;
}

const initialEnforcedPaymentsFilterValues = {
  year: null,
  organization_unit_id: null,
  status: null,
  search: '',
};

const EnforcedPaymentsOverview = () => {
  const {
    navigation: {navigate},
  } = useAppContext();
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<EnforcedPaymentsOverviewFilters>(
    initialEnforcedPaymentsFilterValues,
  );

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

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
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});

  const {enforcedPayment, total} = useGetEnforcedPayment({
    page: page,
    size: PAGE_SIZE,
    status: filterValues.status ? filterValues.status.id : '',
    search: debouncedSearch,
    organization_unit_id: filterValues.organization_unit_id ? filterValues.organization_unit_id.id : null,
  });

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="PRINUDNI NALOZI ZA PLAĆANJE" />
        <Divider color="#615959" height="1px" />
        <RowWrapper>
          <Row>
            <FilterWrapper>
              <Dropdown
                label="ORGANIZACIONA JEDINICA:"
                placeholder={'Odaberite organizacionu jedinicu'}
                options={organizationUnits}
                value={filterValues.organization_unit_id}
                onChange={value => onFilter(value as DropdownData<string>, 'organization_unit_id')}
              />
            </FilterWrapper>
            <FilterWrapper>
              <Dropdown
                name="status"
                label="STATUS:"
                placeholder="Odaberi status"
                options={enforcedPaymentsStatusOptions}
                value={filterValues.status}
                onChange={value => onFilter(value as DropdownData<string>, 'status')}
              />
            </FilterWrapper>
            <FilterWrapper>
              <Input
                name="search"
                label="PRETRAGA:"
                placeholder="Unesi pojam"
                onChange={onSearch}
                value={search}
                rightContent={<SearchIcon style={{marginLeft: 10, marginRight: 10}} stroke={Theme.palette.gray500} />}
              />
            </FilterWrapper>
            <ButtonOverviewWrapper>
              <Button
                content="Kreirajte nalog za plaćanje"
                size="md"
                onClick={() =>
                  navigate('/finance/liabilities-receivables/receivables/enforced-payments/add-enforced-payment')
                }
              />
            </ButtonOverviewWrapper>
          </Row>
        </RowWrapper>

        <Table
          tableHeads={tableHeads}
          data={enforcedPayment || []}
          onRowClick={(row: EnforcedPaymentItem) =>
            row.status === 'Povraćaj' &&
            navigate(`/finance/liabilities-receivables/receivables/enforced-payments/${row.id}`)
          }
          emptyMessage={'Još nema naloga za plaćanje'}
          tableActions={[
            {
              name: 'Izmijeni',
              onClick: (row: EnforcedPaymentItem) =>
                navigate(`/finance/liabilities-receivables/receivables/enforced-payments/${row.id}`),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
              shouldRender: row => row.status !== 'Povraćaj',
            },
          ]}
        />
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

export default EnforcedPaymentsOverview;
