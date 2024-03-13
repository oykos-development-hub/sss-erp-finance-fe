import {budgetTypeOptions} from '../../../components/budgetList/constants.tsx';
import {FilterDropdown, Filters} from '../../../components/budgetList/styles.ts';
import useAppContext from '../../../context/useAppContext.ts';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import BudgetTable from '../../../shared/budgetTable/budgetTable.tsx';
import {BudgetTableStep} from '../../../shared/budgetTable/types.ts';
import {getYearFromPath} from '../../../utils/getYearFromPath.ts';
import {Header} from './styles.tsx';

const CurrentBudget = () => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();

  const year = getYearFromPath(pathname);
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});

  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown label="ORGANIZACIONA JEDINICA:" options={organizationUnits} name="organization_unit" />
          <FilterDropdown label="TIP BUDŽETA:" options={budgetTypeOptions} name="type" />
        </Filters>
      </Header>
      <BudgetTable step={BudgetTableStep.CURRENT_BUDGET} year={year} organizationUnitId={1} />
    </>
  );
};

export default CurrentBudget;
