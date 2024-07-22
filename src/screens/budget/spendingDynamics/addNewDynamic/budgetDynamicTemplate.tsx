import {Button} from 'client-library';
import {useCallback, useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../../../context/useAppContext';
import useGetBudgetDynamic from '../../../../services/graphQL/budgetDynamic/useGetBudgetDynamic';
import useInsertBudgetDynamic from '../../../../services/graphQL/budgetDynamic/useInsertBudgetDynamic';
import {BudgetDynamicCount} from '../../../../types/graphQL/budgetDynamic';
import {MonthType, monthVars} from '../constants';
import {TableWrapper} from '../styles';
import BudgetDynamicTable from './budgetDynamicTable';

const dynamicCountSchema = yup.object().shape({
  january: yup.number().required(),
  february: yup.number().required(),
  march: yup.number().required(),
  april: yup.number().required(),
  may: yup.number().required(),
  june: yup.number().required(),
  july: yup.number().required(),
  august: yup.number().required(),
  september: yup.number().required(),
  october: yup.number().required(),
  november: yup.number().required(),
  december: yup.number().required(),
  account_id: yup.number().required(),
  actual: yup.number().required(),
  totalSavings: yup.number().required(),
  totalSavingsInit: yup.number().required(),
  bottomLevel: yup.boolean().required(),
}) as any;

const nonMonthKeys = [
  'account_id',
  'actual',
  'totalSavings',
  'totalSavingsInit',
  'bottomLevel',
  'account_serial_number',
];

const mapRules = (map: any, rule: any) => Object.keys(map).reduce((newMap, key) => ({...newMap, [key]: rule}), {});

const dynamicSchema = yup.lazy(map => yup.object(mapRules(map, yup.object(dynamicCountSchema))));

export type DynamicCountSchemaType = yup.InferType<typeof dynamicCountSchema>;
export type DynamicSchemaType = yup.InferType<typeof dynamicSchema>;

const BudgetDynamicTemplate = () => {
  const [invalidRows, setInvalidRows] = useState<string[]>([]);
  const [totalSavingsList, setTotalSavingsList] = useState<{value: number; serialNumber: string}[]>([]);

  const {alert} = useAppContext();

  const methods = useForm<any>();

  const {budgetDynamic, refetch, loading} = useGetBudgetDynamic({});
  const {insertBudgetDynamic} = useInsertBudgetDynamic();

  const setupBudgetingFormFieldsRecursively = useCallback(
    (item: BudgetDynamicCount) => {
      const months: {[key: string]: number} = {};
      const bottomLevel = item.children.length === 0;
      let totalSavingsBottom = 0;

      monthVars.forEach((month: MonthType) => {
        months[month] = parseFloat(item[month].value);
        totalSavingsBottom += parseFloat(item[month].savings);
      });

      setTotalSavingsList(prev => [...prev, {value: totalSavingsBottom, serialNumber: item.account_serial_number}]);

      const data: any = {
        account_id: item.account_id,
        actual: parseFloat(item.actual),
        totalSavings: parseFloat(item.total_savings),
        totalSavingsInit: parseFloat(item.total_savings),
        bottomLevel,
        account_serial_number: item.account_serial_number,
        ...months,
      };

      methods.setValue(item.account_serial_number, data);

      item.children.forEach((child: BudgetDynamicCount) => {
        setupBudgetingFormFieldsRecursively(child);
      });
    },
    [methods, monthVars],
  );

  useEffect(() => {
    if (budgetDynamic && budgetDynamic) {
      budgetDynamic.forEach((item: BudgetDynamicCount) => {
        setupBudgetingFormFieldsRecursively(item);
      });
    }
  }, [budgetDynamic, setupBudgetingFormFieldsRecursively]);

  const validateAmounts = (data: DynamicSchemaType) => {
    const invalidCounts: string[] = [];

    Object.values(data).forEach((item: DynamicCountSchemaType) => {
      if (!item.bottomLevel) return;

      const totalMonthsAmount = Object.keys(item).reduce((acc: number, key) => {
        const monthKey = key as keyof DynamicCountSchemaType;
        const isMonth = nonMonthKeys.indexOf(monthKey as string) === -1;

        return isMonth ? acc + parseFloat(item[monthKey]) : acc;
      }, 0);

      const initialTotalSaving = totalSavingsList.find(
        totalItem => totalItem.serialNumber === item.account_serial_number,
      )!;

      const totalMonthsWithSavings = totalMonthsAmount + parseFloat(item.totalSavings) - initialTotalSaving?.value;

      const totalInitial = parseFloat(item.actual);

      const isTotalEqual = parseFloat(totalMonthsWithSavings.toFixed(2)) !== parseFloat(totalInitial.toFixed(2));

      if (isTotalEqual) {
        invalidCounts.push(item.account_serial_number);
      }
    });

    return invalidCounts;
  };

  const onSubmit = async (data: DynamicSchemaType) => {
    const invalidCounts = validateAmounts(data);

    if (invalidCounts.length) {
      setInvalidRows(invalidCounts);
      alert.error('Uneseni iznosi nisu ispravni!');
      return;
    } else {
      setInvalidRows([]);
      const insertData = Object.values(data)
        .filter((item: DynamicCountSchemaType) => !!item.bottomLevel)
        .map((item: DynamicCountSchemaType) => {
          const {account_id, actual, totalSavings, bottomLevel, account_serial_number, totalSavingsInit, ...months} =
            item;

          return {
            account_id,
            ...months,
          };
        });

      await insertBudgetDynamic(
        insertData,
        () => {
          alert.success('Uspešno ste sačuvali podatke!');
          refetch();
        },
        () => alert.error('Došlo je do greške prilikom čuvanja podataka!'),
      );
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <TableWrapper>
          <BudgetDynamicTable invalidRows={invalidRows} counts={budgetDynamic} loading={loading} />
        </TableWrapper>
      </FormProvider>

      <div style={{marginTop: 22, display: 'flex'}}>
        <Button
          variant="secondary"
          content="Otkaži"
          style={{marginLeft: 'auto', marginRight: 15}}
          onClick={() => window.history.back()}
        />
        <Button variant="primary" onClick={methods.handleSubmit(onSubmit)} content="Sačuvaj" />
      </div>
    </div>
  );
};

export default BudgetDynamicTemplate;
