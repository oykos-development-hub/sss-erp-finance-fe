import {Dropdown, Modal, Table, TableHead, Typography} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {generateDropdownOptions} from '../../constants.ts';
import useGetCountOverview from '../../services/graphQL/counts/useGetCountOverview.ts';
import {roundCurrency} from '../../utils/roundCurrency.ts';
import useGetCurrentBudget from '../../services/graphQL/currentBudget/useGetCurrentBudget.ts';
import useAppContext from '../../context/useAppContext.ts';
import {ObligationsItem} from '../../types/graphQL/receivablesTypes.ts';

interface FundReleaseModalProps {
  onClose: () => void;
  open: boolean;
  data: any;
  selectedRow: ObligationsItem[];
  id?: number;
  onSubmit: (data: any) => void;
}

const ReceivableSingleModal = ({onClose, open, data, selectedRow, onSubmit}: FundReleaseModalProps) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const {contextMain} = useAppContext();
  const {control, handleSubmit} = useForm();

  const organizationUnitID = contextMain.organization_unit.id;
  const {version} = useGetCurrentBudget({organization_unit_id: organizationUnitID});
  const {counts} = useGetCountOverview({level: 3, version: version});

  const {fields, append, update} = useFieldArray({
    control,
    name: 'items',
    keyName: 'key',
  });

  const dropdowncountsOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);

  const tableHeadsForOneInvoice: TableHead[] = [
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
      title: 'Konto troška',
      width: '200px',
      accessor: 'account',
      type: 'custom',
      renderContents: account => {
        return <Typography content={`${account?.id} - ${account?.title}`} />;
      },
    },
    {
      title: 'Konto sa kojeg se plaća',
      accessor: 'source_account',
      type: 'custom',
      width: '20%',
      renderContents: (_item, row, index) => {
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
                isDisabled={selectedRows && selectedRows.every(option => option !== row.id)}
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
  const tableItem = tableData[0]?.invoice_items || [];

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

        onSubmit(payload);
        onClose();
      })}
      rightButtonText="Sačuvaj"
      leftButtonText="Otkaži"
      content={
        <div>
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
