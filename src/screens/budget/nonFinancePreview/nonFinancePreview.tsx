import BudgetTabs from '../../../components/budgetTabs/budgetTabs.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {Container} from '../nonFinance/styles.ts';

const NonFinancePreview = () => {
  return (
    <ScreenWrapper>
      <Container>
        <BudgetTabs />
      </Container>
    </ScreenWrapper>
  );
};

export default NonFinancePreview;
