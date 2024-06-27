import {Divider, Dropdown, Table, TableHead} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import {getYearOptions} from '../../../utils/getYearOptions';
import {DropdownWrapper, HeaderWrapper, MainTitle, SectionBox, Wrapper} from './styles';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import useAppContext from '../../../context/useAppContext';
import useGetNonFinancialBudgetOverview from '../../../services/graphQL/budget/useGetNonFinancialBudgetOverview.ts';
import {DropdownData} from '../../../types/dropdownData.ts';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';
import {NonFinancialDetails} from '../../../types/graphQL/budgetRequestDetails.ts';

const tableHeads: TableHead[] = [
  {
    title: 'Godina',
    accessor: 'year',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: DropdownData<number>) => <StatusTableCell status={status.title} />,
  },
];

const NonFinancialOverview = () => {
  const {
    navigation: {navigate},
  } = useAppContext();

  const {control, watch} = useForm();
  const {year} = watch();

  const {nonFinancialBudgets} = useGetNonFinancialBudgetOverview(year ? year?.id : null);

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
        <Table
          data={nonFinancialBudgets}
          tableHeads={tableHeads}
          onRowClick={(row: NonFinancialDetails) => navigate(`/finance/budget/current/non-financial/${row.year}`)}
        />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default NonFinancialOverview;
