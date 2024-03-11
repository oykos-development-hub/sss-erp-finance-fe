import {Divider, Dropdown, Table, TableHead} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import {getYearOptions} from '../../../utils/getYearOptions';
import {DropdownWrapper, HeaderWrapper, MainTitle, SectionBox, Wrapper} from './styles';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import useAppContext from '../../../context/useAppContext';

const tableHeads: TableHead[] = [
  {
    title: 'Godina',
    accessor: '',
    type: 'text',
  },
];

const NonFinancialOverview = () => {
  const {
    navigation: {navigate},
  } = useAppContext();

  const {control} = useForm();

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="NEFINANSIJSKI DIO" />
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
          </HeaderWrapper>
        </Wrapper>
        {/*TO DO finish this whan BE is ready */}
        <Table data={[]} tableHeads={tableHeads} onRowClick={() => navigate('/finance/budget/nonFinance')} />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default NonFinancialOverview;
