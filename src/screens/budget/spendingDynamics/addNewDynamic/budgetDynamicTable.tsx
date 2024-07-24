import {Typography} from 'client-library';
import {useMemo, useState} from 'react';
import {Controller, FormProvider, useFormContext} from 'react-hook-form';
import ChevronIcon from '../../../../components/icons/ChevronIcon.tsx';
import {BudgetText, CustomTable, CustomTableHead, FlexContainer} from '../../../../shared/budgetTable/styles.ts';
import {BudgetDynamicCount} from '../../../../types/graphQL/budgetDynamic.ts';
import {MonthType, dynamicTableHeads, monthVars} from '../constants.tsx';
import {DynamicTableCell, DynamicTableInput} from '../styles.tsx';
import {DynamicSchemaType} from './budgetDynamicTemplate.tsx';

type BudgetTableProps = {
  counts: BudgetDynamicCount[];
  invalidRows: string[];
  loading?: boolean;
};

const BudgetDynamicTable = ({counts, invalidRows}: BudgetTableProps) => {
  const methods = useFormContext<DynamicSchemaType>();

  const recursiveRowRendering = (items: BudgetDynamicCount[], level = 1, path = [] as string[]) => {
    if (!items) return null;

    return items.map((item: BudgetDynamicCount) => {
      const fieldPath = [...path, item.id.toString()];
      const rowInvalid = invalidRows.includes(item.account_serial_number);
      return (
        <BudgetDynamicFormRow key={item.account_id} level={level} count={item} invalid={rowInvalid}>
          {recursiveRowRendering(item.children ?? [], item.children ? level + 1 : level - 1, fieldPath)}
        </BudgetDynamicFormRow>
      );
    });
  };

  const content = useMemo(() => {
    if (counts) {
      return recursiveRowRendering(counts);
    }
  }, [counts, invalidRows]);

  return (
    <CustomTable disabled={false}>
      <thead>
        <tr>
          {dynamicTableHeads.map(head => (
            <CustomTableHead key={head.name} style={{width: `${head.width}%`}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography content={head.name} variant="bodySmall" />
              </div>
            </CustomTableHead>
          ))}
        </tr>
      </thead>

      <tbody>
        <FormProvider {...methods}>{content}</FormProvider>
      </tbody>
    </CustomTable>
  );
};

export default BudgetDynamicTable;

type BudgetTableRowProps = {
  count: BudgetDynamicCount;
  level: number;
  children: React.ReactNode;
  methods?: any;
  invalid: boolean;
};

const BudgetDynamicFormRow = ({count, level, children, invalid}: BudgetTableRowProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const methods = useFormContext<any>();
  const currentMonth = new Date().getMonth();

  const onCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const generateChevronIcon = () => {
    return (
      <div style={{width: 28}}>
        <ChevronIcon
          fill="black"
          style={{
            transform: isCollapsed ? 'rotate(0deg)' : 'rotate(-90deg)',
            width: `${28 - level * 1}px`,
            height: `${28 - level * 1}px`,
            marginRight: 10,
          }}
        />
      </div>
    );
  };

  return (
    <>
      <tr>
        <DynamicTableCell
          level={level}
          onClick={count.children?.length ? onCollapse : undefined}
          first
          hasChildren={!!count.children.length}>
          <FlexContainer>
            {!!count.children?.length && generateChevronIcon()}
            <Typography
              content={`${count.account_serial_number} - ${count.account_title}`}
              variant="bodySmall"
              style={{
                marginLeft: 26,
                fontWeight: level < 4 ? 600 : 400,
                padding: `12px ${(level - 1) * 7}`,
                fontSize: `${24 - level * 2}px`,
              }}
            />
          </FlexContainer>
        </DynamicTableCell>

        {monthVars.map((value: MonthType, index) => (
          <DynamicTableCell key={`${value}-${index}`} level={level}>
            <div style={{width: 100}}>
              <DynamicTableInput
                {...methods.register(`${count.account_serial_number}.${value}` as any, {valueAsNumber: true})}
                disabled={
                  (currentMonth === index && !count.is_current_month_editable) ||
                  currentMonth > index ||
                  count.children?.length > 0
                }
                // type={'number'}
                invalid={invalid}
              />
              <BudgetText content={count[value].savings} variant="bodySmall" />
            </div>
          </DynamicTableCell>
        ))}
        <DynamicTableCell level={level}>
          <div style={{width: 100}}>
            <Controller
              name={`${count.account_serial_number}.totalSavings`}
              control={methods.control}
              render={({field: {onChange, value}}) => (
                <DynamicTableInput
                  value={value}
                  onChange={onChange}
                  type={'currency'}
                  disabled={count.children?.length > 0}
                  invalid={invalid}
                />
              )}
            />
          </div>
        </DynamicTableCell>
        <DynamicTableCell level={level}>
          <BudgetText content={count?.actual} variant="bodySmall" />
        </DynamicTableCell>
      </tr>

      {isCollapsed && children}
    </>
  );
};
