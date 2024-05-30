import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo} from 'react';
import {Typography, Checkbox} from 'client-library';
import {BudgetTableMethods, BudgetTableStep} from './types';
import {baseTableHeads, getBudgetTableHeads, sourceOptions} from './constants';
import {CustomTable, CustomTableHead} from './styles';
import {Count} from '../../types/graphQL/counts';
import {FormProvider, useForm} from 'react-hook-form';
import BudgetTableRow from './components/budgetTableRow';
import useGetCountOverview from '../../services/graphQL/counts/useGetCountOverview.ts';

// TODO Take out typography from the base tableHeads as a styled component ?

type BudgetTableProps = {
  step: BudgetTableStep | `${BudgetTableStep}`;
  organizationUnitId: number;
  year: number;
  countsProps?: Count[];
  isTableDisabled?: boolean;
};

// BudgetTable component modified for the finance manager
const BudgetTableFinanceManager = forwardRef<BudgetTableMethods, BudgetTableProps>(
  ({step, year, countsProps, isTableDisabled}, ref) => {
    const methods = useForm();
    const allData = methods.watch();

    // If counts are passed through props, don't fetch them from the BE
    const {counts: countsFromBE} = useGetCountOverview({id: 0, tree: true});
    const counts = countsProps ?? countsFromBE;
    const updateParentValues = (field: string) => {
      // Number of iterations - remove one because the last level contains the last level id and the fieldName
      const numberOfLevels = field.split('.').length - 1;

      // Only the ids path
      const fieldIdPath = field.split('-')[0].split('.');
      // Field name (e.g currentYearBudget)
      const fieldName = field.split('-')[1];
      // The current path which
      let currentFieldPath = fieldIdPath.slice(0, numberOfLevels).join('.');

      for (let i = 0; i < numberOfLevels; i++) {
        const parentValue = calculateParentValues(currentFieldPath.split('.'), fieldName);

        methods.setValue(`${currentFieldPath}-${fieldName}`, parentValue);

        currentFieldPath = currentFieldPath
          .split('.')
          .slice(0, currentFieldPath.split('.').length - 1)
          .join('.');
      }
    };

    const calculateParentValues = (fieldPath: string[], fieldName: string) => {
      const childFieldNames = getChildFieldNames(fieldPath, fieldName);

      const parentValue = childFieldNames.reduce((sum, childField) => {
        const currentChildVal = methods.getValues(childField);
        return sum + (currentChildVal ? Number(currentChildVal) : 0);
      }, 0);

      return parentValue;
    };

    const getChildFieldNames = (fieldPath: string[], fieldName: string) => {
      const pathString = fieldPath.join('.');

      return Object.keys(methods.getValues(pathString))
        .filter(field => !field.includes('description') && field.includes(fieldName))
        .map(field => `${pathString}.${field}`);
    };

    const setupBudgetingFormFields = useCallback(
      (item: Count, path = [] as string[]) => {
        const fieldPath = [...path, item.id.toString()]; // Keep track of the field's path
        // Add the field for the current item
        methods.setValue(
          `${fieldPath.join('.')}-currentYearBudget`,
          item.filled_data ? item.filled_data.current_year : '0',
        );
        methods.setValue(`${fieldPath.join('.')}-nextYearBudget`, item.filled_data ? item.filled_data.next_year : '0');
        methods.setValue(
          `${fieldPath.join('.')}-yearAfterNextBudget`,
          item.filled_data ? item.filled_data.year_after_next : '0',
        );

        // // Need to have account ID inside the form for the budget financial step and maybe some other steps
        // if (step === BudgetTableStep.BUDGET_FINANCIAL) {
        //   methods.setValue(`${fieldPath.join('.')}-accountId`, parseInt(item.));
        // }

        if (step === BudgetTableStep.BUDGETING_ACTUAL) {
          methods.setValue(`${fieldPath.join('.')}-actualBudget`, '0');
        }

        if (!item.children?.length) {
          // TODO budget financial doesn't have source check what other types don't need it and make a better condition
          step !== BudgetTableStep.BUDGET_FINANCIAL &&
            methods.setValue(`${fieldPath.join('.')}-source`, sourceOptions[0]);
          methods.setValue(`${fieldPath.join('.')}-description`, item.filled_data ? item.filled_data.description : '');
        }

        // Traverse the children recursively
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => setupBudgetingFormFields(child, fieldPath));
        }
      },
      [methods, step],
    );

    const recursiveRowRendering = (items: Count[], level = 1, path = [] as string[]) => {
      if (!items) return null;

      return items.map((item: Count) => {
        const fieldPath = [...path, item.id.toString()];
        return (
          <BudgetTableRow
            key={item.id}
            step={step}
            count={item}
            level={level}
            fieldPath={fieldPath}
            updateParentValues={updateParentValues}>
            {recursiveRowRendering(item.children ?? [], item.children ? level + 1 : level - 1, fieldPath)}
          </BudgetTableRow>
        );
      });
    };

    useEffect(() => {
      counts.forEach(item => setupBudgetingFormFields(item));
    }, [counts, setupBudgetingFormFields, step]);

    const content = useMemo(() => {
      return recursiveRowRendering(counts);
    }, [counts, step, year]);

    const tableHeads = useMemo(() => {
      return getBudgetTableHeads(year, step);
    }, [year, step]);

    const tableDisabled =
      step === BudgetTableStep.CREATING || step === BudgetTableStep.AWAITING_APPROVAL || !!isTableDisabled;

    useImperativeHandle(ref, () => ({
      getInternalState: () => {
        return allData; // Return whatever internal state or data needed
      },
      resetForm: () => {
        methods.reset();
        console.log('reset form');
      },
    }));

    return (
      <FormProvider {...methods}>
        <CustomTable disabled={tableDisabled}>
          <thead>
            <tr>
              {[...baseTableHeads, ...tableHeads].map(head => (
                <CustomTableHead
                  key={head.name}
                  style={{width: `${head.width}%`}}
                  rebalanceCol={['+', '-'].some(s => head.name.includes(s))}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography content={head.name} variant="bodySmall" />
                    {/* TO DO add logic for check all, for now we do not have BE */}
                    {head.checkbox && (
                      <Checkbox name={''} onChange={undefined} checked={false} style={{marginLeft: '20px'}} />
                    )}
                  </div>
                </CustomTableHead>
              ))}
            </tr>
          </thead>

          <tbody>{content}</tbody>
        </CustomTable>
      </FormProvider>
    );
  },
);

BudgetTableFinanceManager.displayName = 'BudgetTableFinanceManager';
export default BudgetTableFinanceManager;
