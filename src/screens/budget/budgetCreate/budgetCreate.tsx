import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Dropdown, Typography} from 'client-library';
import {useMemo, useState} from 'react';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import * as yup from 'yup';
import BudgetLimitModal from '../../../components/budgetLimitModal/budgetLimitModal.tsx';
import {budgetTypeOptions} from '../../../components/budgetList/constants.tsx';
import {MainTitle, OverviewBox} from '../../../components/budgetList/styles.ts';
import {UserRole} from '../../../constants.ts';
import useAppContext from '../../../context/useAppContext.ts';
import useGetBudgets from '../../../services/graphQL/getBudgets/useGetBudgets.ts';
import useInsertBudget from '../../../services/graphQL/insertBudget/useInsertBudget.ts';
import BudgetTable from '../../../shared/budgetTable/budgetTable.tsx';
import {BudgetTableStep} from '../../../shared/budgetTable/types.ts';
import {FlexRow} from '../../../shared/flex.ts';
import Footer from '../../../shared/footer.ts';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {optionsNumberSchema, optionsStringSchema} from '../../../utils/formSchemas.ts';
import {getYearOptions} from '../../../utils/getYearOptions.ts';
import {BoldText, Box, Controls, TableGrid} from './styles.tsx';

export const limitSchema = yup.array().of(
  yup.object().shape({
    limit: yup.string().required('Ovo polje je obavezno'),
    title: yup.string(),
    organization_unit_id: yup.number().required(),
  }),
);

const addBudgetSchema = yup.object().shape({
  year: optionsStringSchema.required('Ovo polje je obavezno').default(null),
  budget_type: optionsNumberSchema.required('Ovo polje je obavezno'),
  limits: limitSchema.required(),
});

export type AddBudgetFormType = yup.InferType<typeof addBudgetSchema>;

const BudgetCreate = () => {
  const [limitModal, setLimitModal] = useState(false);

  const {
    navigation: {
      location: {pathname},
      navigate,
    },
    contextMain,
    alert,
  } = useAppContext();

  const methods = useForm<AddBudgetFormType>({resolver: yupResolver(addBudgetSchema)});

  const budgetID = pathname.split('/').at(-1);

  const budgetTypeId = location.pathname.split('/').at(2);

  const {insertBudget, loading: isSaving} = useInsertBudget();
  const {budgets} = useGetBudgets({});

  console.log(methods.formState.errors);

  //todo check if the same api endpoint is used when the OJ manager is filling the budget
  const onSubmit = async (data: AddBudgetFormType) => {
    if (isSaving) return;

    const limitsData = data.limits.map(item => ({
      organization_unit_id: item.organization_unit_id,
      limit: Number(item.limit),
    }));

    const payload = {
      id: budgetID === 'add-new' ? parseInt(budgetID) : null,
      year: data.year.toString(),
      budget_type: Number(budgetTypeId) || null,
      limits: limitsData,
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

  const availableYearsForBudget = useMemo(() => {
    if (!budgets) return [];

    const years = getYearOptions(6, false, 5);

    const existingBudgetYears = budgets.items?.map(budget => budget.year) || [];
    const filteredYears = years.filter(year => !existingBudgetYears.includes(Number(year.id)));

    return filteredYears;
  }, [budgets]);

  const year = methods.watch('year')?.id;
  const isValid = methods.formState.isValid;

  return (
    <ScreenWrapper>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content="Novi budžet" />
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
              control={methods.control}
              name="year"
              render={({field: {name, onChange, value}}) => (
                <Dropdown
                  name={name}
                  value={value}
                  onChange={onChange}
                  options={availableYearsForBudget}
                  placeholder="Odaberite godinu"
                />
              )}
            />
            <Controller
              control={methods.control}
              name="budget_type"
              render={({field: {name, onChange, value}}) => (
                <Dropdown
                  name={name}
                  value={value}
                  onChange={onChange}
                  options={budgetTypeOptions}
                  placeholder="Odaberite tip"
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
            onClick={methods.handleSubmit(onSubmit)}
            disabled={isValid}
          />
        </Footer>
      </OverviewBox>
      <FormProvider {...methods}>
        <BudgetLimitModal open={limitModal} onClose={() => setLimitModal(false)} />
      </FormProvider>
    </ScreenWrapper>
  );
};

export default BudgetCreate;
