import {Divider, Dropdown, Theme} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import useGetDepositPaymentOrders from '../../../../services/graphQL/transitDeposits/useGetDepositPaymentOrders';
import {MainTitle} from '../../../../shared/pageElements';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper';
import {DropdownData} from '../../../../types/dropdownData';
import {SectionBox} from '../../../accounting/styles';
import {DepositPaymentOrderType, DepositPaymentOrderTypeOptions} from './constants';
import OrderByCaseNumberForm from './orderByCaseNumberForm';
import TaxOrderForm from './taxOrderForm';

const DepositPaymentOrderDetails = () => {
  const [type, setType] = useState<DropdownData<DepositPaymentOrderType> | null>(null);
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();

  const id = pathname.split('/').pop();

  const {data: currentPaymentOrder} = useGetDepositPaymentOrders({id: id ? parseInt(id) : null});

  const onTypeChange = (value: DropdownData<DepositPaymentOrderType>) => {
    setType(value as DropdownData<DepositPaymentOrderType>);
  };

  useEffect(() => {
    if (currentPaymentOrder && currentPaymentOrder.items[0]) {
      if (currentPaymentOrder.items[0].additional_expenses.length > 0) {
        //* By case
        setType(DepositPaymentOrderTypeOptions[0]);
      } else {
        //* Taxes
        setType(DepositPaymentOrderTypeOptions[1]);
      }
    }
  }, [currentPaymentOrder]);

  const title = useMemo(() => {
    if (!type || !currentPaymentOrder.items[0]) return '';

    if (type.id === 'case') {
      return `NALOG ZA PLAĆANJE PO PREDMETU - ${currentPaymentOrder.items[0].case_number}`;
    } else {
      return `NALOG ZA PLAĆANJE POREZA/PRIREZA - ${currentPaymentOrder.items[0].case_number}`;
    }
  }, [type, currentPaymentOrder]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle content={title} />
        <Divider color={Theme?.palette?.gray200} height="1px" style={{marginBottom: 20}} />

        <div style={{marginBottom: 20}}>
          <Dropdown
            label="TIP NALOGA:"
            onChange={onTypeChange as any}
            value={type}
            options={DepositPaymentOrderTypeOptions}
            isDisabled
          />
        </div>

        {type && type.id === 'case' && <OrderByCaseNumberForm data={currentPaymentOrder?.items[0]} />}
        {type && type.id === 'tax' && <TaxOrderForm data={currentPaymentOrder?.items[0]} />}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default DepositPaymentOrderDetails;
