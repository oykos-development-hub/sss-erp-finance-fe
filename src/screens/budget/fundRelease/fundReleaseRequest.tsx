import {Button, Divider} from 'client-library';
import {useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import BudgetTable from '../../../shared/budgetTable/budgetTable';
import {BudgetTableStep} from '../../../shared/budgetTable/types';
import Footer from '../../../shared/footer';
import {NotificationsModal} from '../../../shared/notifications/notificationsModal';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {MainTitle, SectionBox} from './styles';

const FundReleaseRequest = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    navigation: {navigate},
  } = useAppContext();

  const toogleModal = () => setIsOpen(prev => !prev);

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="ZAHTJEV ZA OTPUŠTANJE SREDSTAVA" />
        <Divider color="#615959" height="1px" />

        <div>
          {/* Fixed until we have BE ready */}
          <BudgetTable step={BudgetTableStep.REQUEST_FUND_RELEASE} organizationUnitId={0} year={2024} />
        </div>

        <Footer>
          <Button
            content="Odustani"
            variant="secondary"
            onClick={() => navigate('/finance/budget/current/fund-release')}
          />
          <Button content="Sačuvaj" variant="primary" onClick={() => toogleModal()} />
        </Footer>

        {isOpen && (
          <NotificationsModal
            open={isOpen}
            onClose={toogleModal}
            subTitle={
              /* TO DO add total amount instead of ______ */
              'Da li želite kreirati zahtjev za otpuštanje sredstava u ukupnom iznosu _____'
            }
            handleRightButtomClick={() => {
              'TO DO add logic whan BE is ready';
            }}
          />
        )}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default FundReleaseRequest;
