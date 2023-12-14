import {FooterWrapper, OverviewBox} from '../../../components/budgetList/styles.ts';
import {Table, Button} from 'client-library';
import {budgetSummaryTableHeads} from './constants';
import useGetBudgetDetails from '../../../services/graphQL/getBudgetDetails/useGetBudgetDetails.ts';
import useAppContext from '../../../context/useAppContext.ts';

export interface BudgetSummaryProps {
  id?: number;
}

const BudgetSummary = ({id}: BudgetSummaryProps) => {
  const {budgetDetails} = useGetBudgetDetails({
    id: id ?? 0,
  });

  const {navigation, breadcrumbs} = useAppContext();

  return (
    <OverviewBox>
      <Table tableHeads={budgetSummaryTableHeads} data={budgetDetails.items} style={{marginBottom: 22}} />
      <FooterWrapper>
        <Button
          content="Back"
          variant="secondary"
          onClick={() => {
            navigation.navigate('/finance/budget');
            breadcrumbs.remove();
          }}
        />
        <Button content="Send to SSS" variant="primary" disabled onClick={() => console.log('send')} />
      </FooterWrapper>
    </OverviewBox>
  );
};

export default BudgetSummary;
