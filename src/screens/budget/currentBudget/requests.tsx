import {Datepicker, Dropdown, Table} from 'client-library';
import {useState} from 'react';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits';
import {tableHeadsRequests} from './constants';
import {Column, DropdownWrapperRequests, Price, SubTitle, Totals} from './styles';

export const RequestsPage = () => {
  const [organizationUnit, setOrganizationUnit] = useState({id: 0, title: 'Sve'});
  const {organizationUnits} = useGetOrganizationUnits();

  const handleOrganizationUnitChange = (value: any) => {
    setOrganizationUnit(value);
  };

  return (
    <div>
      <DropdownWrapperRequests>
        <Dropdown
          name="organization_unit"
          options={organizationUnits}
          value={organizationUnit}
          onChange={handleOrganizationUnitChange}
          label="ORGANIZACIONA JEDINICA:"
        />
      </DropdownWrapperRequests>
      <Table data={[]} tableHeads={tableHeadsRequests} />
      <Totals>
        <Column>
          <SubTitle variant="bodySmall" content="UKUPNA NETO VRIJEDNOST:" />
          <Price variant="bodySmall" content={'€ '} />
        </Column>
        <Column>
          <SubTitle variant="bodySmall" content="UKUPNA BRUTO VRIJEDNOST:" />
          <Price variant="bodySmall" content={'€ '} />
        </Column>
      </Totals>
      <Column>
        <Datepicker
          name="date_of_closing"
          onChange={() => {
            console.log('');
          }}
          disabled
        />
      </Column>
    </div>
  );
};
