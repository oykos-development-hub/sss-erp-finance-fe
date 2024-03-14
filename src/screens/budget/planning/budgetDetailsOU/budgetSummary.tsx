import {Button, Table} from 'client-library';
import useAppContext from '../../../../context/useAppContext';
import useGetBudgetDetails from '../../../../services/graphQL/getBudgetDetails/useGetBudgetDetails';
import {FooterWrapper} from '../budgetList/styles';
import {budgetSummaryTableHeads} from './constants';

export interface BudgetSummaryProps {
  id?: number;
}

const BudgetSummary = ({id}: BudgetSummaryProps) => {
  const {budgetDetails} = useGetBudgetDetails({
    id: id ?? 0,
  });

  const {navigation, breadcrumbs} = useAppContext();

  return (
    <>
      <Table tableHeads={budgetSummaryTableHeads} data={budgetDetails.items} style={{marginBottom: 22}} />
      <FooterWrapper>
        <Button
          content="Nazad"
          variant="secondary"
          onClick={() => {
            navigation.navigate('/finance/budget/planning');
            breadcrumbs.remove();
          }}
        />
        <Button content="Pošalji" variant="primary" disabled onClick={() => console.log('send')} />
      </FooterWrapper>
    </>
  );
};

export default BudgetSummary;
