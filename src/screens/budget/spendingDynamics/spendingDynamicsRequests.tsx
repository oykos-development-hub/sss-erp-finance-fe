import {Button, Dropdown, Table} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../../context/useAppContext';
import useGetOrganizationUnits from '../../../services/graphQL/organizationUnits/useGetOrganizationUnits';
import {tableHeadsRequests} from './constants';
import {ButtonWrapper, DropdownWrapper, HeaderWrapper, Wrapper} from './styles';

const SpendingDinamicsRequests = () => {
  const {
    navigation: {navigate},
  } = useAppContext();
  const {organizationUnits} = useGetOrganizationUnits();
  const {control} = useForm();

  // TO DO add BE
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
          <DropdownWrapper>
            <Controller
              name="status"
              control={control}
              render={({field: {name, value, onChange}}) => (
                <Dropdown name={name} value={value} onChange={onChange} options={[]} label="STATUS:" />
              )}
            />
          </DropdownWrapper>
        </HeaderWrapper>
        <ButtonWrapper>
          <Button
            content="Dinamika potrošnje"
            variant="secondary"
            onClick={() => navigate('/finance/budget/current/requests-dynamics')}
          />
        </ButtonWrapper>
      </Wrapper>
      <Table data={[]} tableHeads={tableHeadsRequests} />
    </div>
  );
};

export default SpendingDinamicsRequests;
