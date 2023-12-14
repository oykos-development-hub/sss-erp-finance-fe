import {Table, SearchIcon, Dropdown, Input} from 'client-library';
import {Row} from './styles.ts';
import {invoicesOverviewTableHeads} from '../constants.tsx';
import {ChangeEvent, useEffect, useState} from 'react';
import {DropdownData} from '../../../../types/dropdownData.ts';
import {useDebounce} from '../../../../utils/useDebounce.ts';
import usePrependedDropdownOptions from '../../../../utils/usePrependedDropdownOptions.ts';
import {mockDropdownOptions} from '../../../../constants.ts';
import {Theme} from '@oykos-development/devkit-react-ts-styled-components';

const InvoicesOverview = () => {
  const [filterValues, setFilterValues] = useState({
    supplier: null,
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
          label={'DOBAVLJAČ:'}
          placeholder={'Odaberi dobavljača'}
          options={usePrependedDropdownOptions(mockDropdownOptions)}
          value={filterValues.supplier}
          onChange={value => onFilter(value as DropdownData<string>, 'supplier')}
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
      <Table
        tableHeads={invoicesOverviewTableHeads}
        data={[]}
        style={{marginBottom: 22}}
        emptyMessage={'Još nema računa'}
      />
    </>
  );
};

export default InvoicesOverview;
