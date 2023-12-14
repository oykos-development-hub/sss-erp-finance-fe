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

interface SectionPreviewProps {
  section: 1 | 2 | 3;
  goals: string[];
}

export const ProgramSectionPreview = (props: SectionPreviewProps) => {
  const {section, goals} = props;
  const sectionName = section === 1 ? 'PROGRAMA' : section === 2 ? 'POTPROGRAMA' : 'AKTIVNOSTI';

  return (
    <>
      <ProgramTitleContainer>
        <ProgramTitle
          variant="bodyMedium"
          content={`SEKCIJA ${section} OD 3 - DETALJI ${sectionName}`}
          style={{fontWeight: 600}}
        />
      </ProgramTitleContainer>
      <ProgramWrapper>
        <TextWrapper>
          <PreviewWrapper>
            <ItemWrapper>
              <Typography content={`NAZIV ${sectionName}:`} variant="bodyMedium" style={{fontWeight: 600}} />
              <Typography content={'xxxxxxxxx'} variant="bodyMedium" />
            </ItemWrapper>
            <>
              <Typography content="OPIS:" variant="bodyMedium" style={{fontWeight: 600}} />
              <Typography content={'xxxxxxxxx'} variant="bodyMedium" />
            </>
          </PreviewWrapper>
          <PreviewWrapper>
            <Typography content="KOD:" variant="bodyMedium" style={{fontWeight: 600}} />
            <Typography content={'xxxxxxx'} variant="bodyMedium" />
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
                <Typography key={index} content={goal} style={{color: Theme.palette.gray600}} />
              ))}
            </TextAreaWrapper>
          </>
        )}
      </ProgramWrapper>
    </>
  );
};
