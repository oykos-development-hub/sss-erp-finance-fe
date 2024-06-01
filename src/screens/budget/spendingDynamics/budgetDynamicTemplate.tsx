import {Button} from 'client-library';
import {useCallback, useEffect, useState} from 'react';
import {FormProvider, useFieldArray, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../../context/useAppContext';
import useGetBudgetDynamic from '../../../services/graphQL/budgetDynamic/useGetBudgetDynamic';
import useInsertBudgetDynamic from '../../../services/graphQL/budgetDynamic/useInsertBudgetDynamic';
import useGetCountOverview from '../../../services/graphQL/counts/useGetCountOverview';
import {BudgetDynamic} from '../../../types/graphQL/budgetDynamic';
import BudgetDynamicTable from './budgetDynamicTable';
import {MonthType, monthVars} from './constants';
import {TableWrapper} from './styles';

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
});

const dynamicCountArraySchema = yup.array().of(dynamicCountSchema);

const dynamicSchema = yup.object().shape({
  accounts: dynamicCountArraySchema.required(),
});

export type DynamicCountSchemaType = yup.InferType<typeof dynamicCountSchema>;
export type DynamicSchemaType = yup.InferType<typeof dynamicSchema>;

const BudgetDynamicTemplate = () => {
  const [invalidRows, setInvalidRows] = useState<number[]>([]);

  const {
    navigation: {
      location: {pathname},
    },
    alert,
  } = useAppContext();

  const version = isNaN(parseInt(pathname?.split('/')[5])) ? null : parseInt(pathname?.split('/')[5]);
  const isNew = pathname?.split('/')[5] === 'add-new';

  const methods = useForm<DynamicSchemaType>();
  const {append, fields} = useFieldArray({name: 'accounts', control: methods.control});

  const {counts} = useGetCountOverview({id: 0, tree: false, level: 3});
  const {budgetDynamic, refetch, loading} = useGetBudgetDynamic({version});
  const {insertBudgetDynamic} = useInsertBudgetDynamic();

  const setupBudgetingFormFields = useCallback(
    (item: BudgetDynamic) => {
      const months: {[key: string]: number} = {};
      let totalSavings = 0;

      monthVars.forEach((month: MonthType) => {
        months[month] = parseInt(item[month].value);
        totalSavings += parseInt(item[month].savings);
      });

      const data: any = {
        account_id: item.account_id,
        actual: parseInt(item.actual),
        totalSavings,
        ...months,
      };
      append(data);
    },
    [append, monthVars],
  );

  useEffect(() => {
    if (budgetDynamic && counts) {
      budgetDynamic.forEach((item: BudgetDynamic) => {
        setupBudgetingFormFields(item);
      });
    }
  }, [counts, budgetDynamic, setupBudgetingFormFields]);

  const validateAmounts = (data: DynamicSchemaType) => {
    let invalidCounts: number[] = [];

    data.accounts.forEach((item: DynamicCountSchemaType, index: number) => {
      const total = Object.keys(item).reduce((acc: number, key) => {
        const monthKey = key as keyof DynamicCountSchemaType;

        return monthKey !== 'account_id' && monthKey !== 'actual' && monthKey !== 'totalSavings'
          ? acc + item[monthKey]
          : acc;
      }, 0);

      const totalAmount = total + Number(item.totalSavings);
      if (totalAmount !== item.actual) {
        invalidCounts.push(index);
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
      const insertData = data.accounts.map((item: DynamicCountSchemaType) => {
        const {account_id, actual, totalSavings, ...months} = item;

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
          <BudgetDynamicTable
            invalidRows={invalidRows}
            fields={fields}
            counts={counts}
            disabled={!isNew}
            version={version}
            loading={loading}
          />
        </TableWrapper>
      </FormProvider>

      {isNew && (
        <div style={{marginTop: 22, display: 'flex'}}>
          <Button
            variant="secondary"
            content="Otkaži"
            style={{marginLeft: 'auto', marginRight: 15}}
            onClick={() => window.history.back()}
          />
          <Button variant="primary" onClick={methods.handleSubmit(onSubmit)} content="Sačuvaj" />
        </div>
      )}
    </div>
  );
};

export default BudgetDynamicTemplate;
