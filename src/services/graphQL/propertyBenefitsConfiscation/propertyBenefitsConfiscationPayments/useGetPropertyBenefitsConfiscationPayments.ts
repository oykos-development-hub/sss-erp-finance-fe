import {useEffect, useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {GraphQL} from '../../index.ts';
import {PropertyBenefitsConfiscationPaymentsResponse} from '../../../../types/graphQL/response.ts';
import {PaymentDetails} from '../../../../screens/finesAndTaxes/confiscation/paymentDetails/types.ts';

const useGetPropertyBenefitsConfiscationPayments = (property_benefits_confiscation_id: number) => {
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchPayments = async () => {
    setLoading(true);
    const response: PropertyBenefitsConfiscationPaymentsResponse['get'] = await fetch(
      GraphQL.getPropertyBenefitsConfiscationPayment,
      {
        property_benefits_confiscation_id,
      },
    );
    if (response.propertyBenefitConfiscationPayment_Overview.status === 'success') {
      setPayments(response.propertyBenefitConfiscationPayment_Overview.items);
      setTotal(response.propertyBenefitConfiscationPayment_Overview.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [property_benefits_confiscation_id]);

  return {payments, loading, total, refetch: fetchPayments};
};

export default useGetPropertyBenefitsConfiscationPayments;
