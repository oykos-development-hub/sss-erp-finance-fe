import {Pagination, PrinterIcon, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {useState} from 'react';
import {PAGE_SIZE} from '../../../constants.ts';
import useGetFines from '../../../services/graphQL/fines/useGetFines.ts';
import {useDebounce} from '../../../utils/useDebounce.ts';
import {FilterInput} from '../../accounting/styles.tsx';
import {FilterDropdown, Filters} from '../../budget/planning/budgetList/styles.ts';
import {TypeOfFines, tableHeadsFinesOverview} from './constants.tsx';
import {Header} from './styles.ts';

const initialValues = {
  act_type_id: undefined,
};

const FinesOverview = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialValues);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {fine} = useGetFines({page: page, size: PAGE_SIZE, ...filters, search: debouncedSearch});

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
            options={TypeOfFines || []}
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
        data={fine.items}
        style={{marginBottom: 22}}
        emptyMessage={'Još uvjek nema kazni'}
        tableActions={[
          {
            name: 'send',
            onClick: () => undefined,
            icon: <PrinterIcon stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'delete',
            onClick: () => undefined,
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />

      <Pagination
        pageCount={fine.total ? Math.ceil(fine.total / PAGE_SIZE) : 1}
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
