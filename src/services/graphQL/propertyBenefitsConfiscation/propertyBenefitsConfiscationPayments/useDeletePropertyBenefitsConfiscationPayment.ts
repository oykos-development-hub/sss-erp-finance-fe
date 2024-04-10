import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {PropertyBenefitsConfiscationPaymentsResponse} from '../../../../types/graphQL/response.ts';
import {GraphQL} from '../../index.ts';

const useDeletePropertyBenefitsConfiscationPayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deletePropertyBenefitsConfiscationPayment = async (
    id: number,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    if (loading) return;
    setLoading(true);
    const response: PropertyBenefitsConfiscationPaymentsResponse['delete'] = await fetch(
      GraphQL.deletePropertyBenefitsConfiscationPayment,
      {id},
    );
    if (response.propertyBenefitConfiscationPayment_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deletePropertyBenefitsConfiscationPayment};
};

export default useDeletePropertyBenefitsConfiscationPayment;
