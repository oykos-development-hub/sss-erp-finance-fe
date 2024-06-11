import {Dropdown, BudgetIcon, Theme} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits';
import {tableHeadsRequests} from './constants';
import {DropdownWrapperRequests, StyledTable} from './styles';
import useGetOverviewBudgetRequestOfficial from '../../../services/graphQL/budgetRequestOfficial/useGetOverviewBudgetRequestOfficial.ts';
import usePrependedDropdownOptions from '../../../utils/usePrependedDropdownOptions.ts';
import useAppContext from '../../../context/useAppContext.ts';
import {IconWrapper} from '../budgetFillActual/styles.ts';

export const RequestsPage = () => {
  const {
    breadcrumbs,
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();

  const [organizationUnit, setOrganizationUnit] = useState({id: 0, title: 'Sve'});
  const {organizationUnits} = useGetOrganizationUnits();

  const budget_id = useMemo(() => {
    const path = pathname.split('/');
    return path[path.length - 2];
  }, [pathname]);

  const {requests, refetch} = useGetOverviewBudgetRequestOfficial({budget_id});
  const [filteredRequests, setFilteredRequests] = useState<any[]>(requests);

  const handleOrganizationUnitChange = (value: any) => {
    setOrganizationUnit(value);
    setFilteredRequests([requests.find(request => request?.unit?.id === value?.id)]);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div>
      <DropdownWrapperRequests>
        <Dropdown
          name="organization_unit"
          options={usePrependedDropdownOptions(organizationUnits)}
          value={organizationUnit}
          onChange={handleOrganizationUnitChange}
          label="ORGANIZACIONA JEDINICA:"
        />
      </DropdownWrapperRequests>
      <StyledTable
        tableHeads={tableHeadsRequests}
        data={organizationUnit.id ? filteredRequests : requests}
        onRowClick={row => {
          if (!row?.unit?.id) return;
          breadcrumbs.add({name: 'Detalji zahtjeva', to: `${pathname}/${row?.unit?.id}/summary`});

          navigate(`${pathname}/${row?.unit?.id}/summary`);
        }}
        tableActions={[
          {
            name: 'actual',
            onClick: row => {
              breadcrumbs.add({name: 'Tekući budžet', to: `${pathname}/${row?.unit?.id}/actual`});
              navigate(`${pathname}/${row?.unit?.id}/actual`);
            },
            tooltip: () => 'Unos tekućeg budžeta',
            icon: (
              <IconWrapper>
                <BudgetIcon stroke={Theme?.palette?.gray800} />
              </IconWrapper>
            ),
            // TODO add condition for rendering after BE is done
            shouldRender: () => true,
          },
        ]}
      />
    </div>
  );
};
