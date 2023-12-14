import {Pagination} from 'client-library';
import {useState} from 'react';
import {PAGE_SIZE} from '../../../constants.ts';
import {BudgetOverviewFilters} from './types.ts';
import {initialBudgetFilterValues} from './constants.ts';
import useGetBudgets from '../../../services/graphQL/getBudgets/useGetBudgets.ts';
import BudgetList from '../../../components/budgetList/budgetList.tsx';

const BudgetOverview = () => {
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<BudgetOverviewFilters>(initialBudgetFilterValues);

  const {budgets, refetch} = useGetBudgets({
    page,
    size: PAGE_SIZE,
    status: filterValues.status ? filterValues.status.id : '',
    type_budget: filterValues.type_budget ? filterValues.type_budget.id : '',
    year: filterValues.year ? filterValues.year.id : '',
  });

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const onFilter = (value: any, name: string) => {
    setFilterValues({...filterValues, [name]: name === 'search' ? value.target.value : value});
  };

  return (
    <div>
      <BudgetList refetch={refetch} tableData={budgets.items} onFilter={onFilter} filterValues={filterValues} />
      <Pagination
        pageCount={budgets.total ? Math.ceil(budgets.total / PAGE_SIZE) : 0}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={PAGE_SIZE}
        previousLabel="Previous"
        nextLabel="Next"
        pageRangeDisplayed={3}
        style={{marginTop: '20px'}}
      />
    </div>
  );
};

export default BudgetOverview;
