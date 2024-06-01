import {Button, Dropdown, Table} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import {v4 as uuidv4} from 'uuid';
import useAppContext from '../../../context/useAppContext';
import useGetBudgetDynamicHistory from '../../../services/graphQL/budgetDynamic/useGetBudgetDynamicHistory';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits';
import {budgetDynamicHistoryTHeads} from './constants';
import {ButtonWrapper, DropdownWrapper, HeaderWrapper, Wrapper} from './styles';
import {BudgetDynamicHistoryItem} from '../../../types/graphQL/budgetDynamic';

const BudgetDynamicHistory = () => {
  const {
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();
  const {organizationUnits} = useGetOrganizationUnits();
  const {control} = useForm();

  const {budgetDynamicHistory} = useGetBudgetDynamicHistory({budget_id: 88});

  const dynamicHistory = budgetDynamicHistory?.map(item => ({id: uuidv4(), ...item}));

  const navigateToDetails = (hsitoryItem: BudgetDynamicHistoryItem) => {
    navigate(`/finance/budget/current/requests/${hsitoryItem.version}`);
    breadcrumbs.add({
      name: `Verzija ${hsitoryItem.version}`,
      to: `/finance/budget/current/requests/${hsitoryItem.version}`,
    });
  };

  return (
    <div>
      <Wrapper>
        <HeaderWrapper>
          <DropdownWrapper>
            <Controller
              name="organization_unit_id"
              control={control}
              render={({field: {name, value, onChange}}) => (
                <Dropdown
                  name={name}
                  value={value}
                  onChange={onChange}
                  options={organizationUnits}
                  label="ORGANIZACIONA JEDINICA:"
                />
              )}
            />
          </DropdownWrapper>
        </HeaderWrapper>
        <ButtonWrapper>
          <Button
            content="Dodaj dinamiku potrošnje"
            variant="secondary"
            onClick={() => navigate('/finance/budget/current/requests/add-new')}
          />
        </ButtonWrapper>
      </Wrapper>
      {/* @ts-ignore */}
      <Table data={dynamicHistory || []} tableHeads={budgetDynamicHistoryTHeads} onRowClick={navigateToDetails} />
    </div>
  );
};

export default BudgetDynamicHistory;
