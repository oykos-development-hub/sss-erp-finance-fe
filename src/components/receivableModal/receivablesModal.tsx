import {Dropdown, Modal, Table, TableHead, Typography} from 'client-library';
import {useEffect, useMemo} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {generateDropdownOptions} from '../../constants.ts';
import useAppContext from '../../context/useAppContext.ts';
import useGetCountOverview from '../../services/graphQL/counts/useGetCountOverview.ts';
import useGetCurrentBudget from '../../services/graphQL/currentBudget/useGetCurrentBudget.ts';
import {roundCurrency} from '../../utils/roundCurrency.ts';
import {ObligationsItem} from '../../types/graphQL/receivablesTypes.ts';

interface FundReleaseModalProps {
  onClose: () => void;
  open: boolean;
  data: any;
  selectedRow: ObligationsItem[];
  id?: number;
  onSubmit: (data: any) => void;
}

const ReceivablesleModal = ({onClose, open, data, selectedRow, onSubmit}: FundReleaseModalProps) => {
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
      width: '20%',
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="OBAVEZE"
      leftButtonOnClick={onClose}
      rightButtonOnClick={handleSubmit(formData => {
        onSubmit(formData);
        onClose();
      })}
      rightButtonText="Sačuvaj"
      leftButtonText="Otkaži"
      content={
        <div>
          <Table tableHeads={invoicesTableHead} data={tableData} />
        </div>
      }
    />
  );
};

export default ReceivablesleModal;
