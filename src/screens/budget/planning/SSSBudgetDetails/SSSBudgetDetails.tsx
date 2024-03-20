import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Dropdown, Typography} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import BudgetLimitModal from '../../../../components/budgetLimitModal/budgetLimitModal.tsx';
import {UserRole} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetBudgets from '../../../../services/graphQL/getBudgets/useGetBudgets.ts';
import useInsertBudget from '../../../../services/graphQL/insertBudget/useInsertBudget.ts';
import BudgetTable from '../../../../shared/budgetTable/budgetTable.tsx';
import {BudgetTableStep} from '../../../../shared/budgetTable/types.ts';
import {FlexRow} from '../../../../shared/flex.ts';
import Footer from '../../../../shared/footer.ts';
import {optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas.ts';
import {getYearOptions} from '../../../../utils/getYearOptions.ts';
import {budgetTypeOptions} from '../budgetList/constants.tsx';
import {MainTitle, OverviewBox, ScreenWrapper} from '../budgetList/styles.ts';
import {BoldText, Box, Controls, TableGrid} from './SSSBudgetDetails.styles.ts';

export type LimitObject = {
  organization_unit_id: number;
  limit: number;
};

const addBudgetSchema = yup.object().shape({
  year: optionsStringSchema.required('Ovo polje je obavezno').default(null),
  budget_type: optionsNumberSchema.required('Ovo polje je obavezno').default(null),
  limits: yup
    .array()
    .of(
      yup.object().shape({
        limit: yup.number().required(),
        organization_unit_id: yup.number().required(),
      }),
    )
    .required()
    .default(null),
});

export type AddBudgetFormType = yup.InferType<typeof addBudgetSchema>;

const SSSBudgetDetails = () => {
  const [limitModal, setLimitModal] = useState(false);

  const {
    navigation: {
      location: {pathname},
      navigate,
    },
    contextMain,
    alert,
  } = useAppContext();

  const {
    control,
    formState: {errors, isValid},
    handleSubmit,
    watch,
    setValue,
  } = useForm<AddBudgetFormType>({resolver: yupResolver(addBudgetSchema), mode: 'onBlur'});

  const budgetID = pathname.split('/').at(-1);
  const isNew = budgetID === 'add-new';

  const {insertBudget, loading: isSaving} = useInsertBudget();
  const {budgets} = useGetBudgets({id: isNew ? null : parseInt(budgetID)});

  //todo check if the same api endpoint is used when the OJ manager is filling the budget
  const onSubmit = async (data: AddBudgetFormType) => {
    if (isSaving) return;

    const payload = {
      id: isNew ? null : parseInt(budgetID),
      year: data.year.id.toString(),
      budget_type: data.budget_type.id,
      limits: data.limits,
    };

    await insertBudget(
      payload,
      () => {
        alert.success('Uspješno sačuvano.');
        navigate('/finance/budget/planning');
      },
      () => alert?.error('Greška. Promjene nisu sačuvane.'),
    );
  };

  const onLimitModalSubmit = (data: LimitObject[]) => {
    setValue('limits', data, {shouldValidate: true});
  };

  const availableYearsForBudget = useMemo(() => {
    if (!budgets) return [];

    const years = getYearOptions(6, false, 5);

    const existingBudgetYears = budgets.items?.map(budget => budget.year) || [];
    const filteredYears = years.filter(year => !existingBudgetYears.includes(Number(year.id)));

    return filteredYears;
  }, [budgets]);

  useEffect(() => {
    if (budgets && budgets.items && budgets.items.length > 0) {
      setValue('year', {id: budgets.items[0].year.toString(), title: budgets.items[0].year.toString()});
      setValue('budget_type', budgetTypeOptions.find(option => option.id === parseInt(budgets.items[0].budget_type))!);
      setValue('limits', budgets.items[0].limits);
    }
  }, [budgets]);

  const year = watch('year')?.id;

  return (
    <ScreenWrapper>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content={isNew ? 'NOVI BUDŽET' : `BUDŽET ZA ${year} GODINU`} />
        <hr />
        <Box>
          <Controls>
            <TableGrid>
              <BoldText variant="bodySmall" content="NAZIV PREDLAGAČA:" />
              <Typography variant="bodySmall" content={contextMain.organization_unit.title} />
            </TableGrid>
            <Button content="Limiti" variant="secondary" style={{width: 130}} onClick={() => setLimitModal(true)} />
          </Controls>

          <FlexRow gap="1rem" style={{marginTop: '1rem'}}>
            <Controller
              control={control}
              name="year"
              render={({field: {name, onChange, value}}) => (
                <Dropdown
                  name={name}
                  value={value}
                  onChange={onChange}
                  options={availableYearsForBudget}
                  error={errors.year?.message}
                  placeholder="Odaberite godinu"
                  isDisabled={!isNew}
                />
              )}
            />
            <Controller
              control={control}
              name="budget_type"
              render={({field: {name, onChange, value}}) => (
                <Dropdown
                  name={name}
                  value={value}
                  onChange={onChange}
                  options={budgetTypeOptions}
                  error={errors.year?.message}
                  placeholder="Odaberite tip"
                  isDisabled={!isNew}
                />
              )}
            />
          </FlexRow>
        </Box>

        {contextMain.role_id === UserRole.MANAGER_OJ && (
          <Box>
            <TableGrid>
              <BoldText variant="bodySmall" content="PROGRAM:" />
              <Typography variant="bodySmall" content="SUDSKI SAVJET" />
              <BoldText variant="bodySmall" content="POTPROGRAM:" />
              <Typography variant="bodySmall" content="SUDSKI SAVJET" />
              <BoldText variant="bodySmall" content="AKTIVNOSTI:" />
              <Typography variant="bodySmall" content="SUDSKI SAVJET" />
              <BoldText variant="bodySmall" content="IZVOR:" />
              <Typography variant="bodySmall" content="SUDSKI SAVJET" />
            </TableGrid>
          </Box>
        )}

        {year && <BudgetTable step={BudgetTableStep.CREATING} year={parseInt(year)} organizationUnitId={1} />}

        <Footer>
          <Button
            content="Otkaži"
            variant="secondary"
            style={{width: 130}}
            onClick={() => navigate('/finance/budget/planning')}
          />
          <Button
            content="Sačuvaj"
            variant="primary"
            style={{width: 130}}
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid && isNew}
          />
        </Footer>
      </OverviewBox>

      <BudgetLimitModal open={limitModal} onClose={() => setLimitModal(false)} onSubmit={onLimitModalSubmit} />
    </ScreenWrapper>
  );
};

export default SSSBudgetDetails;
