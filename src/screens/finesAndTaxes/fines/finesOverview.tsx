import {Pagination, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {useState} from 'react';
import {FilterDropdown, FilterInput, Filters} from '../../../screens/budget/planning/budgetList/styles.ts';
import {PAGE_SIZE} from '../../../constants.ts';
import useGetFines from '../../../services/graphQL/fines/useGetFines.ts';
import {useDebounce} from '../../../utils/useDebounce.ts';
import {Header} from './styles.ts';
import {TypeOfFines, tableHeadsFinesOverview, defaultDropdownOption} from './constants.tsx';
import useAppContext from '../../../context/useAppContext.ts';
import {FinesOverviewItem} from '../../../types/graphQL/finesOverview.ts';

const initialValues = {
  act_type_id: undefined,
};

const FinesOverview = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialValues);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const {
    navigation: {navigate},
  } = useAppContext();

  const {fines, total} = useGetFines({page: page, size: PAGE_SIZE, ...filters, search: debouncedSearch});

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value?.id});
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown
            name="act_type_id"
            value={filters?.act_type_id}
            onChange={(value: any) => onFilterChange(value, 'act_type_id')}
            label="VRSTA KAZNE:"
            options={[defaultDropdownOption, ...TypeOfFines] || []}
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
        tableHeads={tableHeadsFinesOverview}
        data={fines}
        style={{marginBottom: 22}}
        emptyMessage={'Još uvjek nema kazni'}
        onRowClick={(row: FinesOverviewItem) => navigate(`/finance/fines-taxes/fines/${row.id}`)}
        tableActions={[
          {
            name: 'delete',
            onClick: () => {
              console.log('delete');
            },
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
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
    </>
  );
};

export default FinesOverview;
