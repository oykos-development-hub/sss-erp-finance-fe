import useAppContext from '../../../../context/useAppContext.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import {CustomDivider, MainTitle, SectionBox} from '../../../accounting/styles.tsx';
import FeeForm from '../form/feeForm.tsx';
import PaymentDetails from '../paymentDetails/paymentDetails.tsx';
import useGetFees from '../../../../services/graphQL/fees/useGetFees.ts';
const FeeDetails = () => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();
  const id = pathname && pathname.split('/')[pathname.split('/').length - 1];
  const {fees, refetch} = useGetFees({id});
  const fee = fees.length ? fees[0] : undefined;
  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={`Taksa: ${id}`} style={{marginBottom: 0}} />
        <CustomDivider style={{marginTop: 0}} />
        <FeeForm fee={fee} />
        {fee && <PaymentDetails fee={fee} refetchFee={refetch} />}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default FeeDetails;
