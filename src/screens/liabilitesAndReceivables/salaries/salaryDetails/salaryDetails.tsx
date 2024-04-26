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
  const salary = salaries[0];

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle
          variant="bodyMedium"
          content={`Zarada: ${id}${salary?.registred ? '- PROKNJIŽENA' : ''}`}
          style={{marginBottom: 0}}
        />
        <CustomDivider style={{marginTop: 0}} />
        <SalaryForm salary={salary} refetchSalary={refetch} />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default SalaryDetails;
