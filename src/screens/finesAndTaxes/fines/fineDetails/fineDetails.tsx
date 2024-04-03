import useAppContext from '../../../../context/useAppContext.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import {CustomDivider, MainTitle, SectionBox} from '../../../accounting/styles.tsx';
import FineForm from '../form/fineForm.tsx';
import PaymentDetails from '../paymentDetails/paymentDetails.tsx';
import useGetFines from '../../../../services/graphQL/fines/useGetFines.ts';
const FineDetails = () => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();
  const id = pathname && pathname.split('/')[pathname.split('/').length - 1];
  const {fines, refetch} = useGetFines({id});
  const fine = fines.length ? fines[0] : undefined;
  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={`Kazna: ${id}`} style={{marginBottom: 0}} />
        <CustomDivider style={{marginTop: 0}} />
        <FineForm fine={fine} />
        {fine && <PaymentDetails fine={fine} refetchFine={refetch} />}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default FineDetails;
