import {yupResolver} from '@hookform/resolvers/yup';
import {SearchIcon, Table} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetFixedDeposits from '../../../../services/graphQL/fixedDeposits/useGetFixedDeposits.ts';
import {FixedDepositStatus, FixedDepositsOptions} from '../../../../types/deposits.ts';
import {optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas.ts';
import {useDebounce} from '../../../../utils/useDebounce.ts';
import {FilterInput} from '../../../accounting/styles.tsx';
import {FilterDropdown, Filters} from '../../../budget/planning/budgetList/styles.ts';
import {tableHeads} from './constants.tsx';
import {Header} from './styles.tsx';
import useGetJudges from '../../../../services/graphQL/judges/useGetJudges.ts';
import {FixedDeposit} from '../../../../types/graphQL/fixedDeposits.ts';

const financeDepositFilterSchema = yup.object({
  judge_id: optionsNumberSchema.default(null),
  status: optionsStringSchema.default(null),
  search: yup.string(),
});

type FinancialDepositFilterType = yup.InferType<typeof financeDepositFilterSchema>;

const FinanceDepositOverview = () => {
  const {
    contextMain: {organization_unit_id},
    navigation: {navigate},
  } = useAppContext();

  const {judges} = useGetJudges({});

  const {register, control, watch} = useForm<FinancialDepositFilterType>({
    resolver: yupResolver(financeDepositFilterSchema),
  });

  const {search, judge_id, status} = watch();

  const debouncedSearch = useDebounce(search, 500);

  const {data, loading} = useGetFixedDeposits({
    judge_id: judge_id?.id,
    search: debouncedSearch,
    status: status?.title as FixedDepositStatus,
    organization_unit_id: organization_unit_id,
    type: 'financial',
  });

  return (
    <>
      <Header>
        <Filters>
          <Controller
            control={control}
            name="judge_id"
            render={({field: {name, value, onChange}}) => (
              <FilterDropdown
                label="SUDIJA:"
                options={judges}
                onChange={onChange}
                value={value}
                name={name}
                placeholder="Izaberite sudiju"
              />
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({field: {name, value, onChange}}) => (
              <FilterDropdown
                label="STATUS:"
                options={FixedDepositsOptions}
                onChange={onChange}
                value={value}
                name={name}
                placeholder="Izaberite status"
              />
            )}
          />
          <FilterInput label="PRETRAGA:" rightContent={<SearchIcon />} {...register('search')} placeholder="Pretraži" />
        </Filters>
      </Header>
      <Table
        tableHeads={tableHeads}
        data={data.items}
        style={{marginBottom: 22}}
        isLoading={loading}
        onRowClick={(row: FixedDeposit) => {
          navigate(`/finance/deposit/fixed/finance/${row.id}`);
        }}
      />
    </>
  );
};

export default FinanceDepositOverview;
