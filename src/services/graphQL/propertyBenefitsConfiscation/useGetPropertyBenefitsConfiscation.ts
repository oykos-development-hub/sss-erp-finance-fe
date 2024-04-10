import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {PropertyBenefitsConfiscationResponse} from '../../../types/graphQL/response';
import {
  PropertyBenefitsConfiscationOverviewItem,
  PropertyBenefitsConfiscationParams,
} from '../../../types/graphQL/propertyBenefitsConfiscation.ts';

const useGetPropertyBenefitsConfiscations = (params: PropertyBenefitsConfiscationParams) => {
  const [propertyBenefitsConfiscations, setPropertyBenefitsConfiscations] = useState<
    PropertyBenefitsConfiscationOverviewItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchPropertyBenefitsConfiscationsOverview = async () => {
    setLoading(true);
    const response: PropertyBenefitsConfiscationResponse['get'] = await fetch(
      GraphQL.propertyBenefitsConfiscationOverview,
      params,
    );

    if (response.propertyBenefitConfiscation_Overview.status === 'success') {
      setPropertyBenefitsConfiscations(response.propertyBenefitConfiscation_Overview.items);
      setTotal(response.propertyBenefitConfiscation_Overview.total || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPropertyBenefitsConfiscationsOverview();
  }, [
    params.id,
    params.page,
    params.size,
    params.search,
    params.subject,
    params.property_benefits_confiscation_type_id,
  ]);

  return {propertyBenefitsConfiscations, loading, total, refetch: fetchPropertyBenefitsConfiscationsOverview};
};

export default useGetPropertyBenefitsConfiscations;
