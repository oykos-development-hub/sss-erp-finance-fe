import {Button, Divider} from 'client-library';
import Footer from '../../../shared/footer';
import useAppContext from '../../../context/useAppContext';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {MainTitle, SectionBox} from './styles';
import BudgetTable from '../../../shared/budgetTable/budgetTable';
import {BudgetTableStep} from '../../../shared/budgetTable/types';

const RequestDynamics = () => {
  const {
    navigation: {navigate},
  } = useAppContext();

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="IZMJENA DINAMIKE" />
        <Divider color="#615959" height="1px" />
        <div style={{overflowX: 'scroll'}}>
          {/* Fixed until we have BE ready */}
          <BudgetTable step={BudgetTableStep.VIEW_MONTHLY_WITH_EDIT} organizationUnitId={0} year={2024} />
        </div>
        <Footer>
          <Button content="Odustani" variant="secondary" onClick={() => navigate('/finance/budget/current/requests')} />
          <Button content="Sačuvaj" variant="primary" onClick={() => console.log('click')} />
        </Footer>
      </SectionBox>
    </ScreenWrapper>
  );
};

export default RequestDynamics;
