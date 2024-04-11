import {Pagination, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {PAGE_SIZE} from '../../../constants.ts';
import {FilterInput} from '../../accounting/styles.tsx';
import {FilterDropdown, Filters} from '../../budget/planning/budgetList/styles.ts';
import {tableHeadsFlatRateOverview} from './constants.tsx';
import {Header} from './styles.ts';
import {defaultDropdownOption, TypeOfFines} from '../fines/constants.tsx';
import {useState} from 'react';
import {useDebounce} from '../../../utils/useDebounce.ts';
import useAppContext from '../../../context/useAppContext.ts';
import useGetFlatRate from '../../../services/graphQL/flatRate/useGetFlatRate.ts';
import useDeleteFlatRate from '../../../services/graphQL/flatRate/useDeleteFlatRate.ts';
import {FlatRateOverviewItem} from '../../../types/graphQL/flatRate.ts';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';

const initialValues = {
  flat_rate_type_id: defaultDropdownOption.id,
};

const FlatRateOverview = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialValues);
  const [search, setSearch] = useState('');
  const [showDeleteFlatRateModal, setShowDeleteFlatRateModal] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const {
    navigation: {navigate},
    alert,
  } = useAppContext();

  const {flatRates, total, refetch, loading} = useGetFlatRate({
    page: page,
    size: PAGE_SIZE,
    ...filters,
    search: debouncedSearch,
  });
  const {deleteFlatRate} = useDeleteFlatRate();

  const handleDeleteFlatRate = async () => {
    if (!showDeleteFlatRateModal) return;
    await deleteFlatRate(
      showDeleteFlatRateModal,
      () => {
        refetch();
        alert.success('Uspješno obrisano.');
      },
      () => alert.error('Greška. Brisanje nije uspjelo.'),
    );
    setShowDeleteFlatRateModal(null);
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

  const filterDropdownOptions = [defaultDropdownOption, ...TypeOfFines] || [];

  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown
            name="flat_rate_type_id"
            value={filterDropdownOptions.find(option => option.id === filters?.flat_rate_type_id)}
            onChange={(value: any) => onFilterChange(value, 'flat_rate_type_id')}
            label="VRSTA PAUŠALA:"
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
        tableHeads={tableHeadsFlatRateOverview}
        data={flatRates}
        isLoading={loading}
        style={{marginBottom: 22}}
        emptyMessage={'Još uvjek nema paušala'}
        onRowClick={(row: FlatRateOverviewItem) => navigate(`/finance/fines-taxes/flat-rate/${row.id}`)}
        tableActions={[
          {
            name: 'delete',
            onClick: row => setShowDeleteFlatRateModal(row.id),
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
      <ConfirmationModal
        open={!!showDeleteFlatRateModal}
        subTitle={'Ovaj trošak postupka će biti trajno izbrisan iz sistema.'}
        onClose={() => setShowDeleteFlatRateModal(null)}
        onConfirm={() => handleDeleteFlatRate()}
      />
    </>
  );
};

export default FlatRateOverview;
