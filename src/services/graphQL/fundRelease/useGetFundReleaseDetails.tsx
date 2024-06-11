import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {
  FundReleaseDetailsItem,
  GetFundReleaseDetailsParams,
  GetFundReleaseDetailsResponse,
} from '../../../types/graphQL/fundRelease.ts';

const useGetFundReleaseDetails = (params: GetFundReleaseDetailsParams) => {
  const [fundReleaseDetails, setFundReleaseDetails] = useState<FundReleaseDetailsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchFundReleaseDetails = async () => {
    setLoading(true);
    const response: GetFundReleaseDetailsResponse = await fetch(GraphQL.getFundReleaseDetails, params);

    if (response.spendingRelease_Get.status === 'success') {
      setFundReleaseDetails(response.spendingRelease_Get.items);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (params.year && params.month) {
      fetchFundReleaseDetails();
    }
  }, [params.year, params.month]);

  return {fundReleaseDetails, loading, refetch: fetchFundReleaseDetails};
};

export default useGetFundReleaseDetails;
