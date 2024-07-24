import {Datepicker, DepositIcon, Dropdown, Theme, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import LandingPageContentBox from '../../../components/landingPageContentBox/landingPageContentBox.tsx';
import useAppContext from '../../../context/useAppContext.ts';
import useGetInitialState from '../../../services/graphQL/transitDeposits/useGetInitialState.ts';
import {FlexColumn, FlexRow} from '../../../shared/flex.ts';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {DropdownData} from '../../../types/dropdownData.ts';
import {InitialState} from '../../../types/graphQL/initialState.ts';
import {parseDateForBackend} from '../../../utils/dateUtils.ts';
import {SectionBox} from '../../accounting/styles.tsx';
import {Container, InitialStateItem, LandingPageTitle} from './styles.ts';
import {formatCurrency} from '../../../utils/currencyUtils.ts';

type InitialStateFilterType = {
  date: Date | null;
  bank_account: DropdownData<string> | null;
};

const TransitDepositLandingPage: React.FC = () => {
  const [mainFilters, setMainFilters] = useState<InitialStateFilterType>({
    date: new Date(),
    bank_account: null,
  });

  const [transitionalFilters, setTransitionalFilters] = useState<InitialStateFilterType>({
    date: new Date(),
    bank_account: null,
  });

  const {
    contextMain: {
      organization_unit: {id: organization_unit_id, bank_accounts},
    },
  } = useAppContext();

  const {data: transitionalState} = useGetInitialState({
    transitional_bank_account: true,
    bank_account: transitionalFilters.bank_account?.id,
    date: parseDateForBackend(transitionalFilters.date),
    organization_unit_id,
  });
  const {data: mainState} = useGetInitialState({
    transitional_bank_account: false,
    bank_account: mainFilters.bank_account?.id,
    date: parseDateForBackend(mainFilters.date),
    organization_unit_id,
  });

  const onFilterChange = (value: any, name: string, type: 'transitional' | 'main') => {
    if (type === 'transitional') {
      setTransitionalFilters({...transitionalFilters, [name]: value});
    } else {
      setMainFilters({...mainFilters, [name]: value});
    }
  };

  const orgUnitBankAccountOptions = useMemo(() => {
    if (!bank_accounts) return [];
    return bank_accounts.map((item: string) => ({id: item, title: item}));
  }, [bank_accounts]);
  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="PROLAZNI DEPOZIT" />
        </LandingPageTitle>
        <Container>
          <LandingPageContentBox
            title={'Uplata na račun'}
            path={'/finance/deposit/transit/payments/overview'}
            icon={<DepositIcon />}
          />
          <LandingPageContentBox
            title={'Nalozi za plaćanje'}
            path={'/finance/deposit/transit/payment-orders/overview'}
            icon={<DepositIcon />}
          />
          <LandingPageContentBox
            title={'Vezani troškovi'}
            path={'/finance/deposit/transit/tax-contribution-calculation'}
            icon={<DepositIcon />}
          />
        </Container>
      </div>
      <SectionBox style={{marginTop: 20}}>
        <FlexRow gap={15}>
          <div>
            <Typography variant="bodyLarge" style={{fontWeight: 600, marginBottom: 30}} content="Prolazni račun" />
            <FlexRow gap={8}>
              <Dropdown
                onChange={value => onFilterChange(value, 'bank_account', 'main')}
                value={mainFilters.bank_account}
                options={orgUnitBankAccountOptions}
                label="ŽIRO RAČUN:"
              />
              <Datepicker
                onChange={value => onFilterChange(value, 'date', 'main')}
                selected={mainFilters.date ? new Date(mainFilters.date) : null}
                label="DATUM:"
              />
            </FlexRow>
            <FlexColumn gap={4} style={{marginTop: 15}} align="stretch">
              {mainState?.items.map((item: InitialState) => (
                <InitialStateItem key={`${item.current_bank_account}- ${item.amount}`}>
                  <Typography
                    variant="bodySmall"
                    content={item.current_bank_account}
                    style={{color: Theme.palette.gray300}}
                  />
                  <Typography
                    variant="bodySmall"
                    content={formatCurrency(item.amount)}
                    style={{color: Theme.palette.gray300}}
                  />
                </InitialStateItem>
              ))}
            </FlexColumn>
          </div>
          <div>
            <Typography variant="bodyLarge" style={{fontWeight: 600, marginBottom: 30}} content="Prelazni račun" />
            <FlexRow gap={8}>
              <Datepicker
                onChange={value => onFilterChange(value, 'date', 'transitional')}
                selected={transitionalFilters.date ? new Date(transitionalFilters.date) : null}
                label="DATUM:"
              />
            </FlexRow>
            <FlexColumn gap={4} style={{marginTop: 15}} align="stretch">
              {transitionalState?.items.map((item: InitialState) => (
                <InitialStateItem key={`${item.current_bank_account}- ${item.amount}`}>
                  <Typography
                    variant="bodySmall"
                    content={item.current_bank_account}
                    style={{color: Theme.palette.gray300}}
                  />
                  <Typography
                    variant="bodySmall"
                    content={formatCurrency(item.amount)}
                    style={{color: Theme.palette.gray300}}
                  />
                </InitialStateItem>
              ))}
            </FlexColumn>
          </div>
        </FlexRow>
      </SectionBox>
    </ScreenWrapper>
  );
};

export default TransitDepositLandingPage;
