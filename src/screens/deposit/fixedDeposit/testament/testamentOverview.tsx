import {SearchIcon, Table} from 'client-library';
import {FilterInput} from '../../../accounting/styles.tsx';
import {FilterDropdown, Filters} from '../../../budget/planning/budgetList/styles.ts';
import {tableHeads} from './constants.tsx';
import {Header} from './styles.tsx';

const TestamentOverview = () => {
  // TO DO add logic when the backend is ready

  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown label="TESTATOR:" options={[]} name="subject" />
          <FilterDropdown label="STATUS:" options={[]} name="status" />
          <FilterInput label="PRETRAGA:" rightContent={<SearchIcon />} />
        </Filters>
      </Header>
      <Table tableHeads={tableHeads} data={[]} style={{marginBottom: 22}} />
    </>
  );
};

export default TestamentOverview;
