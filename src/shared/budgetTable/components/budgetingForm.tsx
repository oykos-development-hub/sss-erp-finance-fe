import {Controller, useFormContext} from 'react-hook-form';
import {CountTableCell, BudgetInput, DescriptionTextarea} from '../styles';

type BudgetingFormProps = {
  level: number;
  lastLevel: boolean;
  fieldPath: string[];
  updateParentValues: (fieldPath: string) => void;
  actual: boolean;
};

const BudgetingForm = ({level, lastLevel, fieldPath, updateParentValues, actual}: BudgetingFormProps) => {
  const {control} = useFormContext();

  return (
    <>
      <CountTableCell level={level} lastLevel={lastLevel}>
        <Controller
          name={`${fieldPath.join('.')}-currentYearBudget`}
          control={control}
          render={({field: {onChange, name, value}}) => (
            <BudgetInput
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange(e);
                updateParentValues(name);
              }}
              type={'number'}
              disabled={!lastLevel}
              isBold={!lastLevel}
            />
          )}
        />
      </CountTableCell>
      <CountTableCell level={level} lastLevel={lastLevel}>
        {lastLevel && (
          <Controller
            name={`${fieldPath.join('.')}-description`}
            control={control}
            render={({field: {onChange, value}}) => (
              <DescriptionTextarea value={value} onChange={onChange} style={{textAlign: 'left'}} />
            )}
          />
        )}
      </CountTableCell>
      {actual && (
        <CountTableCell level={level} lastLevel={lastLevel}>
          <Controller
            name={`${fieldPath.join('.')}-actualBudget`}
            control={control}
            render={({field: {onChange, name, value}}) => (
              <BudgetInput
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(e);
                  updateParentValues(name);
                }}
                type={'number'}
                disabled={!lastLevel}
                isBold={!lastLevel}
              />
            )}
          />
        </CountTableCell>
      )}
      <CountTableCell level={level} lastLevel={lastLevel}>
        <Controller
          name={`${fieldPath.join('.')}-nextYearBudget`}
          control={control}
          render={({field: {onChange, name, value}}) => (
            <BudgetInput
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange(e);
                updateParentValues(name);
              }}
              type={'number'}
              disabled={!lastLevel}
              isBold={!lastLevel}
            />
          )}
        />
      </CountTableCell>
      <CountTableCell level={level} lastLevel={lastLevel}>
        <Controller
          name={`${fieldPath.join('.')}-yearAfterNextBudget`}
          control={control}
          render={({field: {onChange, name, value}}) => (
            <BudgetInput
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange(e);
                updateParentValues(name);
              }}
              type={'number'}
              disabled={!lastLevel}
              isBold={!lastLevel}
            />
          )}
        />
      </CountTableCell>
    </>
  );
};

export default BudgetingForm;
