import useAppContext from '../../../context/useAppContext.ts';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import BudgetTable from '../../../shared/budgetTable/budgetTable.tsx';
import {BudgetTableStep} from '../../../shared/budgetTable/types.ts';
import {FilterDropdown, Filters} from '../planning/budgetList/styles.ts';
import {Header} from './styles.tsx';
import {useEffect, useState} from 'react';
import {OrganizationUnit} from '../../../types/graphQL/organizationUnits.ts';
import {DropdownData} from '../../../types/dropdownData.ts';
import useGetCurrentBudget from '../../../services/graphQL/currentBudget/useGetCurrentBudget.ts';
import {calculateSums} from '../../../utils/sumActualBudgetFilledData.ts';

const CurrentBudget = () => {
  const {
    contextMain: {
      organization_unit: {id: organization_unit_id},
    },
  } = useAppContext();

  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const [organizationUnit, setOrganizationUnit] = useState<OrganizationUnit | undefined>(undefined);
  const {currentBudget} = useGetCurrentBudget({organization_unit_id});

  useEffect(() => {
    setOrganizationUnit(
      organizationUnits.find(unit => unit.id === organization_unit_id) ??
        ({id: 0, title: 'Sve organizacione jedinice'} as OrganizationUnit),
    );
  }, [organizationUnits, organization_unit_id]);

  const onFilter = (value: DropdownData<string>) => {
    setOrganizationUnit(organizationUnits.find(unit => unit.id === +value.id));
  };

  const summedCurrentBudget = calculateSums(currentBudget);

  return (
    <>
      <Header>
        <Filters>
          <FilterDropdown
            label="ORGANIZACIONA JEDINICA:"
            options={organizationUnits}
            name="organization_unit"
            value={organizationUnit}
            onChange={value => onFilter(value as DropdownData<string>)}
          />
        </Filters>
      </Header>
      <BudgetTable
        step={BudgetTableStep.CURRENT_BUDGET}
        year={new Date().getFullYear()}
        organizationUnitId={organization_unit_id}
        countsProps={summedCurrentBudget}
      />
    </>
  );
};

export default CurrentBudget;
