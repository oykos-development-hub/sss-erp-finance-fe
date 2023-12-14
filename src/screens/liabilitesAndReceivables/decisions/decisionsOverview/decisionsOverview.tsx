import {Row} from './styles.ts';
import {Dropdown, Input, SearchIcon, Theme, Table} from 'client-library';
import {decisionsOverviewTableHeads} from '../constants.tsx';
import {useEffect, useState, ChangeEvent} from 'react';
import {useDebounce} from '../../../../utils/useDebounce.ts';
import {mockDropdownOptions} from '../../../../constants.ts';
import {DropdownData} from '../../../../types/dropdownData.ts';
import usePrependedDropdownOptions from '../../../../utils/usePrependedDropdownOptions.ts';

const DecisionsOverview = () => {
  const [filterValues, setFilterValues] = useState({
    subject: null,
    year: null,
    status: null,
    search: '',
  });

  const onFilter = (value: DropdownData<string> | ChangeEvent<HTMLInputElement>, name: string) => {
    if ('target' in value) {
      setFilterValues({...filterValues, [name]: value.target.value});
    } else {
      setFilterValues({...filterValues, [name]: value});
    }
  };

  const debouncedFilterValues = useDebounce(filterValues, 300);

  useEffect(() => {
    //TODO add logic for fetching data
    console.log(debouncedFilterValues);
  }, [debouncedFilterValues]);

  return (
    <>
      <Row>
        <Dropdown
          label={'SUBJEKT:'}
          placeholder={'Odaberi subjekt'}
          options={usePrependedDropdownOptions(mockDropdownOptions)}
          value={filterValues.subject}
          onChange={value => onFilter(value as DropdownData<string>, 'subject')}
        />
        <Dropdown
          label={'GODINA:'}
          placeholder={'Odaberi godinu'}
          options={usePrependedDropdownOptions(mockDropdownOptions)}
          value={filterValues.year}
          onChange={value => onFilter(value as DropdownData<string>, 'year')}
        />
        <Dropdown
          label={'STATUS:'}
          placeholder={'Odaberi status'}
          options={usePrependedDropdownOptions(mockDropdownOptions)}
          value={filterValues.status}
          onChange={value => onFilter(value as DropdownData<string>, 'status')}
        />
        <Input
          label={'PRETRAGA:'}
          placeholder={'Unesi pojam'}
          value={filterValues.search}
          onChange={value => onFilter(value, 'search')}
          rightContent={<SearchIcon style={{marginLeft: 10, marginRight: 10}} stroke={Theme.palette.gray500} />}
        />
      </Row>
      <Table tableHeads={decisionsOverviewTableHeads} data={[]} emptyMessage={'Još nema rešenja'} />
    </>
  );
};

export default DecisionsOverview;
