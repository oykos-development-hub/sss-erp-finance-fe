import {Button, Divider} from 'client-library';
import useAppContext from '../../../context/useAppContext';
import Footer from '../../../shared/footer';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import BudgetDynamicTable from './budgetDynamicTable';
import {MainTitle, SectionBox} from './styles';

const RequestNewDynamic = () => {
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
          <BudgetDynamicTable />
        </div>
        <Footer>
          <Button content="Odustani" variant="secondary" onClick={() => navigate('/finance/budget/current/requests')} />
          <Button content="Sačuvaj" variant="primary" onClick={() => console.log('click')} />
        </Footer>
      </SectionBox>
    </ScreenWrapper>
  );
};

export default RequestNewDynamic;
