import {Dropdown, Modal, Table, TableHead, Typography, Input} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {generateDropdownOptions} from '../../constants.ts';
import useAppContext from '../../context/useAppContext.ts';
import useGetCountOverview from '../../services/graphQL/counts/useGetCountOverview.ts';
import useGetCurrentBudget from '../../services/graphQL/currentBudget/useGetCurrentBudget.ts';
import {roundCurrency} from '../../utils/roundCurrency.ts';
import {ObligationsItem} from '../../types/graphQL/receivablesTypes.ts';
import {Row} from '../../screens/liabilitesAndReceivables/receivables/styles.ts';

interface FundReleaseModalProps {
  onClose: () => void;
  open: boolean;
  data: any;
  selectedRow: ObligationsItem[];
  id?: number;
  onSubmit: (data: any, additionalData?: {amountValue?: number}) => void;
}

const ReceivablesleModal = ({onClose, open, data, selectedRow, onSubmit}: FundReleaseModalProps) => {
  const {contextMain} = useAppContext();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const organizationUnitID = contextMain.organization_unit.id;
  const {version} = useGetCurrentBudget({organization_unit_id: organizationUnitID});
  const {counts} = useGetCountOverview({level: 3, version: version});

  const [amountValue, setAmountValue] = useState<number>();

  const {fields, append, update} = useFieldArray({
    control,
    name: 'items',
    keyName: 'key',
  });

  const dropdowncountsOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);

  const invoicesTableHead: TableHead[] = [
    {
      title: 'Broj obaveze',
      width: '200px',
      accessor: 'title',
      type: 'custom',
      renderContents: title => {
        return <Typography content={title} />;
      },
    },
    {
      title: 'Konto sa kojeg se plaća',
      accessor: 'source_account',
      type: 'custom',
      width: '200px',
      renderContents: (_item, _row, index) => {
        return (
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
                options={dropdowncountsOptions}
              />
            )}
          />
        );
      },
    },
    {
      title: 'Ukupan iznos',
      width: '200px',
      accessor: 'remain_price',
      type: 'custom',
      renderContents: remain_price => {
        return <Typography content={roundCurrency(remain_price)} />;
      },
    },
  ];

  const tableData = data.filter((field: any) => selectedRow.includes(field.id));

  const calculateTotalRemainingPrice = () => {
    const relevantFields = tableData.filter((field: any) => selectedRow.includes(field.id));
    let totalRemainingPrice = 0;
    relevantFields.forEach((field: any) => {
      totalRemainingPrice += field.remain_price;
    });
    return setAmountValue(totalRemainingPrice);
  };

  useEffect(() => {
    if (tableData.length > 0) {
      tableData.forEach((item: any) => {
        append({
          ...item,
          source_account: null,
        });
      });
    }
  }, [append]);

  useEffect(() => {
    calculateTotalRemainingPrice();
  }, [tableData]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="OBAVEZE"
      leftButtonOnClick={onClose}
      rightButtonOnClick={handleSubmit(formData => {
        const additionalData = {
          amountValue,
        };
        onSubmit(formData, additionalData);
        onClose();
      })}
      rightButtonText="Sačuvaj"
      leftButtonText="Otkaži"
      content={
        <div>
          <Row>
            <Input
              label="Iznos za plaćanje:"
              disabled
              value={roundCurrency(amountValue)}
              error={errors.amount?.message as string}
              style={{width: '250px'}}
            />
          </Row>
          <Table tableHeads={invoicesTableHead} data={tableData} />
        </div>
      }
    />
  );
};

export default ReceivablesleModal;
