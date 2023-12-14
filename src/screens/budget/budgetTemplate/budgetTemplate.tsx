import {ScreenWrapper} from './styles.ts';
import BudgetTable from '../../../shared/budgetTable/budgetTable.tsx';
import {useState} from 'react';
import {BudgetTableStep} from '../../../shared/budgetTable/types.ts';
import {Button} from 'client-library';
import useAppContext from '../../../context/useAppContext.ts';
import {getYearFromPath} from '../../../utils/getYearFromPath.ts';

interface BudgetTemplateProps {
  initialStep?: BudgetTableStep | `${BudgetTableStep}`;
}
const BudgetTemplate = ({initialStep}: BudgetTemplateProps) => {
  const [step, setStep] = useState<BudgetTableStep | `${BudgetTableStep}`>(initialStep ?? 'creating');
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();

  const year = getYearFromPath(pathname);

  return (
    <ScreenWrapper>
      {!initialStep && (
        <div style={{display: 'flex', gap: 10, marginBottom: 20}}>
          <Button onClick={() => setStep('creating')} content="Kreiranje (od strane SSS-a)" />
          <Button onClick={() => setStep('budgeting')} content="Popunjavanje vrijednosti (org jedinica)" />
          <Button onClick={() => setStep('budgeting-actual')} content="Popunjavanje pravih vrijednosti" />
          <Button onClick={() => setStep('view-annual')} content="Pregled (godisnji)" />
          <Button onClick={() => setStep('view-monthly')} content="Pregled (mjesecni)" />
          <Button onClick={() => setStep('rebalancing')} content="Rebalans" />
        </div>
      )}

      <BudgetTable step={step} year={year} organizationUnitId={1} />
    </ScreenWrapper>
  );
};

export default BudgetTemplate;
