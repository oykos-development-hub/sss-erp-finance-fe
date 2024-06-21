import {FocusEvent} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {CountTableCell, ReallocationInput} from '../styles';
import {Typography} from 'client-library';

type BudgetReallocationFormProps = {
  level: number;
  lastLevel: boolean;
  fieldPath: string[];
  updateParentValues: (fieldPath: string) => void;
  actual: boolean;
  disabled?: boolean;
  isExternal?: boolean;
};

const BudgetReallocationForm = ({
  level,
  lastLevel,
  fieldPath,
  updateParentValues,
  actual,
  disabled,
  isExternal,
}: BudgetReallocationFormProps) => {
  const {control, watch} = useFormContext();

  const amountActual = watch(`${fieldPath.join('.')}-actual`);
  const amountTaken = watch(`${fieldPath.join('.')}-amountTaken`);
  const amountGiven = watch(`${fieldPath.join('.')}-amountGiven`);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <>
      {!disabled && (
        <CountTableCell level={level} lastLevel={lastLevel}>
          <Controller
            name={`${fieldPath.join('.')}-actual`}
            control={control}
            render={({field: {value}}) => (
              <Typography
                content={value}
                variant="bodySmall"
                style={{
                  marginLeft: 24,
                  fontWeight: level < 4 ? 600 : 400,
                  padding: `12px ${(level - 1) * 7}`,
                }}
              />
            )}
          />
        </CountTableCell>
      )}
      <CountTableCell level={level} lastLevel={lastLevel}>
        <Controller
          name={`${fieldPath.join('.')}-amountTaken`}
          control={control}
          render={({field: {onChange, name, value}}) => (
            <ReallocationInput
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = parseInt(e?.target?.value);
                if (e?.target?.value !== '' && isNaN(value)) return;
                // amountTaken cant be greater than actual
                if (value > amountActual) {
                  onChange(amountActual);
                } else {
                  onChange(e);
                }
                updateParentValues(name);
              }}
              type={'number'}
              disabled={disabled || !lastLevel || actual || level === 1 || (amountGiven && amountGiven != 0)}
              isBold={!lastLevel}
              onFocus={handleFocus}
            />
          )}
        />
      </CountTableCell>
      {!isExternal && (
        <CountTableCell level={level} lastLevel={lastLevel}>
          <Controller
            name={`${fieldPath.join('.')}-amountGiven`}
            control={control}
            render={({field: {onChange, name, value}}) => (
              <ReallocationInput
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e?.target?.value !== '' && isNaN(value)) return;
                  onChange(e);
                  updateParentValues(name);
                }}
                type={'number'}
                disabled={disabled || !lastLevel || actual || level === 1 || amountTaken != 0}
                isBold={!lastLevel}
                onFocus={handleFocus}
              />
            )}
          />
        </CountTableCell>
      )}
    </>
  );
};

export default BudgetReallocationForm;
