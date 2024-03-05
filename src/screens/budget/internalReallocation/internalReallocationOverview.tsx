import {Button, Divider, Dropdown, Table, TableHead} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {getYearOptions} from '../../../utils/getYearOptions';
import {ButtonWrapper, DropdownWrapper, HeaderWrapper, MainTitle, SectionBox, Wrapper} from './styles';
import useAppContext from '../../../context/useAppContext';

const tableHeads: TableHead[] = [
  {
    title: 'ID',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Datum zahtjeva',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Podnosilac zahtjeva',
    accessor: 'amount',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
];

const InternalReallocationOverview = () => {
  const {control} = useForm();

  const {
    navigation: {navigate},
  } = useAppContext();

  // TO DO add BE
  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="INTERNO PREUSMJERENJE" />
        <Divider color="#615959" height="1px" />
        <Wrapper>
          <HeaderWrapper>
            <DropdownWrapper>
              <Controller
                name="year"
                control={control}
                render={({field: {name, value, onChange}}) => (
                  <Dropdown
                    name={name}
                    value={value}
                    onChange={onChange}
                    options={getYearOptions(10, true, 5)}
                    label="GODINA:"
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
              content="Kreiraj interno preusmjerenje"
              style={{width: '200px'}}
              variant="secondary"
              onClick={() => navigate('/finance/budget/current/internal-reallocation/create')}
            />
          </ButtonWrapper>
        </Wrapper>
        <Table data={[]} tableHeads={tableHeads} />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default InternalReallocationOverview;
