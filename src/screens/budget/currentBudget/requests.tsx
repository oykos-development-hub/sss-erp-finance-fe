import {Dropdown, Table, Pagination} from 'client-library';
import {useEffect, useState} from 'react';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits';
import {tableHeadsRequests} from './constants';
import {DropdownWrapperRequests} from './styles';
import useGetExternalReallocations from '../../../services/graphQL/externalReallocations/useGetExternalReallocations.ts';
import {PAGE_SIZE, ReallocationStatusEnum} from '../../../constants.ts';
import {ReallocationItem} from '../../../types/graphQL/externalReallocations.ts';
import usePrependedDropdownOptions from '../../../utils/usePrependedDropdownOptions.ts';
import {defaultDropdownOption} from '../../finesAndTaxes/fines/constants.tsx';
import useAppContext from '../../../context/useAppContext.ts';

const initialValues = {
  destination_organization_unit_id: undefined,
  source_organization_unit_id: undefined,
};
export const RequestsPage = () => {
  const {
    navigation: {navigate},
  } = useAppContext();

  const {organizationUnits} = useGetOrganizationUnits({disable_filters: true});

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialValues);

  const {externalReallocations, total, refetch} = useGetExternalReallocations({
    page: page,
    status: ReallocationStatusEnum.acceptedOJ,
    ...filters,
  });

  useEffect(() => {
    refetch();
  }, []);

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value?.id});
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (page === 1) return;
    setPage(1);
  }, [filters]);

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <DropdownWrapperRequests>
          <Dropdown
            name="destination_organization_unit_id"
            options={usePrependedDropdownOptions(organizationUnits)}
            value={
              organizationUnits.find(ou => ou.id === filters.destination_organization_unit_id) ?? defaultDropdownOption
            }
            onChange={onFilterChange}
            label="PREDLAGAČ:"
          />
        </DropdownWrapperRequests>
        <DropdownWrapperRequests>
          <Dropdown
            name="source_organization_unit_id"
            options={usePrependedDropdownOptions(organizationUnits)}
            value={organizationUnits.find(ou => ou.id === filters.source_organization_unit_id) ?? defaultDropdownOption}
            onChange={onFilterChange}
            label="POŠILJALAC:"
          />
        </DropdownWrapperRequests>
      </div>
      <Table
        data={externalReallocations}
        tableHeads={tableHeadsRequests}
        onRowClick={(row: ReallocationItem) => navigate(`/finance/budget/requests/${row.id}`)}
      />
      <Pagination
        pageCount={total ? Math.ceil(total / PAGE_SIZE) : 1}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={PAGE_SIZE}
        pageRangeDisplayed={3}
        style={{marginTop: '20px'}}
      />
    </div>
  );
};
