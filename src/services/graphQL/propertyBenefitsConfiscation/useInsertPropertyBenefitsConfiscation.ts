import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {PropertyBenefitsConfiscationResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {PropertyBenefitsConfiscationForm} from '../../../types/graphQL/propertyBenefitsConfiscation.ts';

const useInsertPropertyBenefitsConfiscation = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();
  const insertPropertyBenefitsConfiscation = async (
    data: PropertyBenefitsConfiscationForm,
    onSuccess: (id: number) => void,
    onError: () => void,
  ) => {
    setLoading(true);
    const response: PropertyBenefitsConfiscationResponse['insert'] = await fetch(
      GraphQL.insertPropertyBenefitsConfiscation,
      {data},
    );
    if (response?.propertyBenefitConfiscation_Insert?.status === 'success') {
      onSuccess && onSuccess(response.propertyBenefitConfiscation_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertPropertyBenefitsConfiscation};
};

export default useInsertPropertyBenefitsConfiscation;
