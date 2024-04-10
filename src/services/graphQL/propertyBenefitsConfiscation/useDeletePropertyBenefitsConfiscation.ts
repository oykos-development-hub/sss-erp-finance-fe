import {PropertyBenefitsConfiscationResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';

const useDeletePropertyBenefitsConfiscation = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deletePropertyBenefitsConfiscation = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: PropertyBenefitsConfiscationResponse['delete'] = await fetch(
      GraphQL.deletePropertyBenefitsConfiscation,
      {id},
    );
    if (response.propertyBenefitConfiscation_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deletePropertyBenefitsConfiscation};
};

export default useDeletePropertyBenefitsConfiscation;
