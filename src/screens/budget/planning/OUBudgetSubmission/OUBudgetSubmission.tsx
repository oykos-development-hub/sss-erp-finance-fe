import BudgetSubmissionTabs from './budgetSubmissionTabs.tsx';
import {ScreenWrapper} from '../budgetList/styles.ts';
import {Container} from './styles.ts';

const OUBudgetSubmission = () => {
  return (
    <ScreenWrapper>
      <Container>
        <BudgetSubmissionTabs />
      </Container>
    </ScreenWrapper>
  );
};

export default OUBudgetSubmission;
