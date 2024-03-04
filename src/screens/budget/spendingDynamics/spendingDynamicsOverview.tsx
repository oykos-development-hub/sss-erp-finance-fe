import BudgetTable from '../../../shared/budgetTable/budgetTable';
import {BudgetTableStep} from '../../../shared/budgetTable/types';

const SpendingDynamicsOverview = () => {
  return (
    <div style={{overflowX: 'scroll'}}>
      {/* Fixed until we have BE ready */}
      <BudgetTable step={BudgetTableStep.VIEW_MONTHLY} organizationUnitId={0} year={2024} />
    </div>
  );
};

export default SpendingDynamicsOverview;
