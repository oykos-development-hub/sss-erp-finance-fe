import {useEffect} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetSalaries from '../../../../services/graphQL/salaries/useGetSalaries.ts';
import SalaryForm from '../salaryForm/salaryForm.tsx';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import {CustomDivider, MainTitle} from '../../../accounting/styles.tsx';
import SectionBox from '../../../../shared/sectionBox.ts';

const SalaryDetails = () => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();
  const id = pathname && pathname.split('/')[pathname.split('/').length - 1];
  const {salaries, refetch} = useGetSalaries({
    id,
  });

  useEffect(() => {
    console.log(salaries[0]);
  }, [salaries]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={`Zarada: ${id}`} style={{marginBottom: 0}} />
        <CustomDivider style={{marginTop: 0}} />
        <SalaryForm salary={salaries[0]} refetchSalary={refetch} />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default SalaryDetails;
