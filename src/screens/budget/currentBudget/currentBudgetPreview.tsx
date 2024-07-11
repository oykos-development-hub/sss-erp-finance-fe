import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import BudgetTable from '../../../shared/budgetTable/budgetTable.tsx';
import {BudgetTableStep} from '../../../shared/budgetTable/types.ts';
import {FilterDropdown, Filters} from '../planning/budgetList/styles.ts';
import {Header} from './styles.tsx';
import {OrganizationUnit} from '../../../types/graphQL/organizationUnits.ts';
import {DropdownData} from '../../../types/dropdownData.ts';
import useGetCurrentBudget from '../../../services/graphQL/currentBudget/useGetCurrentBudget.ts';
import {calculateSums} from '../../../utils/sumActualBudgetFilledData.ts';
import {useRoleCheck} from '../../../utils/useRoleCheck.ts';
import {UserRole} from '../../../constants.ts';
import {Typography} from 'client-library';

const CurrentBudget = () => {
  const {
    contextMain: {
      organization_unit: {id: organization_unit_id},
      role_id,
    },
  } = useAppContext();

  const [organizationUnit, setOrganizationUnit] = useState<OrganizationUnit | undefined>(undefined);
  const {organizationUnits} = useGetOrganizationUnits(organizationUnit ? {id: organizationUnit?.id} : undefined, {
    allOption: true,
  });

  useEffect(() => {
    console.log(organization_unit_id, 'organization_unit_id');
  }, [organization_unit_id]);

  const filterId = organizationUnit ? organizationUnit.id : organization_unit_id;
  const {currentBudgetAccounts, currentBudgetDonations} = useGetCurrentBudget({organization_unit_id: filterId});

  useEffect(() => {
    setOrganizationUnit(
      organizationUnits.find(unit => unit.id === organization_unit_id) ??
        ({id: 0, title: 'Sve organizacione jedinice'} as OrganizationUnit),
    );
  }, [organizationUnits, organization_unit_id]);

  const onFilter = (value: DropdownData<string>) => {
    setOrganizationUnit(organizationUnits.find(unit => unit.id === +value.id));
  };

  const summedCurrentBudget = calculateSums(currentBudgetAccounts);
  const summedCurrentBudgetDonations = calculateSums(currentBudgetDonations);

  return (
    <>
      <Header>
        {!useRoleCheck(role_id, [UserRole.MANAGER_OJ]) && (
          <Filters>
            <FilterDropdown
              label="ORGANIZACIONA JEDINICA:"
              options={organizationUnits}
              name="organization_unit"
              value={organizationUnit}
              onChange={value => onFilter(value as DropdownData<string>)}
            />
          </Filters>
        )}
      </Header>
      <Typography content="Tekući budžet" variant="bodyMedium" style={{marginTop: '26px', fontWeight: 600}} />

      <BudgetTable
        step={BudgetTableStep.CURRENT_BUDGET}
        year={new Date().getFullYear()}
        organizationUnitId={organization_unit_id}
        countsProps={summedCurrentBudget}
      />

      <Typography content="Donacije" variant="bodyMedium" style={{marginTop: '26px', fontWeight: 600}} />
      <BudgetTable
        step={BudgetTableStep.CURRENT_BUDGET}
        year={new Date().getFullYear()}
        organizationUnitId={organization_unit_id}
        countsProps={summedCurrentBudgetDonations}
      />
    </>
  );
};

export default CurrentBudget;
