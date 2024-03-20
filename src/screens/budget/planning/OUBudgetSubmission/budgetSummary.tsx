import {Button, Table} from 'client-library';
import useAppContext from '../../../../context/useAppContext';
import {FooterWrapper} from '../budgetList/styles';
import {budgetSummaryTableHeads} from './constants';

export interface BudgetSummaryProps {
  id?: number;
  budgetDetails: any;
}

const BudgetSummary = ({id, budgetDetails}: BudgetSummaryProps) => {
  const {navigation, breadcrumbs} = useAppContext();

  return (
    <>
      <Table tableHeads={budgetSummaryTableHeads} data={[]} style={{marginBottom: 22}} />
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
