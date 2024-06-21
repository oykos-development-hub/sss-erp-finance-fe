import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import useAppContext from '../../../context/useAppContext.ts';
import useGetExternalReallocations from '../../../services/graphQL/externalReallocations/useGetExternalReallocations.ts';
import {LabeledDivider} from '../../finesAndTaxes/flatRate/paymentDetails/styles.ts';
import {Typography, Button} from 'client-library';
import {ReallocationItemDetail, ReallocationItemForm} from '../../../types/graphQL/externalReallocations.ts';
import useGetCountOverview from '../../../services/graphQL/counts/useGetCountOverview.ts';
import {Amount} from '../../finesAndTaxes/confiscation/paymentDetails/styles.ts';
import {MainTitle} from '../budgetSendDetails/styles.tsx';
import {TitleTabsWrapper} from '../../deposit/styles.ts';
import {SectionBox} from './styles.tsx';
import {BudgetTableMethods, BudgetTableStep} from '../../../shared/budgetTable/types.ts';
import BudgetTable from '../../../shared/budgetTable/budgetTable.tsx';
import {useRef, useState} from 'react';
import useGetCurrentBudget from '../../../services/graphQL/currentBudget/useGetCurrentBudget.ts';
import Footer from '../../../shared/footer.ts';
import useAcceptOUExternalReallocations from '../../../services/graphQL/externalReallocations/useAcceptOUExternalReallocations.ts';
import {calcReallocationSums, flattenReallocationBudgetData} from '../../../shared/budgetTable/utils.ts';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';
import useRejectOUExternalReallocations from '../../../services/graphQL/externalReallocations/useRejectOUExternalReallocations.ts';

const ExternalReallocationDetails = () => {
  const {
    navigation: {
      location: {pathname},
      navigate,
    },
    contextMain: {
      organization_unit: {id: organization_unit_id},
    },
    alert,
  } = useAppContext();

  const id = parseInt(pathname.split('/').pop());

  const {externalReallocations} = useGetExternalReallocations({
    page: 1,
    organization_unit_id: organization_unit_id,
    id,
  });
  const {version, currentBudget} = useGetCurrentBudget({organization_unit_id});
  const {counts} = useGetCountOverview({level: 3, version: version});
  const [modal, setModal] = useState<'accept' | 'reject' | null>(null);

  const reallocation = externalReallocations?.[0];
  const budgetTableRef = useRef<BudgetTableMethods>(null);

  const {acceptOUExternalReallocations} = useAcceptOUExternalReallocations();
  const {rejectOUExternalReallocations} = useRejectOUExternalReallocations();

  const handleAccept = () => {
    const internalState = budgetTableRef.current?.getInternalState();
    const requestedAmountsSum = reallocation?.items.reduce((acc, item) => acc + parseInt(item.amount), 0);
    const sourceAmountsSum = calcReallocationSums(internalState).source;
    const diff = requestedAmountsSum - sourceAmountsSum;

    if (diff) {
      alert.error(
        `Zbir traženih sredstava je ${diff > 0 ? 'veći' : 'manji'} za ${Math.abs(diff)} od zbira unešenih iznosa!`,
      );
      return;
    }

    setModal('accept');
  };

  const handleSubmit = () => {
    const internalState = budgetTableRef.current?.getInternalState();
    const flattenedBudget = flattenReallocationBudgetData(internalState);

    acceptOUExternalReallocations(
      {
        id: reallocation?.id,
        items: flattenedBudget as ReallocationItemForm[],
      },
      () => {
        navigate('/finance/budget/current/external-reallocation');
        alert.success('Preusmjerenje sredstava uspješno.');
      },
      () => {
        alert.error('Došlo je do greške prilikom preusmjerenja sredstava!');
      },
    );
  };

  const handleReject = () => {
    rejectOUExternalReallocations(
      reallocation?.id,
      () => {
        navigate('/finance/budget/current/external-reallocation');
        alert.success('Zahtjev uspješno odbijen.');
      },
      () => {
        alert.error('Došlo je do greške prilikom odbijanja zahtjeva!');
      },
    );
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <TitleTabsWrapper>
          <MainTitle
            variant="bodyMedium"
            content={`Naziv predlagača: ${reallocation?.source_organization_unit.title}`}
            style={{marginBottom: 0}}
          />
        </TitleTabsWrapper>
        <div style={{marginBottom: 24}}>
          <LabeledDivider>
            <Typography style={{fontWeight: 600}} variant="bodySmall" content="PREGLED ZAHTJEVA:" />
          </LabeledDivider>

          {!!reallocation &&
            reallocation.items.map((item: ReallocationItemDetail) => {
              const tempCount = counts.find(count => count.id === item?.source_account?.id);

              return tempCount ? (
                <Amount key={`item-${id}`} style={{marginLeft: 10}}>
                  <Typography
                    style={{fontWeight: 600}}
                    variant="bodySmall"
                    content={`${tempCount?.serial_number} - ${tempCount?.title}: `}
                  />
                  <Typography variant="bodySmall" content={`${item.amount} €`} />
                </Amount>
              ) : (
                <></>
              );
            })}
        </div>
        <BudgetTable
          step={BudgetTableStep.EXTERNAL_REALLOCATION}
          organizationUnitId={organization_unit_id}
          year={new Date().getFullYear()}
          countsProps={currentBudget}
          ref={budgetTableRef}
        />
        <Footer>
          <Button
            content="Nazad"
            variant="secondary"
            onClick={() => navigate('/finance/budget/current/external-reallocation')}
          />
          <Button content="Odbij" variant="primary" onClick={() => setModal('reject')} />
          <Button content="Sačuvaj" variant="primary" onClick={handleAccept} />
        </Footer>
      </SectionBox>
      <ConfirmationModal
        open={!!modal}
        onClose={() => setModal(null)}
        onConfirm={modal === 'accept' ? handleSubmit : handleReject}
        customContent={
          <>
            <Typography
              content={`Da li ste sigurni da želite da ${modal === 'accept' ? 'prihvatite' : 'odbijete'} zahtjev? `}
              variant="bodyMedium"
              style={{fontWeight: 600, textAlign: 'center'}}
            />
            <Typography
              content={'Naknadne izmjene neće biti moguće.'}
              variant="bodySmall"
              style={{textAlign: 'center'}}
            />
          </>
        }
      />
    </ScreenWrapper>
  );
};

export default ExternalReallocationDetails;
