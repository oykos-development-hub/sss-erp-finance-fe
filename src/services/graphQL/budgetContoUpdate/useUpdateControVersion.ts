import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {UpdateControVersionResponse, UpdateControVersionResponseData} from '../../../types/graphQL/budget.ts';
import {QueryOptions} from '../../../types/queries.ts';
import {ResponseStatus} from '../../../types/response.ts';
import updateContoVersionMutation from './updateContoVersion.ts';

const useUpdateContoVersion = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const updateContoVersion = async (id: number, opts?: QueryOptions<UpdateControVersionResponseData>) => {
    if (loading) return;
    setLoading(true);
    const response: UpdateControVersionResponse = await fetch(updateContoVersionMutation, {id});
    if (response.financialBudgetVersion_Update.status === ResponseStatus.Success) {
      opts?.onSuccess && opts.onSuccess(response.financialBudgetVersion_Update.item);
    } else {
      opts?.onError && opts.onError(response.financialBudgetVersion_Update.item);
    }

    setLoading(false);
  };

  return {loading, updateContoVersion};
};

export default useUpdateContoVersion;
