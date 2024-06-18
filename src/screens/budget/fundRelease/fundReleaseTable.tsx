import {Typography} from 'client-library';
import {useMemo, useState} from 'react';
import {FormProvider, useFormContext} from 'react-hook-form';
import ChevronIcon from '../../../components/icons/ChevronIcon.tsx';
import {BudgetText, CustomTable, CustomTableHead, FlexContainer} from '../../../shared/budgetTable/styles.ts';
import {FlexRow} from '../../../shared/flex.ts';
import {BudgetDynamicCount} from '../../../types/graphQL/budgetDynamic';
import {DynamicTableCell} from '../spendingDynamics/styles.tsx';
import {FundReleaseCheckbox, FundReleaseInput} from './styles.ts';
import {FundReleaseDetailsItem} from '../../../types/graphQL/fundRelease.ts';

type BudgetTableProps = {
  counts: BudgetDynamicCount[];
  invalidRows: string[];
  loading?: boolean;
  onEnableRow: (row: string) => void;
  enabledRows: string[];
  allEnabled: boolean;
  details: any;
};

const FundReleaseTable = ({counts, invalidRows, onEnableRow, enabledRows, allEnabled, details}: BudgetTableProps) => {
  const methods = useFormContext<any>();

  const currentMonth = new Date().toLocaleString('default', {month: 'long'}).toLowerCase();

  const recursiveRowRendering = (items: BudgetDynamicCount[], level = 1, path = [] as string[]) => {
    if (!items) return null;

    return items.map((item: BudgetDynamicCount) => {
      const fieldPath = [...path, item.id.toString()];
      const rowInvalid = invalidRows.includes(item.account_serial_number);
      const disabled = !enabledRows.includes(item.account_serial_number) && !allEnabled;
      const maxValue = item[currentMonth as keyof BudgetDynamicCount].value;
      return (
        <FundReleaseRow
          key={item.account_id}
          level={level}
          count={item}
          invalid={rowInvalid}
          disabled={disabled}
          maxValue={maxValue}
          onEnableRow={onEnableRow}
          isDetails={false}>
          {recursiveRowRendering(item.children ?? [], item.children ? level + 1 : level - 1, fieldPath)}
        </FundReleaseRow>
      );
    });
  };

  const detailsRowRendering = (items: FundReleaseDetailsItem[], level = 1) => {
    if (!items) return null;

    return items.map((item: FundReleaseDetailsItem) => {
      const maxValue = item.planned;
      return (
        <FundReleaseRow
          key={item.account_id}
          level={level}
          count={item}
          disabled={true}
          maxValue={maxValue}
          onEnableRow={onEnableRow}
          isDetails={true}>
          {detailsRowRendering(item.children ?? [], item.children ? level + 1 : level - 1)}
        </FundReleaseRow>
      );
    });
  };

  const content = useMemo(() => {
    if (details.length > 0) {
      return detailsRowRendering(details);
    } else {
      if (counts) {
        return recursiveRowRendering(counts);
      }
    }
  }, [counts, invalidRows, enabledRows, allEnabled]);

  const fundReleaseTemplateHeads =
    details.length > 0
      ? [
          {name: 'Ekonomska klasifikacija', width: 10},
          {name: 'Iznos iz plana potrošnje', width: 4},
          {name: 'Iznos', width: 10},
        ]
      : [
          {name: '', width: 2},
          {name: 'Ekonomska klasifikacija', width: 10},
          {name: 'Iznos iz plana potrošnje', width: 4},
          {name: 'Iznos', width: 10},
        ];

  return (
    <CustomTable disabled={false}>
      <thead>
        <tr>
          {fundReleaseTemplateHeads.map((head, index) => (
            <CustomTableHead key={head.name} style={{width: `${head.width}%`}}>
              {index === 0 && !details.length ? (
                <FlexRow align="center" justify="center" style={{width: '100%'}}>
                  <FundReleaseCheckbox name="selectAll" onChange={() => onEnableRow('all')} checked={allEnabled} />
                </FlexRow>
              ) : (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Typography content={head.name} variant="bodySmall" />
                </div>
              )}
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

export default FundReleaseTable;

type BudgetTableRowProps = {
  count: BudgetDynamicCount | FundReleaseDetailsItem;
  level: number;
  children: React.ReactNode;
  methods?: any;
  invalid?: boolean;
  disabled: boolean;
  maxValue: number;
  onEnableRow: (row: string) => void;
  isDetails?: boolean;
};

const FundReleaseRow = ({
  count,
  level,
  children,
  invalid,
  disabled,
  maxValue,
  onEnableRow,
  isDetails,
}: BudgetTableRowProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const methods = useFormContext<any>();

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
        {!isDetails && (
          <DynamicTableCell level={level}>
            {!count.children?.length && (
              <FundReleaseCheckbox
                name={count.account_serial_number}
                onChange={() => onEnableRow(count.account_serial_number)}
                checked={!disabled}
              />
            )}
          </DynamicTableCell>
        )}

        <DynamicTableCell
          level={level}
          onClick={count.children?.length ? onCollapse : undefined}
          first
          hasChildren={!!count.children?.length}>
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
        <DynamicTableCell level={level}>
          <BudgetText content={maxValue} variant="bodySmall" />
        </DynamicTableCell>
        {isDetails && 'planned' in count ? (
          <DynamicTableCell level={level}>
            {!count.children?.length && (
              <FlexRow justify="center" align="center" style={{width: '100%'}}>
                <FundReleaseInput value={count.value.toString()} disabled={true} />
              </FlexRow>
            )}
          </DynamicTableCell>
        ) : (
          <DynamicTableCell level={level}>
            {!count.children?.length && (
              <FlexRow justify="center" align="center" style={{width: '100%'}}>
                <FundReleaseInput
                  {...methods.register(`${count.account_serial_number}.value` as any, {
                    valueAsNumber: true,
                  })}
                  type={'number'}
                  disabled={disabled}
                  invalid={invalid}
                />
              </FlexRow>
            )}
          </DynamicTableCell>
        )}
      </tr>

      {isCollapsed && children}
    </>
  );
};
