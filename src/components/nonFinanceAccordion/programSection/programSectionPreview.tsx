import {Typography, Divider, Theme} from 'client-library';
import {
  ProgramTitle,
  ProgramTitleContainer,
  ProgramWrapper,
  TextAreaWrapper,
  PreviewWrapper,
  TextWrapper,
  ItemWrapper,
} from '../styles.ts';
import {Goal} from '../../../types/nonFinance.ts';

interface SectionPreviewProps {
  section: 1 | 2 | 3;
  goals: Goal[];
  code?: string;
  description?: string;
  id?: number;
  title?: string;
  sectionCustomTitle?: string;
}

export const ProgramSectionPreview = (props: SectionPreviewProps) => {
  const {section, goals, code, description, title, sectionCustomTitle} = props;
  const sectionName = section === 1 ? 'PROGRAMA' : section === 2 ? 'POTPROGRAMA' : 'AKTIVNOSTI';

  return (
    <>
      <ProgramTitleContainer>
        <ProgramTitle
          variant="bodyMedium"
          content={
            sectionCustomTitle === undefined ? `SEKCIJA ${section} OD 3 - DETALJI ${sectionName}` : sectionCustomTitle
          }
          style={{fontWeight: 600}}
        />
      </ProgramTitleContainer>
      <ProgramWrapper>
        <TextWrapper>
          <PreviewWrapper>
            <ItemWrapper>
              <Typography content={`NAZIV ${sectionName}:`} variant="bodyMedium" style={{fontWeight: 600}} />
              <Typography content={title} variant="bodyMedium" />
            </ItemWrapper>
            <>
              <Typography content="OPIS:" variant="bodyMedium" style={{fontWeight: 600}} />
              <Typography content={description} variant="bodyMedium" />
            </>
          </PreviewWrapper>
          <PreviewWrapper>
            <Typography content="KOD:" variant="bodyMedium" style={{fontWeight: 600}} />
            <Typography content={code} variant="bodyMedium" />
          </PreviewWrapper>
        </TextWrapper>
        {!!goals.length && (
          <>
            <TextAreaWrapper>
              <Typography
                content={'LISTA CILJEVA'}
                variant="bodyMedium"
                style={{fontWeight: 600, color: Theme.palette.gray600}}
              />
            </TextAreaWrapper>
            <Divider />
            <TextAreaWrapper>
              {goals.map((goal, index) => (
                <Typography key={index} content={goal.title} style={{color: Theme.palette.gray600}} />
              ))}
            </TextAreaWrapper>
          </>
        )}
      </ProgramWrapper>
    </>
  );
};
