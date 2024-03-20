import BudgetTabs from '../planning/OUBudgetSubmission/budgetSubmissionTabs.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
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
