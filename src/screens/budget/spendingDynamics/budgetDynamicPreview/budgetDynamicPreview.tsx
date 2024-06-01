import {Input, Theme, Typography} from 'client-library';
import {ReactNode, useMemo, useState} from 'react';
import styled from 'styled-components';
import ChevronIcon from '../../../../components/icons/ChevronIcon';
import useAppContext from '../../../../context/useAppContext';
import useGetBudgetDynamic from '../../../../services/graphQL/budgetDynamic/useGetBudgetDynamic';
import {BudgetText, CustomTable, CustomTableHead, FlexContainer} from '../../../../shared/budgetTable/styles';
import {BudgetDynamicCount} from '../../../../types/graphQL/budgetDynamic';
import {MonthType, dynamicPreviewTableHeads, monthVars} from '../constants';

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

    return items.map((item: BudgetDynamicCount) => {
      const fieldPath = [...path, item.id.toString()];
      return (
        <BudgetDynamicTableRow key={item.id} level={level} count={item}>
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

  const totalSavings = useMemo(() => {
    if (count) {
      return monthVars.reduce((acc: number, month: string) => {
        const currSavings = parseInt(count[month as keyof BudgetDynamicCount].savings);
        return acc + currSavings;
      }, 0);
    }
  }, [count]);

  return (
    <>
      <tr>
        <DynamicPreviewTableCell level={level} onClick={count.children?.length ? onCollapse : undefined} first>
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
        </DynamicPreviewTableCell>

        {monthVars.map((value: MonthType, index) => {
          const monthObj = count[value as keyof BudgetDynamicCount];
          return (
            <DynamicPreviewTableCell key={`${value}-${index}`} level={level}>
              <div style={{width: 100}}>
                <Input disabled={true} value={monthObj.value as any} />
                <BudgetText variant="bodySmall" content={monthObj.savings} />
              </div>
            </DynamicPreviewTableCell>
          );
        })}
        <DynamicPreviewTableCell level={level}>
          <div style={{width: 100}}>
            <Input disabled={true} value={totalSavings?.toString()} />
          </div>
        </DynamicPreviewTableCell>
        <DynamicPreviewTableCell level={level}>
          <BudgetText content={count.actual} variant="bodySmall" />
        </DynamicPreviewTableCell>
      </tr>

      {isCollapsed && children}
    </>
  );
};

const resolveBackgroundColor = (level: number) => {
  if (level === 1) return Theme.palette.gray200;
  if (level === 2) return Theme.palette.gray100;
  if (level === 3) return Theme.palette.gray50;
  return Theme.palette.white;
};

const DynamicPreviewTableCell = styled.td<{
  level: number;
  first?: boolean;
  lastLevel?: boolean;
}>`
  padding: 12px 24px;
  border: 1px solid ${Theme.palette.gray300};

  background-color: ${({level}) => resolveBackgroundColor(level)};

  cursor: ${({level, first}) => (level === 1 && first ? 'pointer' : 'default')};

  ${({first}) => first && 'min-width: 280px'}
`;
