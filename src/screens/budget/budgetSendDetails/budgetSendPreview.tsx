import useAppContext from '../../../context/useAppContext.ts';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import BudgetTable from '../../../shared/budgetTable/budgetTable.tsx';
import {BudgetTableStep} from '../../../shared/budgetTable/types.ts';
import {getYearFromPath} from '../../../utils/getYearFromPath.ts';
import {budgetTypeFilterOptions} from '../planning/budgetList/constants.tsx';
import {FilterDropdown, Filters} from '../planning/budgetList/styles.ts';
import {Header} from './styles.tsx';

const BudgetSendPreview = () => {
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
          <FilterDropdown label="TIP BUDŽETA:" options={budgetTypeFilterOptions} name="type" />
        </Filters>
      </Header>
      <BudgetTable step={BudgetTableStep.CURRENT_BUDGET} year={year} organizationUnitId={1} />
    </>
  );
};

export default BudgetSendPreview;
