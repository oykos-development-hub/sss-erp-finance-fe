import useAppContext from '../../../../context/useAppContext.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import {CustomDivider, MainTitle, SectionBox} from '../../../accounting/styles.tsx';
import ProceduralCostForm from '../form/proceduralCostForm.tsx';
import PaymentDetails from '../paymentDetails/paymentDetails.tsx';
import useGetProceduralCosts from '../../../../services/graphQL/proceduralCosts/useGetProceduralCosts.ts';
const ProceduralCostDetails = () => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();
  const id = pathname && pathname.split('/')[pathname.split('/').length - 1];
  const {proceduralCosts, refetch} = useGetProceduralCosts({id});
  const procedural_cost = proceduralCosts.length ? proceduralCosts[0] : undefined;
  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={`Kazna: ${id}`} style={{marginBottom: 0}} />
        <CustomDivider style={{marginTop: 0}} />
        <ProceduralCostForm procedural_cost={procedural_cost} />
        {procedural_cost && <PaymentDetails procedural_cost={procedural_cost} refetchProceduralCost={refetch} />}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default ProceduralCostDetails;
