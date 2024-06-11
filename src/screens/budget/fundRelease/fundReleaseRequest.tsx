import {Button, Divider} from 'client-library';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import useAppContext from '../../../context/useAppContext';
import useGetBudgetDynamic from '../../../services/graphQL/budgetDynamic/useGetBudgetDynamic';
import useInsertFundRelease from '../../../services/graphQL/fundRelease/useInsertFundRelease';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {BudgetDynamicCount} from '../../../types/graphQL/budgetDynamic';
import {monthVars} from '../spendingDynamics/constants';
import {TableWrapper} from '../spendingDynamics/styles';
import FundReleaseTable from './fundReleaseTable';
import {MainTitle, SectionBox} from './styles';
import useGetFundReleaseDetails from '../../../services/graphQL/fundRelease/useGetFundReleaseDetails';
import {fundReleaseDetailsRegex} from '../../../router';

const FundReleaseRequest = () => {
  const [invalidRows, setInvalidRows] = useState<string[]>([]);
  const [enabledRows, setEnabledRows] = useState<string[]>([]);
  const [allEnabled, setAllEnabled] = useState<boolean>(false);
  const [allBottomCounts, setAllBottomCounts] = useState<string[]>([]);
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    alert,
  } = useAppContext();

  const currentMonthYear: {month: number; year: number} | null = useMemo(() => {
    const match = pathname.match(fundReleaseDetailsRegex);

    if (match) {
      return {
        month: parseInt(match[1]),
        year: parseInt(match[2]),
      };
    } else {
      return null;
    }
  }, [pathname]);

  const currentMonth = new Date().toLocaleString('default', {month: 'long'}).toLowerCase();

  const methods = useForm<any>();

  const {budgetDynamic, loading} = useGetBudgetDynamic({});
  const {fundReleaseDetails} = useGetFundReleaseDetails({month: currentMonthYear?.month, year: currentMonthYear?.year});
  const {insertFundRelease} = useInsertFundRelease();

  const isDetails = fundReleaseDetailsRegex.test(pathname);

  const onEnabledRowsChange = (row: string) => {
    if (row === 'all') {
      if (allEnabled) {
        setEnabledRows([]);
        setAllEnabled(false);
      } else {
        setAllEnabled(true);
        console.log(allBottomCounts);
        setEnabledRows(allBottomCounts);
      }
    } else {
      if (enabledRows.includes(row)) {
        setEnabledRows(enabledRows.filter(item => item !== row));
        setAllEnabled(false);
      } else {
        setEnabledRows([...enabledRows, row]);
      }
    }
  };

  const setupFundReleaseFieldsRecursively = useCallback(
    (item: BudgetDynamicCount) => {
      const data = {
        month: monthVars.findIndex(month => month === currentMonth) + 1,
        value: item[currentMonth as keyof BudgetDynamicCount].value,
        account_id: item.account_id,
        maxValue: parseInt(item[currentMonth as keyof BudgetDynamicCount].value),
        account_serial_number: item.account_serial_number,
      };

      if (item.children.length === 0) {
        setAllBottomCounts(prev => [...prev, item.account_serial_number]);
      }

      methods.setValue(item.account_serial_number, data);

      item.children.forEach((child: BudgetDynamicCount) => {
        setupFundReleaseFieldsRecursively(child);
      });
    },
    [methods],
  );

  const validateRows = (data: any[]) => {
    setInvalidRows([]);

    data.forEach((item: any) => {
      if (item.value > item.maxValue) {
        setInvalidRows(prev => [...prev, item.account_serial_number]);
      }
    });
  };

  useEffect(() => {
    if (!isDetails) {
      if (budgetDynamic && budgetDynamic) {
        budgetDynamic.forEach((item: BudgetDynamicCount) => {
          setupFundReleaseFieldsRecursively(item);
        });
      }
    }
  }, [budgetDynamic, setupFundReleaseFieldsRecursively]);

  const onSubmit = async (data: any) => {
    let insertData = [];

    if (allEnabled) {
      insertData = data;
    } else {
      insertData = Object.keys(data)
        .filter(key => enabledRows.includes(key))
        .map(key => data[key]);
    }

    validateRows(insertData);

    if (invalidRows.length > 0) {
      alert.error('Neispravni podaci!');
      return;
    } else {
      const payload = insertData.map((item: any) => {
        const {account_serial_number, maxValue, ...rest} = item;
        return rest;
      });

      await insertFundRelease(
        payload,
        () => {
          alert.success('Uspješno ste sačuvali podatke!');
          navigate('/finance/budget/current/fund-release');
        },
        () => alert.error('Došlo je do greške prilikom čuvanja podataka!'),
      );
    }
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="ZAHTJEV ZA OTPUŠTANJE SREDSTAVA" />
        <Divider color="#615959" height="1px" />

        <FormProvider {...methods}>
          <TableWrapper style={{marginTop: 22}}>
            <FundReleaseTable
              onEnableRow={onEnabledRowsChange}
              enabledRows={enabledRows}
              allEnabled={allEnabled}
              invalidRows={invalidRows}
              counts={budgetDynamic}
              loading={loading}
              details={fundReleaseDetails}
            />
          </TableWrapper>
        </FormProvider>

        {!isDetails && (
          <div style={{marginTop: 22, display: 'flex'}}>
            <Button
              variant="secondary"
              content="Otkaži"
              style={{marginLeft: 'auto', marginRight: 15}}
              onClick={() => window.history.back()}
            />
            <Button variant="primary" onClick={methods.handleSubmit(onSubmit)} content="Sačuvaj" />
          </div>
        )}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default FundReleaseRequest;
