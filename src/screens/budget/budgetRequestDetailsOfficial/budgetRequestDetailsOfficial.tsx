import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import useAppContext from '../../../context/useAppContext.ts';
import {useEffect, useMemo, useState} from 'react';
import useGetBudgetRequestDetails from '../../../services/graphQL/budgetRequestDetails/useGetBudgetRequestDetails.ts';
import {budgetTabs} from '../../../constants.ts';
import {NonFinanceOfficial} from '../planning/OUBudgetSubmission/budgetNonFinancial/nonFinanceOfficial.tsx';
import {NotFound404} from '../../404.tsx';
import StyledTabsWithTitle from '../../../shared/styledTabsWithTitle/styledTabsWithTitle.tsx';
import SectionBox from '../../../shared/sectionBox.ts';
import {getCurrentTab} from '../../../utils/getCurrentTab.ts';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import BudgetFinancialRequest from '../planning/OUBudgetSubmission/budgetFinancial/budgetFinancialRequest.tsx';
import Footer from '../../../shared/footer.ts';
import {Button, Input, Dropdown} from 'client-library';
import useAcceptBudgetRequestOfficial from '../../../services/graphQL/budgetRequestOfficial/useAcceptBudgetRequestOfficial.ts';
import useRejectBudgetRequestOfficial from '../../../services/graphQL/budgetRequestOfficial/useRejectBudgetRequestOfficial.ts';
import {DropdownData} from '../../../types/dropdownData.ts';
import {DropdownWrapper, FormWrapper, TextAreaWrapper} from '../planning/OUBudgetSubmission/styles.ts';
import {getRouteName} from '../../../utils/getRouteName.ts';
import BudgetSummary from '../planning/OUBudgetSubmission/budgetSummary.tsx';

const BudgetRequestDetailsOfficial = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    alert,
    breadcrumbs,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState(getCurrentTab(pathname, budgetTabs) || 1);

  useEffect(() => {
    setActiveTab(getCurrentTab(pathname, budgetTabs) || 1);
    activeTab === 1 && refetch();
  }, [pathname]);

  const ids = useMemo(() => {
    const path = pathname.split('/');
    return {budgetId: parseInt(path[path.length - 4]), organizationUnitId: parseInt(path[path.length - 2])};
  }, [pathname]);

  const {budgetRequestDetails, refetch} = useGetBudgetRequestDetails(ids);
  const {acceptBudgetRequestOfficial} = useAcceptBudgetRequestOfficial();
  const {rejectBudgetRequestOfficial} = useRejectBudgetRequestOfficial();

  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<DropdownData<number>>({id: 1, title: 'Odobreno'});

  useEffect(() => {
    setStatus({id: 1, title: 'Odobreno'});
    setComment('');
  }, [activeTab]);

  useEffect(() => {
    if (!budgetRequestDetails) return;
    setComment(budgetRequestDetails?.financial.official_comment ?? '');
  }, [budgetRequestDetails]);

  useEffect(() => {
    if (status.id === 1) {
      setComment('');
    }
  }, [status]);

  const handleDropdownChange = (value: any) => {
    setStatus(value as DropdownData<number>);
  };

  const handleSubmitBudgetRequest = () => {
    const financialBudgetId = budgetRequestDetails?.financial?.request_id;
    const nonFinancialBudgetId = budgetRequestDetails?.non_financial?.request_id;

    const onSuccess = () => {
      setActiveTab(1);
      navigate(`/finance/budget/planning/${ids.budgetId}/requests/${ids.organizationUnitId}/summary`);
      breadcrumbs.remove();
    };

    if (!financialBudgetId || !nonFinancialBudgetId) return;

    if (status.id === 1) {
      acceptBudgetRequestOfficial(
        activeTab === 2 ? financialBudgetId : nonFinancialBudgetId,
        () => {
          onSuccess();
          alert.success('Uspješno odobreno.');
        },
        () => {
          alert.error('Došlo je do greške prilikom odobravanja.');
        },
      );
    } else if (status.id === 2) {
      rejectBudgetRequestOfficial(
        activeTab === 2 ? financialBudgetId : nonFinancialBudgetId,
        comment,
        () => {
          onSuccess();
          alert.success('Uspješno odbijeno.');
        },
        () => {
          alert.error('Došlo je do greške prilikom odbijanja.');
        },
      );
    }
  };
  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string, budgetTabs);
    if (activeTab !== tab.id) {
      navigate(`/finance/budget/planning/${ids.budgetId}/requests/${ids.organizationUnitId}/${routeName}`);
    }
  };

  const content = useMemo(() => {
    if (pathname === `/finance/budget/planning/${ids.budgetId}/requests/${ids.organizationUnitId}/financial`)
      return <BudgetFinancialRequest budgetRequestDetails={budgetRequestDetails} />;
    if (pathname === `/finance/budget/planning/${ids.budgetId}/requests/${ids.organizationUnitId}/non-financial`)
      return <NonFinanceOfficial budgetRequestDetails={budgetRequestDetails} isPreview={true} />;
    if (pathname === `/finance/budget/planning/${ids.budgetId}/requests/${ids.organizationUnitId}/summary`)
      return (
        <BudgetSummary
          budgetRequestDetails={budgetRequestDetails}
          navigationRoutePrefix={`/finance/budget/planning/${ids.budgetId}/requests/${ids.organizationUnitId}`}
        />
      );

    return <NotFound404 />;
  }, [pathname, budgetRequestDetails]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <StyledTabsWithTitle tabs={budgetTabs} activeTab={activeTab} onChange={onTabChange} />
        {content}
        {activeTab !== 1 && (
          <FormWrapper>
            <DropdownWrapper>
              <Dropdown
                name="status"
                label="Status:"
                placeholder="Odaberi status"
                options={
                  [
                    {id: 1, title: 'Odobreno'},
                    {id: 2, title: 'Odbijeno'},
                  ] as DropdownData<number>[]
                }
                value={status}
                onChange={handleDropdownChange}
              />
            </DropdownWrapper>
            <TextAreaWrapper>
              <Input
                onChange={e => {
                  setComment(e.target.value);
                }}
                value={comment}
                label={'Komentar:'}
                textarea
                placeholder={'Dodaj komentar'}
                disabled={status.id === 1}
              />
            </TextAreaWrapper>
          </FormWrapper>
        )}
      </SectionBox>
      {activeTab !== 1 && (
        <Footer>
          <Button content="Sačuvaj" variant="secondary" onClick={handleSubmitBudgetRequest} />
        </Footer>
      )}
    </ScreenWrapper>
  );
};

export default BudgetRequestDetailsOfficial;
