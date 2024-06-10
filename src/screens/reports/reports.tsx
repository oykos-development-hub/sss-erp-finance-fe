import {Button, Datepicker, Dropdown} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useAccountingEntryReport from '../../services/graphQL/accounting/useAccountingEntryReport';
import useAnalyticalCardOverview from '../../services/graphQL/accounting/useAnalyticalCardOverview';
import useGetOrganizationUnits from '../../services/graphQL/organizationUnits/useGetOrganizationUnits';
import useGetSuppliers from '../../services/graphQL/suppliers/useGetSuppliers';
import {MainTitle} from '../../shared/pageElements';
import ScreenWrapper from '../../shared/screenWrapper/screenWrapper';
import {parseDateForBackend} from '../../utils/dateUtils';
import {AccountingReportType, TypesOfObligation, accountingReportOptions} from './constants';
import {CustomDivider, FormContainer, Options, OptionsRow} from './styles';

export const AccountingReports = () => {
  const {
    control,
    watch,
    formState: {errors},
    handleSubmit,
  } = useForm();

  const {
    reportService: {generatePdf, loading: loadingPDF},
    alert,
  } = useAppContext();

  const reportType = watch('report_type')?.id;
  const organizationUnit = watch('organization_unit')?.id;
  const type = watch('type')?.id;
  const date_of_start = watch('date_of_start');
  const date_of_end = watch('date_of_end');
  const date_of_start_booking = watch('date_of_start_booking');
  const date_of_end_booking = watch('date_of_end_booking');
  const supplier_id = watch('supplier')?.id;

  const {organizationUnits} = useGetOrganizationUnits();
  const {fetchAccountingOverview} = useAccountingEntryReport();
  const {fetchAnalyticalCardOverview} = useAnalyticalCardOverview();
  const {suppliers} = useGetSuppliers({});

  const getReportData = () => {
    switch (reportType) {
      case AccountingReportType.PostingJournal:
        generateReportPostingJournal();
        break;
      case AccountingReportType.AnalyticalCard:
        generateReportAnalyticalCard();
        break;
    }
  };

  const generateReportPostingJournal = async () => {
    const dataForReport = await fetchAccountingOverview(
      organizationUnit,
      type,
      parseDateForBackend(date_of_start),
      parseDateForBackend(date_of_end),
    );
    if (dataForReport.length > 0) {
      generatePdf('ALL_ACCOUNTING', dataForReport);
    } else {
      alert.info('Ne postoje podaci za ovaj izvještaj.');
    }
  };

  const generateReportAnalyticalCard = async () => {
    const dataForReport = await fetchAnalyticalCardOverview(
      organizationUnit,
      supplier_id,
      parseDateForBackend(date_of_start),
      parseDateForBackend(date_of_end),
      parseDateForBackend(date_of_start_booking),
      parseDateForBackend(date_of_end_booking),
    );
    if (dataForReport?.length > 0) {
      generatePdf('ALL_ANALITICAL_CARDS', dataForReport);
    } else {
      alert.info('Ne postoje podaci za ovaj izvještaj.');
    }
  };

  return (
    <ScreenWrapper>
      <FormContainer onSubmit={handleSubmit(getReportData)}>
        <MainTitle content="IZVJEŠTAJI" variant="bodyMedium" />
        <CustomDivider />

        <Options>
          <OptionsRow>
            <Controller
              control={control}
              name="report_type"
              rules={{required: 'Ovo polje je obavezno!'}}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  label="TIP IZVJEŠTAJA:"
                  value={value}
                  onChange={onChange}
                  options={accountingReportOptions}
                  isRequired
                  error={errors.report_type?.message as string}
                />
              )}
            />

            <Controller
              control={control}
              name="organization_unit"
              rules={{required: 'Ovo polje je obavezno.'}}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  label="ORGANIZACIONA JEDINICA:"
                  value={value}
                  onChange={onChange}
                  options={organizationUnits ?? []}
                  isRequired
                  error={errors.organization_unit?.message as string}
                />
              )}
            />

            {reportType === AccountingReportType.PostingJournal && (
              <Controller
                control={control}
                name="type"
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    label="TIP NALOGA:"
                    value={value}
                    onChange={onChange}
                    options={TypesOfObligation}
                    error={errors.type?.message as string}
                  />
                )}
              />
            )}

            {reportType === AccountingReportType.AnalyticalCard && (
              <Controller
                control={control}
                name="supplier"
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    label="DOBAVLJAČ:"
                    value={value}
                    onChange={onChange}
                    options={suppliers}
                    error={errors.supplier?.message as string}
                  />
                )}
              />
            )}
          </OptionsRow>
          <OptionsRow>
            <Controller
              control={control}
              name="date_of_start"
              rules={{
                validate: value => {
                  if (
                    !date_of_end &&
                    !date_of_start_booking &&
                    !date_of_end_booking &&
                    !value &&
                    reportType === AccountingReportType.AnalyticalCard
                  ) {
                    return 'Ovo polje je obavezno.';
                  } else if (!!date_of_end && !value && reportType === AccountingReportType.AnalyticalCard) {
                    return 'Ovo polje je obavezno.';
                  }
                  return true;
                },
              }}
              render={({field: {onChange, value}}) => (
                <Datepicker
                  label="DATUM DOKUMENTA OD:"
                  selected={value ? new Date(value) : ''}
                  onChange={onChange}
                  disabled={!!date_of_start_booking || !!date_of_end_booking}
                  isRequired={!!date_of_end}
                  error={errors.date_of_start?.message as string}
                />
              )}
            />

            <Controller
              control={control}
              name="date_of_end"
              rules={{
                validate: value => {
                  if (
                    !date_of_start &&
                    !date_of_start_booking &&
                    !date_of_end_booking &&
                    !value &&
                    reportType === AccountingReportType.AnalyticalCard
                  ) {
                    return 'Ovo polje je obavezno.';
                  } else if (!!date_of_start && !value && reportType === AccountingReportType.AnalyticalCard) {
                    return 'Ovo polje je obavezno.';
                  }
                  return true;
                },
              }}
              render={({field: {onChange, value}}) => (
                <Datepicker
                  label="DATUM DOKUMENTA DO:"
                  value={value}
                  selected={value ? new Date(value) : ''}
                  onChange={onChange}
                  options={accountingReportOptions}
                  disabled={!!date_of_start_booking || !!date_of_end_booking}
                  isRequired={!!date_of_start}
                  error={errors.date_of_end?.message as string}
                />
              )}
            />
            {reportType === AccountingReportType.AnalyticalCard && (
              <>
                <Controller
                  control={control}
                  name="date_of_start_booking"
                  rules={{
                    validate: value => {
                      if (
                        !date_of_start &&
                        !date_of_end &&
                        !date_of_end_booking &&
                        !value &&
                        reportType === AccountingReportType.AnalyticalCard
                      ) {
                        return 'Ovo polje je obavezno.';
                      } else if (
                        !!date_of_end_booking &&
                        !value &&
                        reportType === AccountingReportType.AnalyticalCard
                      ) {
                        return 'Ovo polje je obavezno.';
                      }
                      return true;
                    },
                  }}
                  render={({field: {onChange, value}}) => (
                    <Datepicker
                      label="DATUM KNJIŽENJA OD:"
                      selected={value ? new Date(value) : ''}
                      onChange={onChange}
                      disabled={!!date_of_start || !!date_of_end}
                      isRequired={!!date_of_end_booking}
                      error={errors.date_of_start_booking?.message as string}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="date_of_end_booking"
                  rules={{
                    validate: value => {
                      if (
                        !date_of_start &&
                        !date_of_end &&
                        !date_of_start_booking &&
                        !value &&
                        reportType === AccountingReportType.AnalyticalCard
                      ) {
                        return 'Ovo polje je obavezno.';
                      } else if (
                        !!date_of_start_booking &&
                        !value &&
                        reportType === AccountingReportType.AnalyticalCard
                      ) {
                        return 'Ovo polje je obavezno.';
                      }
                      return true;
                    },
                  }}
                  render={({field: {onChange, value}}) => (
                    <Datepicker
                      label="DATUM KNJIŽENJA DO:"
                      selected={value ? new Date(value) : ''}
                      onChange={onChange}
                      options={accountingReportOptions}
                      disabled={!!date_of_start || !!date_of_end}
                      isRequired={!!date_of_start_booking}
                      error={errors.date_of_end_booking?.message as string}
                    />
                  )}
                />
              </>
            )}
          </OptionsRow>
        </Options>
        <Button content="Generiši izvještaj" style={{width: 'fit-content'}} type="submit" isLoading={loadingPDF} />
      </FormContainer>
    </ScreenWrapper>
  );
};
