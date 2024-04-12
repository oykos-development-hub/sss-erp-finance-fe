import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {DropdownData} from '../../../types/dropdownData';
import {createDropdownOptions} from '../../../utils/createOptions';
import {initialOverviewData} from '../../constants';
import {GeneralSettingsResponse} from '../../../types/graphQL/generalSettings';

type GeneralSettingsParams = {
  search?: string;
  id?: number | null;
  entity?: string;
  parent_id?: number | null;
};

const useGetSettings = ({search, id, entity, parent_id}: GeneralSettingsParams) => {
  const [data, setData] = useState<GeneralSettingsResponse['get']['settingsDropdown_Overview']>(initialOverviewData);
  const [options, setOptions] = useState<DropdownData<number>[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch, graphQl} = useAppContext();

  const fetchClassTypes = async () => {
    setLoading(true);
    try {
      const response: GeneralSettingsResponse['get'] = await fetch(graphQl.getSettings, {
        search,
        id,
        entity,
        parent_id,
      });
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
  }, [search, id, parent_id]);

  return {data: data, loading, refetch: fetchClassTypes, options};
};

export default useGetSettings;
