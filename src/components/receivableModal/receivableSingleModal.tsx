import {Dropdown, Modal, Table, TableHead, Typography, Input} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {generateDropdownOptions} from '../../constants.ts';
import useGetCountOverview from '../../services/graphQL/counts/useGetCountOverview.ts';
import {roundCurrency} from '../../utils/roundCurrency.ts';
import useGetCurrentBudget from '../../services/graphQL/currentBudget/useGetCurrentBudget.ts';
import useAppContext from '../../context/useAppContext.ts';
import {ObligationsItem} from '../../types/graphQL/receivablesTypes.ts';
import {Row} from '../../screens/liabilitesAndReceivables/receivables/styles.ts';

interface FundReleaseModalProps {
  onClose: () => void;
  open: boolean;
  data: any;
  selectedRow: ObligationsItem[];
  id?: number;
  onSubmit: (data: any, additionalData: any) => void;
}

const ReceivableSingleModal = ({onClose, open, data, selectedRow, onSubmit}: FundReleaseModalProps) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const {contextMain} = useAppContext();
  const {
    control,
    handleSubmit,
    register,
    formState: {errors},
    setError,
    clearErrors,
  } = useForm();

  const {fields, append, update} = useFieldArray({
    control,
    name: 'items',
    keyName: 'key',
  });

  const organizationUnitID = contextMain.organization_unit.id;
  const {version} = useGetCurrentBudget({organization_unit_id: organizationUnitID});
  const {counts} = useGetCountOverview({level: 3, version: version});

  const [amountValue, setAmountValue] = useState<number>();
  const [totalAmount, setTotalAmount] = useState<string>();
  const [manualAmount, setManualAmount] = useState<string | null>(null);

  const dropdownCountsOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);

  const tableHeadsForOneInvoice: TableHead[] = [
    {
      title: 'Broj obaveze',
      width: '200px',
      accessor: 'title',
      type: 'custom',
      renderContents: title => <Typography content={title} />,
    },
    {
      title: 'Konto troška',
      width: '200px',
      accessor: 'account',
      type: 'custom',
      renderContents: account => <Typography content={account?.title} />,
    },
    {
      title: 'Konto sa kojeg se plaća',
      accessor: 'source_account',
      type: 'custom',
      width: '200px',
      renderContents: (_item, row, index) => (
        <Controller
          name={`items.${index}.source_account`}
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={value}
              onChange={val => {
                onChange(val);
                update(index, {...fields[index], source_account: val});
              }}
              placeholder="Odaberite konto"
              options={dropdownCountsOptions}
              isDisabled={selectedRows && selectedRows.every(option => option !== row.id)}
            />
          )}
        />
      ),
    },
    {
      title: 'Ukupan iznos',
      width: '200px',
      accessor: 'remain_price',
      type: 'custom',
      renderContents: remain_price => <Typography content={roundCurrency(remain_price)} />,
    },
  ];

  const tableData = data.filter((field: any) => selectedRow.includes(field.id));
  const tableItem = tableData[0]?.invoice_items || [];

  const calculateTotalRemainingPrice = () => {
    const relevantFields = tableItem.filter((field: any) => selectedRows.includes(field.id));
    let totalRemainingPrice = 0;
    relevantFields.forEach((field: any) => {
      totalRemainingPrice += field.remain_price;
    });
    return setAmountValue(totalRemainingPrice);
  };

  const calculateTotalPrice = () => {
    if (manualAmount !== null) {
      setManualAmount(manualAmount);
    } else {
      const relevantFields = tableItem.filter((field: any) => selectedRows.includes(field.id));
      let totalRemainingPrice = 0;
      relevantFields.forEach((field: any) => {
        totalRemainingPrice += field.remain_price;
      });
      setTotalAmount(totalRemainingPrice?.toFixed(2));
    }
  };

  const handleAmountChange = (e: any) => {
    const value = e.target.value.trim();
    if (!value) {
      setManualAmount('');
      setError('amount', {
        type: 'manual',
        message: 'Polje iznos je obavezno.',
      });
      return;
    }
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      setManualAmount('');
      clearErrors('amount');
    } else {
      if (totalAmount && numericValue > parseFloat(totalAmount)) {
        setError('amount', {
          type: 'manual',
          message: 'Iznos za plaćanje ne može biti veći od ukupnog iznosa.',
        });
      } else {
        clearErrors('amount');
      }
      setManualAmount(value);
    }
  };

  const onCheck = (checked: boolean, currId: number | null) => {
    if (checked && currId) {
      setSelectedRows([...selectedRows, currId]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== currId));
    }
  };

  useEffect(() => {
    if (tableItem.length > 0) {
      tableItem.forEach((item: any) => {
        append({
          ...item,
          source_account: null,
        });
      });
    }
  }, [append]);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedRows]);

  useEffect(() => {
    calculateTotalRemainingPrice();
  }, [selectedRows]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="OBAVEZE"
      leftButtonOnClick={onClose}
      rightButtonOnClick={handleSubmit(formData => {
        const selectedData = formData.items.filter((_item: any, index: number) =>
          selectedRows.includes(tableItem[index]?.id),
        );
        const payload = {
          ...formData,
          items: selectedData,
        };
        const additionalData = {
          manualAmount,
          totalAmount,
          amountValue,
        };
        onSubmit(payload, additionalData);
        onClose();
      })}
      rightButtonText="Sačuvaj"
      leftButtonText="Otkaži"
      content={
        <div>
          <Row>
            {selectedRows.length === 1 && (
              <Input
                {...register('amount')}
                label="Iznos za plaćanje:"
                error={errors.amount?.message as string}
                value={manualAmount !== null ? manualAmount : totalAmount ? totalAmount : ''}
                style={{width: '250px'}}
                onChange={handleAmountChange}
              />
            )}
            {selectedRows.length > 1 && (
              <Input
                label="Iznos za plaćanje:"
                disabled
                value={roundCurrency(amountValue)}
                error={errors.amount?.message as string}
                style={{width: '250px'}}
              />
            )}
          </Row>
          <Table
            checkedRows={selectedRows}
            checkboxes
            onCheck={onCheck}
            tableHeads={tableHeadsForOneInvoice}
            data={tableItem}
          />
        </div>
      }
    />
  );
};

export default ReceivableSingleModal;
