import useAppContext from '../../../../context/useAppContext.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import {CustomDivider, MainTitle, SectionBox} from '../../../accounting/styles.tsx';
import FlatRateForm from '../form/flatRateForm.tsx';
import PaymentDetails from '../paymentDetails/paymentDetails.tsx';
import useGetFlatRate from '../../../../services/graphQL/flatRate/useGetFlatRate.ts';
const FlatRateDetails = () => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();
  const id = pathname && pathname.split('/')[pathname.split('/').length - 1];
  const {flatRates, refetch} = useGetFlatRate({id});
  const flatRate = flatRates.length ? flatRates[0] : undefined;
  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={`Kazna: ${id}`} style={{marginBottom: 0}} />
        <CustomDivider style={{marginTop: 0}} />
        <FlatRateForm flat_rate={flatRate} />
        {flatRate && <PaymentDetails flat_rate={flatRate} refetchFlatRate={refetch} />}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default FlatRateDetails;
