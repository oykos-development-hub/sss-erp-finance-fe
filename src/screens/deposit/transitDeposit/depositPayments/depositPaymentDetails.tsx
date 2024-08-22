import {Divider, Theme} from 'client-library';
import useAppContext from '../../../../context/useAppContext';
import useGetDepositPayments from '../../../../services/graphQL/transitDeposits/useGetDepositPayments';
import {MainTitle} from '../../../../shared/pageElements';
import SectionBox from '../../../../shared/sectionBox';
import DepositPaymentForm from './depositPaymentForm';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper';

const DepositPaymentDetails = () => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();

  const id = pathname.split('/').pop();

  const {data: currentPayment, loading} = useGetDepositPayments({id: id ? parseInt(id) : null});

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle content={`UPLATA NA RAČUN - ${currentPayment?.items[0]?.case_number}`} />
        <Divider color={Theme?.palette?.gray200} height="1px" style={{marginBottom: 20}} />

        <DepositPaymentForm data={currentPayment?.items[0]} isLoading={loading} />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default DepositPaymentDetails;
