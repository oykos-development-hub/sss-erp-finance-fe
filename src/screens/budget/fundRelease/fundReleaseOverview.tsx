import {Button, Dropdown, Table} from 'client-library';
import {useMemo, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import useGetFundRelease from '../../../services/graphQL/fundRelease/useGetFundRelease';
import {DropdownData} from '../../../types/dropdownData';
import {getYearOptions} from '../../../utils/getYearOptions';
import {monthVarsSr} from '../spendingDynamics/constants';
import {FundReleaseStatus, fundReleaseTableHeads} from './constants';
import {ButtonWrapper, DropdownWrapper, HeaderWrapper, SectionBox, Wrapper} from './styles';
import useDeleteFundRelease from '../../../services/graphQL/fundRelease/useDeleteFundRelease';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal';
import {FundReleaseItem} from '../../../types/graphQL/fundRelease';
import FundReleaseModal from '../../../components/fundReleaseModal/fundReleaseModal.tsx';
import FundReleaseModalAcceptBySSS from '../../../components/fundReleaseModal/fundReleaseModalAcceptBySSS.tsx';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

type FundReleaseFilters = {
  year: DropdownData<number>;
  month: DropdownData<number> | null;
};

const FundReleaseOverview = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateFundReleaseModal, setShowCreateFundReleaseModal] = useState(false);
  const [showAcceptBySSSModal, setShowAcceptBySSSModal] = useState<FundReleaseItem | null>(null);

  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    alert,
    contextMain: {
      organization_unit: {id: organization_unit_id},
      permissions,
    },
  } = useAppContext();

  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');
  const updatePermissions = updatePermittedRoutes.includes('/finance/budget/current/fund-release');
  const createPermittedRoutes = checkActionRoutePermissions(permissions, 'create');
  const createPermissions = createPermittedRoutes.includes('/finance/budget/current/fund-release');

  const [filters, setFilters] = useState<FundReleaseFilters>({
    year: {id: new Date().getFullYear(), title: new Date().getFullYear().toString()},
    month: null,
  });

  const isRequests = pathname.split('/').pop() === 'requests';

  const {fundRelease, refetch} = useGetFundRelease({
    year: filters.year?.id,
    month: filters.month?.id,
    hide: isRequests ? true : undefined,
    unit_id: isRequests ? undefined : organization_unit_id,
    status: isRequests ? FundReleaseStatus.Created : undefined,
  });

  // used to check if current month release exists
  const {fundRelease: allReleases, refetch: refetchAll} = useGetFundRelease({
    year: filters.year?.id,
    unit_id: organization_unit_id,
  });
  const {deleteFundRelease} = useDeleteFundRelease();

  const currentMonthReleaseExists = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    return allReleases && allReleases.find((item: FundReleaseItem) => item.month === currentMonth);
  }, [allReleases]);

  const onChange = (value: any, name: string) => {
    setFilters(prev => ({...prev, [name]: value}));
  };

  // const onDeleteClick = () => {
  //   setShowDeleteModal(true);
  // };

  const handleDelete = async () => {
    if (!showDeleteModal) return;

    await deleteFundRelease(
      () => {
        alert.success('Uspješno obrisano.');
        refetch();
        refetchAll();
      },
      () => {
        alert.error('Došlo je do greške prilikom brisanja.');
      },
    );
    setShowDeleteModal(false);
  };

  const monthOptions = monthVarsSr.map((month, index) => ({id: index + 1, title: month}));
  const yearOptions = getYearOptions(10, true, 5);

  const handleRowClick = (row: any) => {
    isRequests
      ? setShowAcceptBySSSModal(row)
      : row?.status === FundReleaseStatus.Accepted
      ? navigate('/finance/budget/current/fund-release/new-request')
      : navigate(`/finance/budget/current/fund-release/${row.month}_${row.year}`);
  };
  return (
    <>
      <SectionBox>
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
            {!currentMonthReleaseExists && !isRequests && (updatePermissions || createPermissions) && (
              <Button
                content="Kreiraj zahtjev za otpuštanje sredstava"
                style={{width: '200px'}}
                variant="secondary"
                onClick={() => setShowCreateFundReleaseModal(true)}
              />
            )}
          </ButtonWrapper>
        </Wrapper>
        <Table data={fundRelease} tableHeads={fundReleaseTableHeads} onRowClick={handleRowClick} />
      </SectionBox>

      <ConfirmationModal
        open={!!showDeleteModal}
        subTitle="Ovo otpuštanje će biti trajno izbrisano iz sistema."
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDelete()}
      />
      <FundReleaseModal
        open={showCreateFundReleaseModal}
        onClose={() => setShowCreateFundReleaseModal(false)}
        refetch={() => {
          refetch();
          refetchAll();
        }}
      />
      <FundReleaseModalAcceptBySSS
        onClose={() => setShowAcceptBySSSModal(null)}
        refetch={refetch}
        open={!!showAcceptBySSSModal}
        item={showAcceptBySSSModal}
      />
    </>
  );
};

export default FundReleaseOverview;
