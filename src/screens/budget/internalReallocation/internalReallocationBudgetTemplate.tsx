import {Button, Divider, Typography} from 'client-library';
import useAppContext from '../../../context/useAppContext';
import BudgetTable from '../../../shared/budgetTable/budgetTable';
import {BudgetTableStep} from '../../../shared/budgetTable/types';
import Footer from '../../../shared/footer';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper';
import {BoldText, Box, MainTitle, SectionBox, TableGrid} from './styles';

const InternalReallocationBudget = () => {
  const {
    contextMain,
    navigation: {navigate},
  } = useAppContext();

  return (
    <ScreenWrapper>
      <SectionBox>
        {/* Fixed until we have BE ready */}
        <MainTitle variant="bodyMedium" content="INTERNO PREUSMJERENJE XXX - BUDŽET - XXXXXX" />
        <Divider color="#615959" height="1px" />
        <Box>
          <TableGrid>
            <BoldText variant="bodySmall" content="NAZIV PREDLAGAČA:" />
            <Typography variant="bodySmall" content={contextMain.organization_unit.title} />
          </TableGrid>
        </Box>
        <Box>
          <TableGrid>
            <BoldText variant="bodySmall" content="PROGRAM:" />
            <Typography variant="bodySmall" content={contextMain.organization_unit.title} />
            <BoldText variant="bodySmall" content="POTPROGRAM:" />
            <Typography variant="bodySmall" content={contextMain.organization_unit.title} />
            <BoldText variant="bodySmall" content="AKTIVNOSTI:" />
            <Typography variant="bodySmall" content={contextMain.organization_unit.title} />
            <BoldText variant="bodySmall" content="IZVOR:" />
            <Typography variant="bodySmall" content={contextMain.organization_unit.title} />
          </TableGrid>
        </Box>
        <div>
          <BudgetTable step={BudgetTableStep.INTERNAL_REALLOCATION} organizationUnitId={0} year={0} />
        </div>

        <Footer>
          <Button
            content="Odustani"
            variant="secondary"
            onClick={() => navigate('/finance/budget/current/internal-reallocation')}
          />
          <Button content="Sačuvaj" variant="primary" onClick={() => console.log('TO DO add logic')} />
        </Footer>
      </SectionBox>
    </ScreenWrapper>
  );
};

export default InternalReallocationBudget;
