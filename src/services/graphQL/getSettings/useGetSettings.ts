import {useEffect, useState} from 'react';
import {initialOverviewData} from '../../constants';
import useAppContext from '../../../context/useAppContext';
import {DropdownData} from '../../../types/dropdownData';
import {createDropdownOptions} from '../../../utils/createOptions';

export interface ClassTypesParams {
  search?: string;
  id?: number;
  entity?: string;
}

const useGetSettings = ({search, id, entity}: ClassTypesParams) => {
  const [data, setData] = useState(initialOverviewData);
  const [options, setOptions] = useState<DropdownData<number>[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch, graphQl} = useAppContext();

  const fetchClassTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch(graphQl.getSettings, {search, id, entity});
      const options = createDropdownOptions(response.settingsDropdown_Overview.items || []);
      setOptions(options);

      setData(response.settingsDropdown_Overview);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchClassTypes();
  }, [search, id]);

  return {data: data, loading, refetch: fetchClassTypes, options};
};

export default useGetSettings;
