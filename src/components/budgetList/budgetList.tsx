import {useState} from 'react';
import {Button, Divider, SendIcon, TrashIcon, Table, Theme, Modal, Typography} from 'client-library';
import {Controls, FilterDropdown, Filters, Header, MainTitle, OverviewBox, ScreenWrapper} from './styles';
import {budgetOverviewTableHeads, budgetStatus, budgetType, budgetYear} from './constants';
import {BudgetOverviewFilters} from '../../screens/budget/budgetOverview/types';
import {BudgetOverviewItem} from '../../types/graphQL/budgetOverview';
import BudgetOverviewModal from '../budgetOverviewModal/budgetOverviewModal';
import {DeleteModal} from '../../shared/deleteModal/deleteModal';
import useDeleteBudget from '../../services/graphQL/deleteBudget/useDeleteBudget.ts';
import useAppContext from '../../context/useAppContext.ts';
import useSendBudget from '../../services/graphQL/sendBudget/useSendBudget.ts';

export interface BudgetListProps {
  tableData: BudgetOverviewItem[];
  filterValues: BudgetOverviewFilters;
  onFilter: (value: any, name: string) => void;
  refetch: () => void;
  id?: number;
}

const BudgetList = ({tableData, filterValues, onFilter, refetch}: BudgetListProps) => {
  const [budgetOverviewModal, setBudgetOverviewModal] = useState(false);
  const [showDeleteModalBudgetId, setShowDeleteModalBudgetId] = useState<number | undefined>(undefined);
  const [showSendModalBudgetId, setShowSendModalBudgetId] = useState<number | undefined>(undefined);
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
    navigate(`/finance/budget/${budget.id}/summary`);
    breadcrumbs.add({
      name: 'Summary',
      to: '/finance/budget/summary',
    });
    // navigate(`/finance/budget-create-${budget.year}`);
  };

  return (
    <ScreenWrapper>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content="BUDGET OVERVIEW SCREEN" />
        <Divider color="#615959" height="1px" />
        <Header>
          <Filters>
            <FilterDropdown
              label="GODINA:"
              options={budgetYear}
              value={filterValues.year}
              name="year"
              onChange={value => onFilter(value, 'year')}
              placeholder="Sve"
            />
            <FilterDropdown
              label="TIP BUDZETA:"
              options={budgetType}
              value={filterValues.type_budget}
              name="type"
              onChange={value => onFilter(value, 'type_budget')}
              placeholder="Sve"
            />
            <FilterDropdown
              label="STATUS:"
              options={budgetStatus}
              value={filterValues.status}
              name="status"
              onChange={value => onFilter(value, 'status')}
              placeholder="Sve"
            />
          </Filters>
          <Controls>
            <Button
              content="New Budget"
              variant="secondary"
              style={{width: 130}}
              onClick={() => setBudgetOverviewModal(true)}
            />
          </Controls>
        </Header>
        <Table
          tableHeads={budgetOverviewTableHeads}
          data={tableData}
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
        {budgetOverviewModal && <BudgetOverviewModal refetch={refetch} onClose={() => setBudgetOverviewModal(false)} />}

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
      </OverviewBox>
    </ScreenWrapper>
  );
};

export default BudgetList;
