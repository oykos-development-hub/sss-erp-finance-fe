import {Button, Divider, Dropdown, Table, TrashIcon, Theme} from 'client-library';
import {useMemo, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import useGetFundRelease from '../../../services/graphQL/fundRelease/useGetFundRelease';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {DropdownData} from '../../../types/dropdownData';
import {getYearOptions} from '../../../utils/getYearOptions';
import {MonthType, monthVars, monthVarsSr} from '../spendingDynamics/constants';
import {fundReleaseTableHeads} from './constants';
import {ButtonWrapper, DropdownWrapper, HeaderWrapper, MainTitle, SectionBox, Wrapper} from './styles';
import useDeleteFundRelease from '../../../services/graphQL/fundRelease/useDeleteFundRelease';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal';

type FundReleaseFilters = {
  year: DropdownData<number>;
  month: DropdownData<number> | null;
};

const FundReleaseOverview = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    navigation: {navigate},
    alert,
  } = useAppContext();

  const [filters, setFilters] = useState<FundReleaseFilters>({
    year: {id: new Date().getFullYear(), title: new Date().getFullYear().toString()},
    month: null,
  });

  const {fundRelease, refetch} = useGetFundRelease({year: filters.year?.id, month: filters.month?.id});
  const {deleteFundRelease} = useDeleteFundRelease();

  const fundReleaseList = useMemo(() => {
    return fundRelease
      ? fundRelease.map(item => ({
          ...item,
          id: `${item.year}-${item.month}`,
        }))
      : [];
  }, [fundRelease]);

  const onChange = (value: any, name: string) => {
    console.log(value);
    setFilters(prev => ({...prev, [name]: value}));
  };

  const navigateToCreateFundRelease = () => {
    navigate('/finance/budget/current/fund-release/new-request');
  };

  const onDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!showDeleteModal) return;

    await deleteFundRelease(
      () => {
        alert.success('Uspješno obrisano.');
        refetch();
      },
      () => {
        alert.error('Došlo je do greške prilikom brisanja.');
      },
    );
    setShowDeleteModal(false);
  };

  const monthOptions = monthVarsSr.map((month, index) => ({id: index + 1, title: month}));
  const yearOptions = getYearOptions(10, true, 5);

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="OTPUŠTANJE SREDSTAVA" />
        <Divider color="#615959" height="1px" />
        <Wrapper>
          <HeaderWrapper>
            <DropdownWrapper>
              <Dropdown
                name="year"
                value={filters.year}
                onChange={(val: any) => onChange(val, 'year')}
                options={yearOptions}
                label="GODINA:"
              />
            </DropdownWrapper>
            <DropdownWrapper>
              <Dropdown
                name="month"
                value={filters.month}
                onChange={(val: any) => onChange(val, 'month')}
                options={monthOptions}
                label="MJESEC:"
              />
            </DropdownWrapper>
          </HeaderWrapper>
          <ButtonWrapper>
            <Button
              content="Kreiraj zahtjev za otpuštanje sredstava"
              style={{width: '200px'}}
              variant="secondary"
              onClick={navigateToCreateFundRelease}
            />
          </ButtonWrapper>
        </Wrapper>
        <Table
          data={fundReleaseList as any}
          tableHeads={fundReleaseTableHeads}
          tableActions={[
            {
              name: 'Izbriši',
              onClick: () => {
                onDeleteClick();
              },
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
              shouldRender: (row: any) => {
                const currentMonth = new Date().toLocaleString('default', {month: 'long'}).toLowerCase() as MonthType;
                const monthNumber = monthVars.indexOf(currentMonth) + 1;
                console.log(row.month, monthNumber);
                return row.month === monthNumber;
              },
            },
          ]}
          onRowClick={(row: any) => navigate(`/finance/budget/current/fund-release/${row.month}_${row.year}`)}
        />
      </SectionBox>

      <ConfirmationModal
        open={!!showDeleteModal}
        subTitle="Ovo otpuštanje će biti trajno izbrisano iz sistema."
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDelete()}
      />
    </ScreenWrapper>
  );
};

export default FundReleaseOverview;
