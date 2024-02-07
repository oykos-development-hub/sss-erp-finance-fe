import {Button, Divider, Modal, Pagination, SendIcon, Table, Theme, TrashIcon, Typography} from 'client-library';
import {useState} from 'react';
import {PAGE_SIZE} from '../../constants.ts';
import useAppContext from '../../context/useAppContext.ts';
import {initialBudgetFilterValues} from '../../screens/budget/budgetOverview/constants.ts';
import {BudgetOverviewFilters} from '../../screens/budget/budgetOverview/types';
import useDeleteBudget from '../../services/graphQL/deleteBudget/useDeleteBudget.ts';
import useGetBudgets from '../../services/graphQL/getBudgets/useGetBudgets.ts';
import useSendBudget from '../../services/graphQL/sendBudget/useSendBudget.ts';
import {DeleteModal} from '../../shared/deleteModal/deleteModal';
import {BudgetOverviewItem} from '../../types/graphQL/budgetOverview';
import BudgetOverviewModal from '../budgetOverviewModal/budgetOverviewModal';
import {budgetOverviewTableHeads, budgetStatus, budgetType} from './constants';
import {Controls, FilterDropdown, Filters, Header, MainTitle, OverviewBox, ScreenWrapper} from './styles';
import {getYearOptions} from '../../utils/getYearOptions.ts';

const BudgetList = () => {
  const [budgetOverviewModal, setBudgetOverviewModal] = useState(false);
  const [showDeleteModalBudgetId, setShowDeleteModalBudgetId] = useState<number | undefined>(undefined);
  const [showSendModalBudgetId, setShowSendModalBudgetId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<BudgetOverviewFilters>(initialBudgetFilterValues);

  const {budgets, refetch} = useGetBudgets({
    page,
    size: PAGE_SIZE,
    status: filterValues.status ? filterValues.status.id : '',
    type_budget: filterValues.type_budget ? filterValues.type_budget.id : '',
    year: filterValues.year ? filterValues.year.id : null,
  });

  const {deleteBudget} = useDeleteBudget();
  const {sendBudget} = useSendBudget();
  const {
    navigation: {navigate},
    alert,
    breadcrumbs,
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
        alert.success('Uspešno ste poslali budžet');
      },
      () => {
        alert.error('Došlo je do greške prilikom slanja budžeta');
      },
    );
    handleCloseSendModal();
    refetch();
  };

  const handleRedirect = (budget: BudgetOverviewItem) => {
    navigate(`/finance/budget/planning/${budget.id}/summary`);
    breadcrumbs.add({
      name: 'Summary',
      to: '/finance/budget/summary',
    });
    // navigate(`/finance/budget-create-${budget.year}`);
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const onFilter = (value: any, name: string) => {
    setFilterValues({...filterValues, [name]: name === 'search' ? value.target.value : value});
  };

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
            />
            <FilterDropdown
              label="TIP BUDŽETA:"
              options={budgetType}
              value={filterValues.type_budget}
              name="type"
              onChange={value => onFilter(value, 'type_budget')}
            />
            <FilterDropdown
              label="STATUS:"
              options={budgetStatus}
              value={filterValues.status}
              name="status"
              onChange={value => onFilter(value, 'status')}
            />
          </Filters>
          <Controls>
            <Button
              content="Novi budžet"
              variant="secondary"
              style={{width: 130}}
              onClick={() => setBudgetOverviewModal(true)}
            />
          </Controls>
        </Header>
        <Table
          tableHeads={budgetOverviewTableHeads}
          data={budgets.items}
          style={{marginBottom: 22}}
          tableActions={[
            {
              name: 'delete',
              onClick: onDelete,
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            },
            {
              name: 'send',
              onClick: onSend,
              icon: <SendIcon stroke={Theme?.palette?.gray800} />,
            },
          ]}
          onRowClick={handleRedirect}
        />
        {budgetOverviewModal && <BudgetOverviewModal onClose={() => setBudgetOverviewModal(false)} />}

        <DeleteModal
          open={!!showDeleteModalBudgetId}
          onClose={() => {
            handleCloseDeleteModal();
          }}
          handleDelete={handleDelete}
        />
        <Modal
          open={!!showSendModalBudgetId}
          onClose={handleCloseSendModal}
          width={450}
          leftButtonText="Pošalji"
          rightButtonText="Otkaži"
          content={
            <Typography
              content="Da li ste sigurni da želite da pošaljete ovaj budžet?"
              variant="bodyLarge"
              style={{fontWeight: 600}}
            />
          }
          leftButtonOnClick={() => handleSend()}
          rightButtonOnClick={() => handleCloseSendModal()}
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
