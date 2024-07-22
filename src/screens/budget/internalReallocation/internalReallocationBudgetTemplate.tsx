import {Button, Divider, Typography} from 'client-library';
import useAppContext from '../../../context/useAppContext';
import BudgetTable from '../../../shared/budgetTable/budgetTable';
import {BudgetTableMethods, BudgetTableStep} from '../../../shared/budgetTable/types';
import Footer from '../../../shared/footer';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {BoldText, Box, MainTitle, SectionBox, Header, TitleWrapper} from './styles';
import useGetCurrentBudget from '../../../services/graphQL/currentBudget/useGetCurrentBudget.ts';
import {useRef} from 'react';
import {calcReallocationSums, flattenReallocationBudgetData} from '../../../shared/budgetTable/utils.ts';
import useInternalReallocationsInsert from '../../../services/graphQL/internalReallocations/useInternalReallocationsInsert.ts';
import useInternalReallocationsOverview from '../../../services/graphQL/internalReallocations/useInternalReallocationsOverview.ts';
import {generateInternalReallocationPdfData} from '../../../utils/internalReallocationPdfUtils.ts';
import {useRoleCheck} from '../../../utils/useRoleCheck.ts';
import {UserRole} from '../../../constants.ts';

const InternalReallocationBudget = () => {
  const {
    contextMain: {organization_unit, role_id},
    navigation: {
      navigate,
      location: {pathname},
    },
    alert,
    reportService: {generatePdf, loadingPDF},
  } = useAppContext();

  const {currentBudgetAccounts, budget_id} = useGetCurrentBudget({organization_unit_id: organization_unit.id});
  const {insertInternalReallocations} = useInternalReallocationsInsert();
  const reallocationID = pathname.split('/').at(-1);
  const parsedReallocationID = reallocationID && !Number.isNaN(reallocationID) ? parseInt(reallocationID) : undefined;
  const isNew = reallocationID === 'create';

  const {internalReallocationsOverview} = useInternalReallocationsOverview({id: parsedReallocationID, skip: isNew});

  const budgetTableRef = useRef<BudgetTableMethods>(null);

  const handleSave = () => {
    const internalState = budgetTableRef.current?.getInternalState();
    const flattenedBudget = flattenReallocationBudgetData(internalState);
    const reallocationSums = calcReallocationSums(internalState);

    if (reallocationSums.diff) {
      alert.error(
        `Sume preusmjerenih sredstava se ne poklapaju. Lijeva kolona je ${
          reallocationSums.diff > 0 ? 'veća' : 'manja'
        } za ${Math.abs(reallocationSums.diff)}!`,
      );
      return;
    }

    insertInternalReallocations(
      {organization_unit_id: organization_unit?.id, budget_id, items: flattenedBudget},
      () => {
        navigate('/finance/budget/current/internal-reallocation');
        alert.success('Preusmjerenje sredstava uspješno.');
      },
      () => {
        alert.error('Došlo je do greške prilikom preusmjerenja sredstava!');
      },
    );
  };

  const handlePDFExport = () => {
    if (!currentBudgetAccounts.length || !internalReallocationsOverview[0]?.items?.length)
      return alert.error('Nema podataka za izvoz PDF-a');

    generatePdf(
      'INTERNAL_REALLOCATIONS',
      generateInternalReallocationPdfData(currentBudgetAccounts, internalReallocationsOverview[0]?.items),
    );
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        {/* Fixed until we have BE ready */}
        <MainTitle variant="bodyMedium" content="INTERNO PREUSMJERENJE" />
        <Divider color="#615959" height="1px" />
        <Box>
          <Header>
            <TitleWrapper>
              <BoldText variant="bodySmall" content="NAZIV PREDLAGAČA:" />
              <Typography variant="bodySmall" content={organization_unit.title} />
            </TitleWrapper>
            {useRoleCheck(role_id, [UserRole.ADMIN]) && (
              <Button
                content="Eksportuj PDF"
                variant="secondary"
                size={'sm'}
                onClick={handlePDFExport}
                loader={loadingPDF}
              />
            )}
          </Header>
        </Box>
        <div>
          <BudgetTable
            step={isNew ? BudgetTableStep.INTERNAL_REALLOCATION : BudgetTableStep.INTERNAL_REALLOCATION_PREVIEW}
            organizationUnitId={organization_unit?.id}
            year={new Date().getFullYear()}
            countsProps={currentBudgetAccounts}
            ref={budgetTableRef}
            disabled={!isNew}
            //data to fill + and - table columns when previewing existing reallocation
            extraData={internalReallocationsOverview[0]?.items}
          />
        </div>

        <Footer>
          <Button
            content="Nazad"
            variant="secondary"
            onClick={() => navigate('/finance/budget/current/internal-reallocation')}
          />
          {isNew && <Button content="Sačuvaj" variant="primary" onClick={handleSave} />}
        </Footer>
      </SectionBox>
    </ScreenWrapper>
  );
};

export default InternalReallocationBudget;
