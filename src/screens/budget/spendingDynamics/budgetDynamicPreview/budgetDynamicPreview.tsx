import {Input, Typography} from 'client-library';
import {ReactNode, useMemo, useState} from 'react';
import ChevronIcon from '../../../../components/icons/ChevronIcon';
import useAppContext from '../../../../context/useAppContext';
import useGetBudgetDynamic from '../../../../services/graphQL/budgetDynamic/useGetBudgetDynamic';
import {BudgetText, CustomTable, CustomTableHead, FlexContainer} from '../../../../shared/budgetTable/styles';
import {BudgetDynamicCount} from '../../../../types/graphQL/budgetDynamic';
import {MonthType, dynamicPreviewTableHeads, monthVars} from '../constants';
import {DynamicTableCell} from '../styles';

// There is no form functionality in this component, it is only for viewing the data

const BudgetDynamicPreview = () => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();

  const version = isNaN(parseInt(pathname?.split('/')[5])) ? null : parseInt(pathname?.split('/')[5]);

  const {budgetDynamic} = useGetBudgetDynamic({version});

  const recursiveRowRendering = (items: BudgetDynamicCount[], level = 1, path = [] as string[]) => {
    if (!items) return null;

    return items.map((item: BudgetDynamicCount, index) => {
      const fieldPath = [...path, item.id.toString()];
      return (
        <BudgetDynamicTableRow key={`table-row${index}`} level={level} count={item}>
          {recursiveRowRendering(item.children ?? [], item.children ? level + 1 : level - 1, fieldPath)}
        </BudgetDynamicTableRow>
      );
    });
  };

  const content = useMemo(() => {
    if (budgetDynamic) {
      return recursiveRowRendering(budgetDynamic);
    }
  }, [budgetDynamic]);

  return (
    <div style={{overflowX: 'scroll'}}>
      <CustomTable disabled={false} style={{marginTop: 22}}>
        <thead>
          <tr>
            {dynamicPreviewTableHeads.map(head => (
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
    </div>
  );
};

export default BudgetDynamicPreview;

type BudgetTableRowProps = {
  count: BudgetDynamicCount;
  level: number;
  children: ReactNode;
  total_savings?: string;
};

const BudgetDynamicTableRow = ({count, level, children}: BudgetTableRowProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

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
          hasChildren={!!count?.children?.length}>
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

        {monthVars.map((value: MonthType, index) => {
          const monthObj = count[value as keyof BudgetDynamicCount];
          return (
            <DynamicTableCell key={`${value}-${index}`} level={level}>
              <div style={{width: 100}}>
                <Input disabled={true} value={monthObj.value as any} />
                <BudgetText variant="bodySmall" content={monthObj.savings} />
              </div>
            </DynamicTableCell>
          );
        })}
        <DynamicTableCell level={level}>
          <div style={{width: 100}}>
            <Input disabled={true} value={count.total_savings} />
          </div>
        </DynamicTableCell>
        <DynamicTableCell level={level}>
          <BudgetText content={count.actual} variant="bodySmall" />
        </DynamicTableCell>
      </tr>

      {isCollapsed && children}
    </>
  );
};
