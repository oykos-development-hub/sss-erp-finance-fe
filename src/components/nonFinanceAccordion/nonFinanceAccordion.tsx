import {Accordion, ChevronDownIcon, MoreVerticalIcon, Typography} from 'client-library';
import {ActivitySection} from './activitySection';
import {ProgramSection} from './programSection/programSection.tsx';
import {AccordionHeader, AccordionIconsWrapper, AccordionWrapper, Menu, MenuItem} from './styles';
import {SubprogramSection} from './subprogramSection';
import {useState, MouseEvent} from 'react';
import {ProgramSectionPreview} from './programSection/programSectionPreview.tsx';

interface NonFinanceAccordionProps {
  programNo: number;
  handleDeleteProgram?: (programNo: number) => void;
  isPreview?: boolean;
}

export const NonFinanceAccordion = ({programNo, handleDeleteProgram, isPreview}: NonFinanceAccordionProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openAccordion = () => {
    setIsOpen(prevState => !prevState);
  };

  const showMenuHandler = () => {
    setShowMenu(prevState => !prevState);
  };

  const customContent = () => {
    if (!isPreview) {
      return (
        <>
          <ProgramSection programNo={programNo} />
          <SubprogramSection programNo={programNo} />
          <ActivitySection programNo={programNo} />
        </>
      );
    }
    return (
      <>
        <ProgramSectionPreview section={1} goals={['Goal 1', 'Goal 2']} />
        <ProgramSectionPreview section={2} goals={[]} />
        <ProgramSectionPreview section={3} goals={[]} />
      </>
    );
  };

  return (
    <AccordionWrapper isOpen={isOpen}>
      <Accordion
        style={{display: 'block'}}
        isOpen={isOpen}
        customHeader={
          <AccordionHeader>
            <Typography variant="bodyMedium" content={`PROGRAM ${programNo}`} style={{fontWeight: 600}} />
            <AccordionIconsWrapper isOpen={isOpen}>
              <ChevronDownIcon
                width="15px"
                height="8px"
                onClick={(e: MouseEvent<HTMLElement> | undefined) => {
                  e?.stopPropagation();
                  openAccordion();
                }}
              />
              {!isPreview && (
                <MoreVerticalIcon
                  width="5px"
                  height="16px"
                  onClick={(e: MouseEvent<HTMLElement> | undefined) => {
                    e?.stopPropagation();
                    showMenuHandler();
                  }}
                  style={{padding: '10px'}}
                />
              )}
            </AccordionIconsWrapper>
            <Menu open={showMenu}>
              <MenuItem>
                <Typography
                  content="Obriši program"
                  variant="bodyMedium"
                  onClick={(e: MouseEvent<HTMLElement> | undefined) => {
                    e?.stopPropagation();
                    handleDeleteProgram && handleDeleteProgram(programNo);
                    setShowMenu(prevState => !prevState);
                  }}
                />
              </MenuItem>
            </Menu>
          </AccordionHeader>
        }
        customContent={customContent()}
      />
    </AccordionWrapper>
  );
};
