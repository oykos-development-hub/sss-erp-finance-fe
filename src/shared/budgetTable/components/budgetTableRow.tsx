import {Typography, ChevronRightIcon, Theme, Dropdown, ChevronDownIcon, EditIconTwo, Input} from 'client-library';
import {ReactNode, useState, useMemo} from 'react';
import {Count} from '../../../types/graphQL/counts';
import {months, sourceOptions} from '../constants';
import {BudgetText, CountTableCell, FlexContainer} from '../styles';
import {BudgetTableStep} from '../types';
import BudgetingForm from './budgetingForm';
import {useFormContext, Controller} from 'react-hook-form';

type BudgetTableRowProps = {
  step: BudgetTableStep | `${BudgetTableStep}`;
  count: Count;
  level: number;
  fieldPath: string[];
  children: ReactNode;
  updateParentValues: (fieldPath: string) => void;
};

const BudgetTableRow = ({step, count, level, fieldPath, children, updateParentValues}: BudgetTableRowProps) => {
  const {control} = useFormContext();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const onCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const content = useMemo(() => {
    switch (step) {
      case BudgetTableStep.CREATING:
      case BudgetTableStep.AWAITING_APPROVAL:
        return (
          <>
            <CountTableCell level={level}>
              <BudgetText content="" variant="bodySmall" />
            </CountTableCell>
            <CountTableCell level={level}>
              <Typography content="" variant="bodySmall" />
            </CountTableCell>
            <CountTableCell level={level}>
              <BudgetText content="" variant="bodySmall" />
            </CountTableCell>
            <CountTableCell level={level}>
              <BudgetText content="" variant="bodySmall" />
            </CountTableCell>
          </>
        );
      case BudgetTableStep.BUDGETING:
      case BudgetTableStep.BUDGETING_ACTUAL:
        return (
          <BudgetingForm
            updateParentValues={updateParentValues}
            level={level}
            lastLevel={!count.children?.length}
            fieldPath={fieldPath}
            actual={step === BudgetTableStep.BUDGETING_ACTUAL}
          />
        );
      case BudgetTableStep.VIEW_ANNUAL:
        return (
          <>
            <CountTableCell level={level}>
              <BudgetText content="0.00" variant="bodySmall" />
            </CountTableCell>
            <CountTableCell level={level}>
              <BudgetText content="0.00" variant="bodySmall" />
            </CountTableCell>
            <CountTableCell level={level}>
              <BudgetText content="0.00" variant="bodySmall" />
            </CountTableCell>
          </>
        );
      case BudgetTableStep.VIEW_MONTHLY:
        return (
          <>
            {months.map((value, index) => (
              <CountTableCell level={level} key={`${value}-${index}`}>
                <div style={{width: 50}}>
                  <BudgetText content="0.00" variant="bodySmall" />
                </div>
              </CountTableCell>
            ))}
            <CountTableCell level={level}>
              <BudgetText content="0.00" variant="bodySmall" />
            </CountTableCell>
          </>
        );
      case BudgetTableStep.REBALANCING:
        return (
          <>
            <CountTableCell level={level}>
              <BudgetText content="0.00" variant="bodySmall" />
            </CountTableCell>
            <CountTableCell level={level}>
              <BudgetText content="0.00" variant="bodySmall" />
            </CountTableCell>
            <CountTableCell level={level}>
              <BudgetText content="0.00" variant="bodySmall" />
            </CountTableCell>
            <CountTableCell level={level} rebalanceCol>
              <BudgetText content="0.00" variant="bodySmall" />
            </CountTableCell>
            <CountTableCell level={level} rebalanceCol>
              <BudgetText content="0.00" variant="bodySmall" />
            </CountTableCell>
          </>
        );
      case BudgetTableStep.CURRENT_BUDGET:
        return (
          <>
            <CountTableCell level={level}>
              <BudgetText content="" variant="bodySmall" />
            </CountTableCell>
            <CountTableCell level={level}>
              <BudgetText content="" variant="bodySmall" />
            </CountTableCell>
          </>
        );
      case BudgetTableStep.VIEW_MONTHLY_WITH_EDIT:
        return (
          <>
            {months.map((value, index) => (
              <CountTableCell level={level} key={`${value}-${index}`}>
                <div style={{width: 100}}>
                  <Input />
                  <BudgetText content="0.00" variant="bodySmall" style={{color: 'red'}} />
                </div>
              </CountTableCell>
            ))}
            <CountTableCell level={level}>
              <BudgetText content="0.00" variant="bodySmall" />
            </CountTableCell>
            <CountTableCell level={level}>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                {/*TO DO add logic for Edit, for now we do not have BE ready */}
                <EditIconTwo />
              </div>
            </CountTableCell>
          </>
        );
      case BudgetTableStep.INTERNAL_REALLOCATION:
        return (
          <>
            <CountTableCell level={level}>
              <BudgetText content="0.00" variant="bodySmall" />
            </CountTableCell>
            <CountTableCell level={level}>
              <Input />
            </CountTableCell>
            <CountTableCell level={level}>
              <Input />
            </CountTableCell>
          </>
        );
      default:
        <></>;
    }
  }, [step, count, level]);

  const sourceCellContent = useMemo(() => {
    const lastLevel = !count.children?.length;

    if (lastLevel) {
      return step === BudgetTableStep.BUDGETING ? (
        <Controller
          control={control}
          name={`${fieldPath.join('.')}-source`}
          render={({field: {onChange, name, value}}) => (
            <Dropdown
              options={sourceOptions}
              value={value}
              name={name}
              onChange={onChange}
              placeholder="Izaberite izvor"
            />
          )}
        />
      ) : (
        <Typography content="" variant="bodySmall" />
      );
    }

    return null;
  }, [count, step, level]);

  const generateChevronIcon = () => {
    return isCollapsed ? (
      <ChevronDownIcon stroke={Theme.palette.gray900} style={{marginRight: 10}} />
    ) : (
      <ChevronRightIcon stroke={Theme.palette.gray900} style={{marginRight: 10}} />
    );
  };

  return (
    <>
      <tr>
        <CountTableCell level={level} onClick={level === 1 ? onCollapse : undefined} first>
          <FlexContainer>
            {level === 1 && generateChevronIcon()}
            <Typography
              content={`${count.serial_number} - ${count.title}`}
              variant="bodySmall"
              style={{
                marginLeft: level !== 1 ? 26 : 0,
                fontWeight: level < 4 ? 600 : 400,
                padding: `12px ${(level - 1) * 7}`,
              }}
            />
          </FlexContainer>
        </CountTableCell>

        {/* TO DO  When all the templates are finished, check which ones require this and write the condition more nicely */}
        {step !== BudgetTableStep.VIEW_MONTHLY &&
          step !== BudgetTableStep.VIEW_MONTHLY_WITH_EDIT &&
          step !== BudgetTableStep.INTERNAL_REALLOCATION && (
            <CountTableCell level={level}>{sourceCellContent}</CountTableCell>
          )}

        {content}
      </tr>

      {isCollapsed && children}
    </>
  );
};

export default BudgetTableRow;
