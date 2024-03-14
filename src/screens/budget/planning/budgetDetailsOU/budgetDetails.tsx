import BudgetTabs from '../../../../components/budgetTabs/budgetTabs.tsx';
import {ScreenWrapper} from '../budgetList/styles.ts';
import {Container} from './styles.ts';

const BudgetDetails = () => {
  return (
    <ScreenWrapper>
      <Container>
        <BudgetTabs />
      </Container>
    </ScreenWrapper>
  );
};

export default BudgetDetails;
