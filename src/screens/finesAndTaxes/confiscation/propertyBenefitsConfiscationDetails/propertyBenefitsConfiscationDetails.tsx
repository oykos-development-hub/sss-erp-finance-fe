import useAppContext from '../../../../context/useAppContext.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import {CustomDivider, MainTitle, SectionBox} from '../../../accounting/styles.tsx';
import PropertyBenefitsConfiscationForm from '../form/propertyBenefitsConfiscationForm.tsx';
import PaymentDetails from '../paymentDetails/paymentDetails.tsx';
import useGetPropertyBenefitsConfiscations from '../../../../services/graphQL/propertyBenefitsConfiscation/useGetPropertyBenefitsConfiscation.ts';
const PropertyBenefitsConfiscationDetails = () => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();
  const id = pathname && pathname.split('/')[pathname.split('/').length - 1];
  const {propertyBenefitsConfiscations, refetch} = useGetPropertyBenefitsConfiscations({id});
  const property_benefits_confiscation = propertyBenefitsConfiscations.length
    ? propertyBenefitsConfiscations[0]
    : undefined;
  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={`Oduzimanje imovinske koristi: ${id}`} style={{marginBottom: 0}} />
        <CustomDivider style={{marginTop: 0}} />
        <PropertyBenefitsConfiscationForm property_benefits_confiscation={property_benefits_confiscation} />
        {property_benefits_confiscation && (
          <PaymentDetails
            property_benefits_confiscation={property_benefits_confiscation}
            refetchPropertyBenefitsConfiscation={refetch}
          />
        )}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default PropertyBenefitsConfiscationDetails;
