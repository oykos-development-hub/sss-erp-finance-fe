import {Dropdown} from 'client-library';
import {useMemo, useState} from 'react';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits';
import {tableHeadsRequests} from './constants';
import {DropdownWrapperRequests, StyledTable} from './styles';
import useGetOverviewBudgetRequestOfficial from '../../../services/graphQL/budgetRequestOfficial/useGetOverviewBudgetRequestOfficial.ts';
import usePrependedDropdownOptions from '../../../utils/usePrependedDropdownOptions.ts';
import useAppContext from '../../../context/useAppContext.ts';

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

  const {requests} = useGetOverviewBudgetRequestOfficial({budget_id});
  const [filteredRequests, setFilteredRequests] = useState<any[]>(requests);

  const handleOrganizationUnitChange = (value: any) => {
    setOrganizationUnit(value);
    setFilteredRequests([requests.find(request => request?.unit?.id === value?.id)]);
  };

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
      />
    </div>
  );
};
