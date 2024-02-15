import {SearchIcon, Table} from 'client-library';
import {FilterDropdown, FilterInput, Filters} from '../../../../components/budgetList/styles.ts';
import {tableHeads} from './constants.tsx';
import {Header} from './styles.tsx';

const InitialStateOverview = () => {
  // TO DO add logic when the backend is ready

  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown label="UPLATILAC:" options={[]} name="subject" />
          <FilterDropdown label="STATUS:" options={[]} name="status" />
          <FilterInput label="PRETRAGA:" rightContent={<SearchIcon />} />
        </Filters>
      </Header>
      <Table tableHeads={tableHeads} data={[]} style={{marginBottom: 22}} />
    </>
  );
};

export default InitialStateOverview;
