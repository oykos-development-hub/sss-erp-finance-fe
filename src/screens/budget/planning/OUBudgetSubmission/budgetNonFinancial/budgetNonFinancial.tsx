import {BudgetRequestItem} from '../../../../../types/graphQL/budgetRequestDetails.ts';
import Footer from '../../../../../shared/footer.ts';
import {Button, Accordion, Typography, ChevronDownIcon} from 'client-library';
import {ProgramSectionPreview} from '../../../../../components/nonFinanceAccordion/programSection/programSectionPreview.tsx';
import {
  AccordionHeader,
  AccordionIconsWrapper,
  AccordionWrapper,
} from '../../../../../components/nonFinanceAccordion/styles.ts';
import {MouseEvent, useState} from 'react';

const budgetNonFinancial = ({budgetRequestDetails}: {budgetRequestDetails?: BudgetRequestItem}) => {
  const {non_financial} = budgetRequestDetails || {};
  const [isOpen, setIsOpen] = useState<boolean>(true);

  if (!non_financial) return null;

  return (
    <>
      <AccordionWrapper isOpen={isOpen}>
        <Accordion
          style={{display: 'block'}}
          isOpen={isOpen}
          customHeader={
            <AccordionHeader>
              <Typography variant="bodyMedium" content={'AKTIVNOST'} style={{fontWeight: 600}} />
              <AccordionIconsWrapper isOpen={isOpen}>
                <ChevronDownIcon
                  width="15px"
                  height="8px"
                  onClick={(e: MouseEvent<HTMLElement> | undefined) => {
                    e?.stopPropagation();
                    setIsOpen(!isOpen);
                  }}
                />
              </AccordionIconsWrapper>
            </AccordionHeader>
          }
          customContent={
            <ProgramSectionPreview
              section={3}
              id={non_financial.activity.id}
              description={non_financial.activity.description}
              title={non_financial.activity.title}
              code={non_financial.activity.code}
              goals={non_financial.activity.goals}
              sectionCustomTitle={`# ${non_financial.activity.id}`}
            />
          }
        />
      </AccordionWrapper>
      <Footer>
        <Button content="Nazad" variant="secondary" onClick={() => console.log('Nazad')} />
        <Button content="Sačuvaj" variant="secondary" onClick={() => console.log('Sačuvaj')} />
      </Footer>
    </>
  );
};

export default budgetNonFinancial;
