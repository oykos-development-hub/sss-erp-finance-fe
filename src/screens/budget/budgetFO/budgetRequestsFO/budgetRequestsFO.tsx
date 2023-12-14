import {Table} from 'client-library';
import {budgetRequestsFO} from '../constants.tsx';
import {StyledDropdown} from './styles.ts';

const BudgetRequestsFO = () => {
  return (
    <>
      <StyledDropdown label={'Organizacione jedinice'} placeholder={'Odaberi organizacionu jedinicu'} options={[]} />
      <Table tableHeads={budgetRequestsFO} data={[]} emptyMessage={'Nema podataka'} />
    </>
  );
};

export default BudgetRequestsFO;
