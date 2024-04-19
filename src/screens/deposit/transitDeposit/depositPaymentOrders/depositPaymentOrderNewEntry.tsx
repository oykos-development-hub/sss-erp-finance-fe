import {Dropdown} from 'client-library';
import {useState} from 'react';
import {DropdownData} from '../../../../types/dropdownData';
import {DepositPaymentOrderType, DepositPaymentOrderTypeOptions} from './constants';
import OrderByCaseNumberForm from './orderByCaseNumberForm';
import TaxOrderForm from './taxOrderForm';

const DepositPaymentOrderNewEntry = () => {
  const [type, setType] = useState<DropdownData<DepositPaymentOrderType> | null>(null);

  const onTypeChange = (value: DropdownData<DepositPaymentOrderType>) => {
    setType(value as DropdownData<DepositPaymentOrderType>);
  };

  return (
    <div>
      <div style={{marginBottom: 20}}>
        <Dropdown
          label="TIP NALOGA:"
          onChange={onTypeChange as any}
          value={type}
          options={DepositPaymentOrderTypeOptions}
        />
      </div>

      {type && type.id === 'case' && <OrderByCaseNumberForm />}
      {type && type.id === 'tax' && <TaxOrderForm />}
    </div>
  );
};

export default DepositPaymentOrderNewEntry;
