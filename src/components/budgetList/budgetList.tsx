import {Button, Divider, EditIconTwo, Pagination, SendIcon, Table, Theme, TrashIcon} from 'client-library';
import {useMemo, useState} from 'react';
import {PAGE_SIZE, UserRole} from '../../constants.ts';
import useAppContext from '../../context/useAppContext.ts';
import {initialBudgetFilterValues} from '../../screens/budget/budgetOverview/constants.ts';
import {BudgetOverviewFilters} from '../../screens/budget/budgetOverview/types';
import useDeleteBudget from '../../services/graphQL/deleteBudget/useDeleteBudget.ts';
import useGetBudgets from '../../services/graphQL/getBudgets/useGetBudgets.ts';
import useSendBudget from '../../services/graphQL/sendBudget/useSendBudget.ts';
import {DeleteModal} from '../../shared/deleteModal/deleteModal';
import {NotificationsModal} from '../../shared/notifications/notificationsModal.tsx';
import {BudgetOverviewItem} from '../../types/graphQL/budgetOverview';
import {getYearOptions} from '../../utils/getYearOptions.ts';
import AddBudgetModal from '../addBudgetModal/addBudgetModal';
import {budgetOverviewTableHeads, budgetStatus, budgetTypeOptions} from './constants';
import {Controls, FilterDropdown, Filters, Header, MainTitle, OverviewBox, ScreenWrapper} from './styles';

const BudgetList = () => {
  const [addBudgetModal, setAddBudgetModal] = useState(false);
  const [showDeleteModalBudgetId, setShowDeleteModalBudgetId] = useState<number | undefined>(undefined);
  const [showSendModalBudgetId, setShowSendModalBudgetId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<BudgetOverviewFilters>(initialBudgetFilterValues);

  const {budgets, refetch} = useGetBudgets({
    page,
    size: PAGE_SIZE,
    status: filterValues.status ? filterValues.status.id : '',
    budget_type: filterValues.budget_type ? filterValues.budget_type.id : null,
    year: filterValues.year ? filterValues.year?.id : null,
  });

  const {deleteBudget} = useDeleteBudget();
  const {sendBudget} = useSendBudget();

  const {
    navigation: {navigate},
    alert,
    breadcrumbs,
    contextMain: {role_id},
  } = useAppContext();

  const onDelete = (budget: BudgetOverviewItem) => {
    setShowDeleteModalBudgetId(budget.id);
  };

  const onSend = (budget: BudgetOverviewItem) => {
    // TODO handle rest of the logic and modal
    // check if we also need confirmation modal for this
    setShowSendModalBudgetId(budget.id);
    handleSend();
  };

  const handleCloseSendModal = () => {
    setShowSendModalBudgetId(undefined);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModalBudgetId(undefined);
  };

  const handleDelete = async () => {
    if (!showDeleteModalBudgetId) return;

    await deleteBudget(
      showDeleteModalBudgetId,
      () => {
        alert.success('Uspješno ste obrisali budžet');
        refetch();
      },
      () => {
        alert.error('Došlo je do greške prilikom brisanja budžeta');
      },
    );
    setShowDeleteModalBudgetId(undefined);
  };

  const handleSend = async () => {
    if (!showSendModalBudgetId) return;

    await sendBudget(
      showSendModalBudgetId,
      () => {
        alert.success('Uspješno ste poslali budžet');
      },
      () => {
        alert.error('Došlo je do greške prilikom slanja budžeta');
      },
    );
    handleCloseSendModal();
    refetch();
  };

  const handleRedirect = (budget: BudgetOverviewItem) => {
    role_id === UserRole.ADMIN
      ? navigate(`/finance/budget/planning/${budget.id}/details`)
      : navigate(`/finance/budget/${budget.id}/summary`);

    role_id === UserRole.ADMIN
      ? breadcrumbs.add({
          name: 'Detalji',
          to: '/finance/budget/planning/details',
        })
      : breadcrumbs.add({
          name: 'Summary',
          to: '/finance/budget/summary',
        });
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const onFilter = (value: any, name: string) => {
    setFilterValues({...filterValues, [name]: name === 'search' ? value.target.value : value});
  };

  const availableYearsForBudget = useMemo(() => {
    const years = getYearOptions(6, false, 5);

    const existingBudgetYears = budgets.items?.map(budget => budget.year) || [];
    const filteredYears = years.filter(year => !existingBudgetYears.includes(Number(year.id)));

    return filteredYears;
  }, [budgets.items]);

  return (
    <ScreenWrapper>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content="PREGLED BUDŽETA" />
        <Divider color="#615959" height="1px" />
        <Header>
          <Filters>
            <FilterDropdown
              label="GODINA:"
              options={getYearOptions(7, true, 1)}
              value={filterValues.year}
              name="year"
              onChange={value => onFilter(value, 'year')}
              placeholder="Odaberite godinu"
            />
            <FilterDropdown
              label="TIP BUDŽETA:"
              options={budgetTypeOptions}
              value={filterValues.budget_type}
              name="type"
              onChange={value => onFilter(value, 'budget_type')}
              placeholder="Odaberite tip"
            />
            <FilterDropdown
              label="STATUS:"
              options={budgetStatus}
              value={filterValues.status}
              name="status"
              onChange={value => onFilter(value, 'status')}
              placeholder="Odaberite status"
            />
          </Filters>
          <Controls>
            <Button
              content="Novi budžet"
              variant="secondary"
              style={{width: 130}}
              onClick={() => setAddBudgetModal(true)}
            />
          </Controls>
        </Header>
        <Table
          tableHeads={budgetOverviewTableHeads}
          data={budgets.items}
          style={{marginBottom: 22}}
          tableActions={[
            {
              name: 'Pošalji',
              onClick: onSend,
              icon: <SendIcon stroke={Theme?.palette?.gray800} />,
              shouldRender: row => row.status === 'Kreiran',
            },
            {
              name: 'Izmijeni',
              onClick: row => navigate(`/finance/${row.budget_type}/budget-create-${row.year}/${row.id}`),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
              shouldRender: row => row.status === 'Kreiran',
            },
            {
              name: 'Izbriši',
              onClick: onDelete,
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
              shouldRender: row => row.status !== 'Obradi',
            },
          ]}
          onRowClick={row => row.status !== 'Kreiran' && handleRedirect(row)}
        />
        {addBudgetModal && (
          <AddBudgetModal onClose={() => setAddBudgetModal(false)} availableYearsForBudget={availableYearsForBudget} />
        )}

        <DeleteModal
          open={!!showDeleteModalBudgetId}
          onClose={() => {
            handleCloseDeleteModal();
          }}
          handleDelete={handleDelete}
        />

        <NotificationsModal
          open={!!showSendModalBudgetId}
          onClose={handleCloseSendModal}
          handleRightButtomClick={() => handleSend()}
          subTitle={'Ovaj budžet će biti poslat organizacionim jedinicama na pregled i popunjavanje.'}
        />
        <Pagination
          pageCount={budgets.total ? Math.ceil(budgets.total / PAGE_SIZE) : 0}
          onChange={onPageChange}
          variant="filled"
          itemsPerPage={PAGE_SIZE}
          pageRangeDisplayed={3}
          style={{marginTop: '20px'}}
        />
      </OverviewBox>
    </ScreenWrapper>
  );
};

export default BudgetList;
