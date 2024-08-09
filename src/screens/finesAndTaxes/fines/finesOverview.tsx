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
import useDeleteFine from '../../../services/graphQL/fines/useDeleteFine.ts';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

const initialValues = {
  act_type_id: defaultDropdownOption.id,
};

const FinesOverview = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialValues);
  const [search, setSearch] = useState('');
  const [showDeleteFineModal, setShowDeleteFineModal] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const {
    navigation: {navigate},
    alert,
    contextMain: {permissions},
  } = useAppContext();

  const deletePermittedRoutes = checkActionRoutePermissions(permissions, 'delete');
  const deletePermission = deletePermittedRoutes.includes('/finance/fines-taxes/fines');

  const {fines, total, refetch, loading} = useGetFines({
    page: page,
    size: PAGE_SIZE,
    ...filters,
    search: debouncedSearch || undefined,
  });
  const {deleteFine} = useDeleteFine();

  const handleDeleteFine = async () => {
    if (!showDeleteFineModal) return;
    await deleteFine(
      showDeleteFineModal,
      () => {
        refetch();
        alert.success('Uspješno obrisano.');
      },
      () => alert.error('Greška. Brisanje nije uspjelo.'),
    );
    setShowDeleteFineModal(null);
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
            name="act_type_id"
            value={filterDropdownOptions.find(option => option.id === filters?.act_type_id)}
            onChange={(value: any) => onFilterChange(value, 'act_type_id')}
            label="VRSTA KAZNE:"
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
        isLoading={loading}
        tableHeads={tableHeadsFinesOverview}
        data={fines}
        style={{marginBottom: 22}}
        emptyMessage={'Još uvjek nema kazni'}
        onRowClick={(row: FinesOverviewItem) => navigate(`/finance/fines-taxes/fines/${row.id}`)}
        tableActions={[
          {
            name: 'delete',
            onClick: row => setShowDeleteFineModal(row.id),
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
          open={!!showDeleteFineModal}
          subTitle={'Ova kazna će biti trajno izbrisana iz sistema.'}
          onClose={() => setShowDeleteFineModal(null)}
          onConfirm={() => handleDeleteFine()}
        />
      )}
    </>
  );
};

export default FinesOverview;
