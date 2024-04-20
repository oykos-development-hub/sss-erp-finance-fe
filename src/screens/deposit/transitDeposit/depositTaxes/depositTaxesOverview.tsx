import {yupResolver} from '@hookform/resolvers/yup';
import {Divider, Dropdown, Input, Pagination, Table} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {PAGE_SIZE} from '../../../../constants';
import useAppContext from '../../../../context/useAppContext';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers';
import useGetAdditionalExpenses from '../../../../services/graphQL/transitDeposits/useGetAdditionalExpenses';
import {FlexRow} from '../../../../shared/flex';
import {MainTitle} from '../../../../shared/pageElements';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper';
import SectionBox from '../../../../shared/sectionBox';
import {optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas';
import {DepositTaxStatusOptions, depositTaxesTableHeads} from './constants';
import {FilterContainer} from './styles';

const SUBJECT_ENTITY = 'subjects';

const depositTaxesFilterSchema = yup.object().shape({
  status: optionsStringSchema.nullable().default(null),
  search: yup.string(),
  subject_type: optionsNumberSchema.nullable().default(null),
  subject_id: optionsNumberSchema.nullable().default(null),
  source_bank_account: optionsStringSchema.nullable().default(null),
});

type DepositTaxesFilterForm = yup.InferType<typeof depositTaxesFilterSchema>;

const DepositTaxesOverview = () => {
  const [page, setPage] = useState(1);

  const {
    contextMain: {
      organization_unit: {id: organization_unit_id, bank_accounts},
    },
  } = useAppContext();

  const {control, watch, register} = useForm<DepositTaxesFilterForm>({
    resolver: yupResolver(depositTaxesFilterSchema),
  });

  const {search, subject_type, subject_id, status} = watch();

  const {data, fetchAdditionalExpenses} = useGetAdditionalExpenses({
    organization_unit_id,
    search,
    subject_id: subject_id?.id,
    status: status?.id,
    page: page,
    size: PAGE_SIZE,
  });

  const {suppliers: subjectTypes} = useGetSuppliers({entity: SUBJECT_ENTITY, parent_id: null});

  const {suppliers: subjects} = useGetSuppliers({
    entity: SUBJECT_ENTITY,
    parent_id: subject_type ? subject_type.id : null,
  });

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  useEffect(() => {
    fetchAdditionalExpenses();
  }, [search, subject_id, status, page]);

  const orgUnitBankAccountOptions = useMemo(() => {
    if (!bank_accounts) return [];
    return bank_accounts.map((item: string) => ({id: item, title: item}));
  }, [bank_accounts]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="VEZANI TROŠKOVI" />
        <Divider color="#615959" height="1px" />

        <FlexRow gap={8} style={{flexWrap: 'wrap', marginBlock: 22}}>
          <FilterContainer>
            <Controller
              control={control}
              name="subject_type"
              render={({field: {name, onChange, value}}) => (
                <Dropdown
                  label="TIP SUBJEKTA:"
                  options={subjectTypes}
                  value={value}
                  name={name}
                  onChange={onChange}
                  placeholder="Odaberite tip subjekta"
                />
              )}
            />
          </FilterContainer>
          <FilterContainer>
            <Controller
              control={control}
              name="subject_id"
              render={({field: {name, onChange, value}}) => (
                <Dropdown
                  label="SUBJEKT:"
                  options={subjects}
                  value={value}
                  name={name}
                  onChange={onChange}
                  placeholder="Odaberite subjekta"
                />
              )}
            />
          </FilterContainer>
          <FilterContainer>
            <Controller
              control={control}
              name="status"
              render={({field: {name, onChange, value}}) => (
                <Dropdown
                  label="STATUS:"
                  options={DepositTaxStatusOptions}
                  value={value}
                  name={name}
                  onChange={onChange}
                  placeholder="Odaberite status"
                />
              )}
            />
          </FilterContainer>
          <FilterContainer>
            <Controller
              control={control}
              name="source_bank_account"
              render={({field: {name, onChange, value}}) => (
                <Dropdown
                  label="STATUS:"
                  options={orgUnitBankAccountOptions}
                  value={value}
                  name={name}
                  onChange={onChange}
                  placeholder="Odaberite žiro račun"
                />
              )}
            />
          </FilterContainer>
          <FilterContainer>
            <Input label="PRETRAGA:" {...register('search')} placeholder="Pretraži" />
          </FilterContainer>
        </FlexRow>

        <Table tableHeads={depositTaxesTableHeads} data={data.items} style={{marginBottom: 22}} />

        <Pagination
          pageCount={data.total ? Math.ceil(data.total / PAGE_SIZE) : 0}
          onChange={onPageChange}
          variant="filled"
          itemsPerPage={PAGE_SIZE}
          pageRangeDisplayed={3}
          style={{marginTop: '20px'}}
        />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default DepositTaxesOverview;
