import {Input, Theme, Typography} from 'client-library';
import {useMemo} from 'react';
import {useFormContext} from 'react-hook-form';
import styled from 'styled-components';
import {months} from '../../../shared/budgetTable/constants.tsx';
import {BudgetText, CustomTable, CustomTableHead, FlexContainer} from '../../../shared/budgetTable/styles.ts';
import {Count} from '../../../types/graphQL/counts.ts';
import {DynamicCountSchemaType, DynamicSchemaType} from './budgetDynamicTemplate.tsx';
import {MonthType, monthVars} from './constants.tsx';

type BudgetTableProps = {
  counts: Count[];
  disabled?: boolean;
  version?: number | null;
  fields: DynamicCountSchemaType[];
  invalidRows: number[];
  loading?: boolean;
};

const BudgetDynamicTable = ({counts, disabled, fields = [], invalidRows, loading}: BudgetTableProps) => {
  const methods = useFormContext<DynamicSchemaType>();
  const currentMonth = new Date().getMonth();

  const contentRender = (items: Count[]) => {
    if (!items) return null;

    return items.map((item: Count) => {
      const field = fields.find((field: DynamicCountSchemaType) => field.account_id === item.id);
      const fieldIndex = fields.findIndex((field: DynamicCountSchemaType) => field.account_id === item.id);

      const invalid = invalidRows.includes(fieldIndex);
      return (
        <>
          <tr>
            <CountTableCell invalid={invalid}>
              <FlexContainer>
                <Typography
                  content={`${item.serial_number} - ${item.title}`}
                  variant="bodySmall"
                  style={{
                    padding: `12px 7px`,
                  }}
                />
              </FlexContainer>
            </CountTableCell>

            {monthVars.map((value: MonthType, index) => (
              <CountTableCell key={`${value}-${index}`} invalid={invalid}>
                <div style={{width: 100}}>
                  <Input
                    {...methods.register(`accounts.${fieldIndex}.${value}`, {valueAsNumber: true})}
                    disabled={disabled || currentMonth > index}
                    type={'number'}
                  />
                  <BudgetText content="0.00" variant="bodySmall" style={{color: 'red'}} />
                </div>
              </CountTableCell>
            ))}
            <CountTableCell invalid={invalid}>
              <div style={{width: 100}}>
                <Input
                  {...methods.register(`accounts.${fieldIndex}.totalSavings`, {valueAsNumber: true})}
                  disabled={disabled}
                  type={'number'}
                />
              </div>
            </CountTableCell>
            <CountTableCell invalid={invalid}>
              <BudgetText content={field?.actual} variant="bodySmall" />
            </CountTableCell>
          </tr>
        </>
      );
    });
  };

  const content = useMemo(() => {
    if (counts && fields.length) {
      return contentRender(counts);
    }
  }, [counts, fields, invalidRows]);

  const tableHeads = [
    {name: 'Konto', width: 10},
    ...months.map(month => ({name: month, width: 4})),
    {name: 'Ukupan ostatak', width: 10},
    {name: 'Ukupno', width: 10},
  ];

  return (
    <CustomTable disabled={false}>
      <thead>
        <tr>
          {tableHeads.map(head => (
            <CustomTableHead key={head.name} style={{width: `${head.width}%`}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography content={head.name} variant="bodySmall" />
              </div>
            </CustomTableHead>
          ))}
        </tr>
      </thead>

      <tbody>{content}</tbody>
    </CustomTable>
  );
};

export default BudgetDynamicTable;

const CountTableCell = styled.td<{invalid?: boolean}>`
  padding: 12px 24px;
  border: 1px solid ${Theme.palette.gray300};
  background-color: ${props => (props.invalid ? Theme.palette.gray50 : Theme.palette.white)};
`;
