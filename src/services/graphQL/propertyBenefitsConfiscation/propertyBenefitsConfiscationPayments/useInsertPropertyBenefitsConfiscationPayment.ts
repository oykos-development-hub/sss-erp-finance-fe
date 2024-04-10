import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {PropertyBenefitsConfiscationPaymentsResponse} from '../../../../types/graphQL/response.ts';
import {GraphQL} from '../../index.ts';
import {PropertyBenefitsConfiscationPaymentForm} from '../../../../types/graphQL/propertyBenefitsConfiscation.ts';

const useInsertPropertyBenefitsConfiscationPayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertPropertyBenefitsConfiscationPayment = async (
    data: PropertyBenefitsConfiscationPaymentForm,
    onSuccess: (id: number) => void,
    onError: () => void,
  ) => {
    setLoading(true);
    const response: PropertyBenefitsConfiscationPaymentsResponse['insert'] = await fetch(
      GraphQL.insertPropertyBenefitsConfiscationPayment,
      {data},
    );
    if (response?.propertyBenefitConfiscationPayment_Insert?.status === 'success') {
      onSuccess && onSuccess(response.propertyBenefitConfiscationPayment_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertPropertyBenefitsConfiscationPayment};
};

export default useInsertPropertyBenefitsConfiscationPayment;
