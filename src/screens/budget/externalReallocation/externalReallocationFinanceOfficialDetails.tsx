import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {SectionBox} from './styles.tsx';
import useAppContext from '../../../context/useAppContext.ts';
import useGetExternalReallocations from '../../../services/graphQL/externalReallocations/useGetExternalReallocations.ts';
import {TitleTabsWrapper} from '../../deposit/styles.ts';
import {MainTitle} from '../budgetSendDetails/styles.tsx';
import {LabeledDivider} from '../../finesAndTaxes/flatRate/paymentDetails/styles.ts';
import {ReallocationItemDetail} from '../../../types/graphQL/externalReallocations.ts';
import {Amount} from '../../finesAndTaxes/confiscation/paymentDetails/styles.ts';
import BudgetTable from '../../../shared/budgetTable/budgetTable.tsx';
import {BudgetTableStep} from '../../../shared/budgetTable/types.ts';
import Footer from '../../../shared/footer.ts';
import {Typography, Button} from 'client-library';
import useGetCurrentBudget from '../../../services/graphQL/currentBudget/useGetCurrentBudget.ts';
import {useState} from 'react';
import {ConfirmationModal} from '../../../shared/confirmationModal/confirmationModal.tsx';
import useAcceptSSSExternalReallocations from '../../../services/graphQL/externalReallocations/useAcceptSSSExternalReallocations.ts';
import useRejectSSSExternalReallocations from '../../../services/graphQL/externalReallocations/useRejectSSSExternalReallocations.ts';
import {ReallocationStatusEnum} from '../../../constants.ts';
import {flattenAccounts} from '../../../shared/budgetTable/utils.ts';

const ExternalReallocationFinanceOfficialDetails = () => {
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
  const {currentBudgetAccounts} = useGetCurrentBudget({organization_unit_id});
  const counts = flattenAccounts(currentBudgetAccounts);

  const {acceptSSSExternalReallocations} = useAcceptSSSExternalReallocations();
  const {rejectSSSExternalReallocations} = useRejectSSSExternalReallocations();

  const [modal, setModal] = useState<'accept' | 'reject' | null>(null);

  const reallocation = externalReallocations?.[0];
  const disabled =
    reallocation?.status === ReallocationStatusEnum.acceptedSSS ||
    reallocation?.status === ReallocationStatusEnum.rejectedSSS;

  let totalRequestedAmount = 0;

  const handleSubmit = () => {
    acceptSSSExternalReallocations(
      reallocation?.id,

      () => {
        navigate('/finance/budget/requests');
        alert.success('Zahtjev uspješno odobren.');
      },
      () => {
        alert.error('Došlo je do greške prilikom odobravanja zahtjeva!');
      },
    );
  };

  const handleReject = () => {
    rejectSSSExternalReallocations(
      reallocation?.id,
      () => {
        navigate('/finance/budget/requests');
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
            content={`Naziv predlagača: ${reallocation?.destination_organization_unit.title}`}
            style={{marginBottom: 0}}
          />
          <MainTitle
            variant="bodyMedium"
            content={`Naziv pošiljaoca: ${reallocation?.source_organization_unit.title}`}
            style={{marginBottom: 0}}
          />
        </TitleTabsWrapper>
        <div style={{marginBottom: 24}}>
          <LabeledDivider>
            <Typography style={{fontWeight: 600}} variant="bodySmall" content="PREGLED ZAHTJEVA:" />
          </LabeledDivider>

          {!!reallocation &&
            reallocation.items.map((item: ReallocationItemDetail) => {
              const tempCount = counts.find(count => count.id === item?.destination_account?.id);

              if (!tempCount) return <></>;

              totalRequestedAmount += parseInt(item.amount);
              return (
                <Amount key={`item-${id}`} style={{marginLeft: 10}}>
                  <Typography
                    style={{fontWeight: 600}}
                    variant="bodySmall"
                    content={`${tempCount?.serial_number} - ${tempCount?.title}: `}
                  />
                  <Typography variant="bodySmall" content={`${item.amount} €`} />
                </Amount>
              );
            })}
          <Amount key={`item-${id}`} style={{marginLeft: 10}}>
            <Typography style={{fontWeight: 600}} variant="bodySmall" content="Ukupno: " />
            <Typography variant="bodySmall" content={`${totalRequestedAmount} €`} />
          </Amount>
        </div>
        <BudgetTable
          step={BudgetTableStep.EXTERNAL_REALLOCATION_FO_PREVIEW}
          organizationUnitId={organization_unit_id}
          year={new Date().getFullYear()}
          countsProps={currentBudgetAccounts}
          extraData={reallocation?.items}
          disabled={true}
        />
        <Footer>
          <Button
            content="Nazad"
            variant="secondary"
            onClick={() => navigate('/finance/budget/current/external-reallocation')}
          />
          {!disabled && (
            <>
              <Button content="Odbij" variant="primary" onClick={() => setModal('reject')} />
              <Button content="Odobri" variant="primary" onClick={() => setModal('accept')} />
            </>
          )}
        </Footer>
      </SectionBox>
      <ConfirmationModal
        open={!!modal}
        onClose={() => setModal(null)}
        onConfirm={modal === 'accept' ? handleSubmit : handleReject}
        customContent={
          <>
            <Typography
              content={`Da li ste sigurni da želite da ${modal === 'accept' ? 'odobrite' : 'odbijete'} zahtjev? `}
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

export default ExternalReallocationFinanceOfficialDetails;
