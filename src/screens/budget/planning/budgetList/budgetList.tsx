import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Divider, EditIconTwo, Pagination, SendIcon, Table, Theme, TrashIcon} from 'client-library';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {PAGE_SIZE, UserRole} from '../../../../constants';
import useAppContext from '../../../../context/useAppContext';
import useDeleteBudget from '../../../../services/graphQL/deleteBudget/useDeleteBudget';
import useGetBudgets from '../../../../services/graphQL/getBudgets/useGetBudgets';
import useSendBudget from '../../../../services/graphQL/sendBudget/useSendBudget';
import {DeleteModal} from '../../../../shared/deleteModal/deleteModal';
import {NotificationsModal} from '../../../../shared/notifications/notificationsModal';
import {BudgetStatusOptions} from '../../../../types/config';
import {BudgetOverviewItem} from '../../../../types/graphQL/budgetOverview';
import {optionsNumberSchema} from '../../../../utils/formSchemas';
import {getYearOptions} from '../../../../utils/getYearOptions';
import {budgetListTableHeads, budgetTypeFilterOptions} from './constants';
import {Controls, FilterDropdown, Filters, Header, MainTitle, OverviewBox, ScreenWrapper} from './styles';

/*
 * This is a component used to show a list of budgets for both SSS official and managers of OUs.
 * Navigation is different for each role as well as the actions that can be performed on the budget.
 * The button for adding a new budget is only visible for the SSS officials.
 */

const budgetListSchema = yup.object().shape({
  year: optionsNumberSchema.nullable(),
  budget_type: optionsNumberSchema.nullable(),
  status: optionsNumberSchema.nullable(),
});

type BudgetListFilters = yup.InferType<typeof budgetListSchema>;

const BudgetList = () => {
  const [showDeleteModalBudgetId, setShowDeleteModalBudgetId] = useState<number | undefined>(undefined);
  const [showSendModalBudgetId, setShowSendModalBudgetId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  const {control, watch} = useForm<BudgetListFilters>({
    resolver: yupResolver(budgetListSchema),
  });

  const {year, budget_type, status} = watch();

  const {budgets, refetch} = useGetBudgets({
    page,
    size: PAGE_SIZE,
    status: status ? status.id : null,
    budget_type: budget_type ? budget_type?.id : null,
    year: year ? year?.id : null,
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

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const onRowClick = (row: BudgetOverviewItem) => {
    if (role_id === UserRole.ADMIN) {
      navigate(`/finance/budget/planning/${row.id}`);
      breadcrumbs.add({
        name: 'Detalji',
        to: `/finance/budget/planning/${row.id}`,
      });
    } else {
      navigate(`/finance/budget/planning/${row.id}/summary`);
      breadcrumbs.add({
        name: 'Summary',
        to: `/finance/budget/planning/${row.id}/summary`,
      });
    }
  };

  return (
    <ScreenWrapper>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content="PREGLED BUDŽETA" />
        <Divider color="#615959" height="1px" />
        <Header>
          <Filters>
            <Controller
              control={control}
              name="year"
              render={({field: {name, onChange, value}}) => (
                <FilterDropdown
                  label="GODINA:"
                  options={getYearOptions(7, true, 1)}
                  value={value}
                  name={name}
                  onChange={onChange}
                  placeholder="Odaberite godinu"
                />
              )}
            />
            <Controller
              control={control}
              name="budget_type"
              render={({field: {name, onChange, value}}) => (
                <FilterDropdown
                  label="TIP BUDŽETA:"
                  options={budgetTypeFilterOptions}
                  value={value}
                  name={name}
                  onChange={onChange}
                  placeholder="Odaberite tip"
                />
              )}
            />
            <Controller
              control={control}
              name="status"
              render={({field: {name, onChange, value}}) => (
                <FilterDropdown
                  label="STATUS:"
                  options={BudgetStatusOptions}
                  value={value}
                  name={name}
                  onChange={onChange}
                  placeholder="Odaberite status"
                />
              )}
            />
          </Filters>
          <Controls>
            {role_id === UserRole.ADMIN && (
              <Button
                content="Novi budžet"
                variant="secondary"
                style={{width: 130}}
                onClick={() => navigate('/finance/budget/planning/add-new')}
              />
            )}
          </Controls>
        </Header>
        <Table
          tableHeads={budgetListTableHeads}
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
          onRowClick={row => onRowClick(row)}
        />
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
