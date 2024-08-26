import {yupResolver} from '@hookform/resolvers/yup';
import {Divider, Dropdown, Input, Pagination, Table} from 'client-library';
import {useEffect, useState} from 'react';
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
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import usePrependedDropdownOptions from '../../../../utils/usePrependedDropdownOptions.ts';
import {FilterDropdown} from '../../../budget/planning/budgetList/styles.ts';
import {checkActionRoutePermissions} from '../../../../services/checkRoutePermissions.ts';

const SUBJECT_ENTITY = 'other';

const depositTaxesFilterSchema = yup.object().shape({
  status: optionsStringSchema.nullable().default(null),
  search: yup.string(),
  subject_id: optionsNumberSchema.nullable().default(null),
  organization_unit_id: optionsNumberSchema.default(null),
});

type DepositTaxesFilterForm = yup.InferType<typeof depositTaxesFilterSchema>;

const DepositTaxesOverview = () => {
  const [page, setPage] = useState(1);

  const {
    contextMain: {organization_unit, permissions},
  } = useAppContext();

  const {control, watch, register} = useForm<DepositTaxesFilterForm>({
    resolver: yupResolver(depositTaxesFilterSchema),
  });

  const {search, subject_id, organization_unit_id, status} = watch();

  const {organizationUnits} = useGetOrganizationUnits({disable_filters: true});
  const createPermittedRoutes = checkActionRoutePermissions(permissions, 'create');
  const isUserSSS = createPermittedRoutes.includes('/finance');

  const organizationUnitsFilter = (): number | undefined => {
    if (isUserSSS) {
      return organization_unit_id?.id ? organization_unit_id?.id : undefined;
    }
    return organization_unit?.id;
  };

  const {data, fetchAdditionalExpenses} = useGetAdditionalExpenses({
    search,
    subject_id: subject_id?.id,
    status: status?.id,
    page: page,
    organization_unit_id: organizationUnitsFilter(),
    size: PAGE_SIZE,
  });

  const {suppliers: subjects} = useGetSuppliers({
    entity: SUBJECT_ENTITY,
  });

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  useEffect(() => {
    fetchAdditionalExpenses();
  }, [search, subject_id, status, page, organization_unit_id]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="OBRAČUN POREZA I DOPRINOSA" />
        <Divider color="#615959" height="1px" />

        <FlexRow gap={8} style={{flexWrap: 'wrap', marginBlock: 22}}>
          {isUserSSS && (
            <FilterContainer>
              <Controller
                control={control}
                name="organization_unit_id"
                render={({field: {name, value, onChange}}) => (
                  <FilterDropdown
                    label="ORGANIZACIONA JEDINICA:"
                    options={usePrependedDropdownOptions(organizationUnits, 'Sve organizacione jedinice')}
                    onChange={onChange}
                    value={value}
                    name={name}
                    placeholder="Odaberi organizacionu jedinicu"
                  />
                )}
              />
            </FilterContainer>
          )}
          <FilterContainer>
            <Controller
              control={control}
              name="subject_id"
              render={({field: {name, onChange, value}}) => (
                <Dropdown
                  label="SUBJEKT:"
                  options={usePrependedDropdownOptions(subjects, 'Svi subjekti')}
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
                  options={usePrependedDropdownOptions(DepositTaxStatusOptions, 'Svi statusi')}
                  value={value}
                  name={name}
                  onChange={onChange}
                  placeholder="Odaberite status"
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
