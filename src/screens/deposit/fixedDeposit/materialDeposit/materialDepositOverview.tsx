import {SearchIcon, Table} from 'client-library';
import {tableHeads} from './constants.tsx';
import {Header} from './styles.tsx';
import {FilterInput} from '../../../accounting/styles.tsx';
import {Filters, FilterDropdown} from '../../../budget/planning/budgetList/styles.ts';

const MaterialDepositOverview = () => {
  // TO DO add logic when the backend is ready

  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown label="SUBJEKT:" options={[]} name="subject" />
          <FilterDropdown label="SUDIJA:" options={[]} name="judge" />
          <FilterDropdown label="STATUS:" options={[]} name="status" />
          <FilterInput label="PRETRAGA:" rightContent={<SearchIcon />} />
        </Filters>
      </Header>
      <Table tableHeads={tableHeads} data={[]} style={{marginBottom: 22}} />
    </>
  );
};

export default MaterialDepositOverview;
