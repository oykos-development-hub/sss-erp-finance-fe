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
import {FileWrapper, MainTitle, SectionBox} from './styles';
import useGetFundReleaseDetails from '../../../services/graphQL/fundRelease/useGetFundReleaseDetails';
import {fundReleaseDetailsRegex} from '../../../router';
import FileList from '../../../components/fileList/fileList.tsx';
import useGetFundRelease from '../../../services/graphQL/fundRelease/useGetFundRelease.ts';
import {Typography} from '@oykos-development/devkit-react-ts-styled-components';

const FundReleaseRequest = () => {
  const [invalidRows, setInvalidRows] = useState<string[]>([]);

  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    contextMain: {
      organization_unit: {id: organization_unit_id},
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
  const {fundReleaseDetails} = useGetFundReleaseDetails({
    unit_id: organization_unit_id,
    month: currentMonthYear?.month,
    year: currentMonthYear?.year,
  });
  const {insertFundRelease} = useInsertFundRelease();

  const isDetails = fundReleaseDetailsRegex.test(pathname);

  const setupFundReleaseFieldsRecursively = useCallback(
    (item: BudgetDynamicCount) => {
      const data = {
        month: monthVars.findIndex(month => month === currentMonth) + 1,
        value: item[currentMonth as keyof BudgetDynamicCount].value,
        account_id: item.account_id,
        maxValue: parseFloat(item[currentMonth as keyof BudgetDynamicCount].value),
        account_serial_number: item.account_serial_number,
      };

      methods.setValue(item.account_serial_number, data);

      item.children.forEach((child: BudgetDynamicCount) => {
        setupFundReleaseFieldsRecursively(child);
      });
    },
    [methods],
  );

  const validateRows = (data: any[]) => {
    const invalidRows: string[] = [];

    data.forEach((item: any) => {
      if (item.value > item.maxValue || item.value < 0) {
        invalidRows.push(item.account_serial_number);
      }
    });
    setInvalidRows(invalidRows);
    return invalidRows;
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

    insertData = Object.keys(data).map(key => data[key]);

    if (validateRows(insertData).length > 0) {
      alert.error('Neispravni podaci!');
      return;
    } else {
      const payload = insertData.map((item: any) => {
        const {account_serial_number, maxValue, ...rest} = item;
        return rest;
      });

      await insertFundRelease(
        payload as any,
        () => {
          alert.success('Uspješno ste sačuvali podatke!');
          navigate('/finance/budget/current/fund-release');
        },
        () => alert.error('Došlo je do greške prilikom čuvanja podataka!'),
      );
    }
  };

  const {fundRelease} = useGetFundRelease({
    unit_id: organization_unit_id,
    month: currentMonthYear?.month,
    year: currentMonthYear?.year ?? 0,
  });

  const fundReleaseItem = fundRelease[0];

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="ZAHTJEV ZA OTPUŠTANJE SREDSTAVA" />
        <Divider color="#615959" height="1px" />
        {!!fundReleaseItem?.sss_file?.id && (
          <FileWrapper gap={10}>
            <Typography content={'Fajl SSS:'} variant={'bodyMedium'} />
            <FileList files={(fundReleaseItem && [fundReleaseItem?.sss_file]) ?? []} />
          </FileWrapper>
        )}
        {!!fundReleaseItem?.organization_unit_file?.id && (
          <FileWrapper gap={22}>
            <Typography content={'Fajl OJ: '} variant={'bodyMedium'} />
            <FileList files={(fundReleaseItem && [fundReleaseItem?.organization_unit_file]) ?? []} />
          </FileWrapper>
        )}
        <FormProvider {...methods}>
          <TableWrapper style={{marginTop: 22}}>
            <FundReleaseTable
              invalidRows={invalidRows}
              counts={budgetDynamic}
              loading={loading}
              details={fundReleaseDetails}
            />
          </TableWrapper>
        </FormProvider>
        <div style={{marginTop: 22, display: 'flex'}}>
          <Button
            variant="secondary"
            content="Otkaži"
            style={{marginLeft: 'auto', marginRight: 15}}
            onClick={() => window.history.back()}
          />
          {!isDetails && <Button variant="primary" onClick={methods.handleSubmit(onSubmit)} content="Sačuvaj" />}
        </div>
      </SectionBox>
    </ScreenWrapper>
  );
};

export default FundReleaseRequest;
