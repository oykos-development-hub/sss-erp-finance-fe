import {Button, Typography} from 'client-library';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import BudgeLimitModal from '../../../components/budgeLimitModal/budgeLimitModal.tsx';
import {MainTitle, OverviewBox} from '../../../components/budgetList/styles.ts';
import useAppContext from '../../../context/useAppContext.ts';
import useInsertBudget from '../../../services/graphQL/insertBudget/useInsertBudget.ts';
import BudgetTable from '../../../shared/budgetTable/budgetTable.tsx';
import {BudgetTableStep} from '../../../shared/budgetTable/types.ts';
import Footer from '../../../shared/footer.ts';
import ScreenWrapper from '../../../shared/screenWrapper/screenWrapper.tsx';
import {LimitType} from '../../../types/graphQL/budgetInsert.ts';
import {getYearFromPath} from '../../../utils/getYearFromPath.ts';
import {BoldText, Box, Controls, TableGrid} from './styles.tsx';

const BudgetCreate = () => {
  const [limitModal, setLimitModal] = useState(false);
  const [limits, setLimits] = useState<LimitType[]>([]);

  const {handleSubmit} = useForm();

  const {
    navigation: {
      location: {pathname},
      navigate,
    },
    contextMain,
    alert,
  } = useAppContext();

  const budgetID = pathname.split('/').at(-1);

  const year = getYearFromPath(pathname);
  const budgetTypeId = location.pathname.split('/').at(2);

  const {insertBudget, loading: isSaving} = useInsertBudget();

  const handleModalSubmit = (formData: any) => {
    setLimits(formData);
  };

  const onSubmit = async (data: any) => {
    if (isSaving) return;

    const payload = {
      id: Number(budgetID) || null,
      year: data.year || year.toString(),
      budget_type: Number(budgetTypeId) || null,
      limits: data.limits || limits,
    };

    await insertBudget(
      payload,
      () => {
        alert.success('Uspješno sačuvano.');
        navigate('/finance/budget/planning');
      },
      () => alert?.error('Greška. Promjene nisu sačuvane.'),
    );
  };

  const toggleModal = () => setLimitModal(prev => !prev);

  return (
    <ScreenWrapper>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content={`Budžet ${year}`} />
        <hr />
        <Box>
          <Controls>
            <TableGrid>
              <BoldText variant="bodySmall" content="NAZIV PREDLAGAČA:" />
              <Typography variant="bodySmall" content={contextMain.organization_unit.title} />
            </TableGrid>
            <Button content="Limiti" variant="secondary" style={{width: 130}} onClick={() => setLimitModal(true)} />
          </Controls>
        </Box>
        {/* <Box>
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
        </Box> */}
        <BudgetTable step={BudgetTableStep.CREATING} year={year} organizationUnitId={1} />

        <Footer>
          <Button
            content="Otkaži"
            variant="secondary"
            style={{width: 130}}
            onClick={() => navigate('/finance/budget/planning')}
          />
          <Button
            content="Sačuvaj"
            variant="primary"
            style={{width: 130}}
            onClick={handleSubmit(onSubmit)}
            disabled={limits.length === 0}
          />
        </Footer>
      </OverviewBox>
      <BudgeLimitModal open={limitModal} onClose={toggleModal} onSubmit={handleModalSubmit} />
    </ScreenWrapper>
  );
};

export default BudgetCreate;
