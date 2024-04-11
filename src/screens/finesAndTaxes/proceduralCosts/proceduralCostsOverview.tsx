import {Pagination, SearchIcon, Table, Theme, TrashIcon} from 'client-library';
import {PAGE_SIZE} from '../../../constants.ts';
import {FilterInput} from '../../accounting/styles.tsx';
import {FilterDropdown, Filters} from '../../budget/planning/budgetList/styles.ts';
import {tableHeadsProceduralCostsOverview} from './constants.tsx';
import {Header} from './styles.ts';
import {useState} from 'react';
import {useDebounce} from '../../../utils/useDebounce.ts';
import useAppContext from '../../../context/useAppContext.ts';
import useGetProceduralCosts from '../../../services/graphQL/proceduralCosts/useGetProceduralCosts.ts';
import useDeleteProceduralCost from '../../../services/graphQL/proceduralCosts/useDeleteProceduralCost.ts';
import {defaultDropdownOption, TypeOfFines} from '../fines/constants.tsx';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';
import {ProceduralCostOverviewItem} from '../../../types/graphQL/proceduralCosts.ts';

const initialValues = {
  procedure_cost_type_id: defaultDropdownOption.id,
};

const ProceduralCostsOverview = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialValues);
  const [search, setSearch] = useState('');
  const [showDeleteProceduralCostModal, setShowDeleteProceduralCostModal] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const {
    navigation: {navigate},
    alert,
  } = useAppContext();

  const {proceduralCosts, total, refetch, loading} = useGetProceduralCosts({
    page: page,
    size: PAGE_SIZE,
    ...filters,
    search: debouncedSearch,
  });
  const {deleteProceduralCost} = useDeleteProceduralCost();

  const handleDeleteProceduralCost = async () => {
    if (!showDeleteProceduralCostModal) return;
    await deleteProceduralCost(
      showDeleteProceduralCostModal,
      () => {
        refetch();
        alert.success('Uspješno obrisano.');
      },
      () => alert.error('Greška. Brisanje nije uspjelo.'),
    );
    setShowDeleteProceduralCostModal(null);
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
            name="procedure_cost_type_id"
            value={filterDropdownOptions.find(option => option.id === filters?.procedure_cost_type_id)}
            onChange={(value: any) => onFilterChange(value, 'procedure_cost_type_id')}
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
        tableHeads={tableHeadsProceduralCostsOverview}
        data={proceduralCosts}
        isLoading={loading}
        style={{marginBottom: 22}}
        emptyMessage={'Još uvjek nema troškova postupka.'}
        onRowClick={(row: ProceduralCostOverviewItem) => navigate(`/finance/fines-taxes/procedural-costs/${row.id}`)}
        tableActions={[
          {
            name: 'delete',
            onClick: row => setShowDeleteProceduralCostModal(row.id),
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
        open={!!showDeleteProceduralCostModal}
        subTitle={'Ovaj trošak postupka će biti trajno izbrisan iz sistema.'}
        onClose={() => setShowDeleteProceduralCostModal(null)}
        onConfirm={() => handleDeleteProceduralCost()}
      />
    </>
  );
};

export default ProceduralCostsOverview;
