import {Button, Dropdown, Table} from 'client-library';
import {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import useAppContext from '../../../context/useAppContext';
import useGetBudgetDynamicHistory from '../../../services/graphQL/budgetDynamic/useGetBudgetDynamicHistory';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits';
import {BudgetDynamicHistoryItem} from '../../../types/graphQL/budgetDynamic';
import {budgetDynamicHistoryTHeads} from './constants';
import {ButtonWrapper, DropdownWrapper, HeaderWrapper, Wrapper} from './styles';

const BudgetDynamicHistory = () => {
  const [organizationUnit, setOrganizationUnit] = useState<any>(null);

  const {
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();
  const {organizationUnits} = useGetOrganizationUnits();

  const {budgetDynamicHistory} = useGetBudgetDynamicHistory({});

  const dynamicHistory = budgetDynamicHistory?.map(item => ({id: uuidv4(), ...item}));

  const navigateToDetails = (hsitoryItem: BudgetDynamicHistoryItem) => {
    navigate(`/finance/budget/current/requests/${hsitoryItem.version}`);
    breadcrumbs.add({
      name: `Verzija ${hsitoryItem.version}`,
      to: `/finance/budget/current/requests/${hsitoryItem.version}`,
    });
  };

  const onChange = (value: any) => {
    setOrganizationUnit(value);
  };

  return (
    <div>
      <Wrapper>
        <HeaderWrapper>
          <DropdownWrapper>
            <Dropdown
              value={organizationUnit}
              onChange={onChange}
              options={organizationUnits}
              label="ORGANIZACIONA JEDINICA:"
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
      <Table
        data={(dynamicHistory as any) || []}
        tableHeads={budgetDynamicHistoryTHeads}
        onRowClick={navigateToDetails}
      />
    </div>
  );
};

export default BudgetDynamicHistory;
