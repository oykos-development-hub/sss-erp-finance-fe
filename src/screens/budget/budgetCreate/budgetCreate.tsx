import useAppContext from '../../../context/useAppContext.ts';
import {getYearFromPath} from '../../../utils/getYearFromPath.ts';
import BudgetTable from '../../../shared/budgetTable/budgetTable.tsx';
import {BudgetTableStep} from '../../../shared/budgetTable/types.ts';
import {MainTitle, OverviewBox} from '../../../components/budgetList/styles.ts';
import {BoldText, Box, TableGrid, Controls} from './styles.tsx';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {Typography, Button} from 'client-library';
import {useState} from 'react';

const BudgetCreate = () => {
  const [limitModal, setLimitModal] = useState(false);
  const {
    navigation: {
      location: {pathname, state},
    },
  } = useAppContext();

  const year = getYearFromPath(pathname);
  return (
    <ScreenWrapper>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content={`Budžet ${year}`} />
        <hr />
        <Box>
          <Controls>
            <TableGrid>
              <BoldText variant="bodySmall" content="NAZIV PREDLAGAČA:" />
              <Typography variant="bodySmall" content="SUDSKI SAVJET" />
            </TableGrid>
            <Button content="New Budget" variant="secondary" style={{width: 130}} onClick={() => setLimitModal(true)} />
          </Controls>
        </Box>
        <Box>
          <TableGrid>
            <BoldText variant="bodySmall" content="PROGRAM:" />
            <Typography variant="bodySmall" content="SUDSKI SAVJET" />
            <BoldText variant="bodySmall" content="POTPROGRAM:" />
            <Typography variant="bodySmall" content="SUDSKI SAVJET" />
            <BoldText variant="bodySmall" content="AKTIVNOSTI:" />
            <Typography variant="bodySmall" content="SUDSKI SAVJET" />
            <BoldText variant="bodySmall" content="IZVOR:" />
            <Typography variant="bodySmall" content="SUDSKI SAVJET" />
          </TableGrid>
        </Box>
        <BudgetTable step={BudgetTableStep.CREATING} year={year} organizationUnitId={1} />
      </OverviewBox>
      {limitModal && <></>}
    </ScreenWrapper>
  );
};

export default BudgetCreate;
