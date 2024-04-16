import useAppContext from '../../context/useAppContext.ts';
import {ContentBox, IconWrapper, Title, TitleWrapper} from './styles.ts';
import {ContentBoxProps} from './types.ts';

const LandingPageContentBox = ({title, path, icon}: ContentBoxProps) => {
  const {
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();

  return (
    <ContentBox
      onClick={() => {
        navigate(path);
        breadcrumbs.add({name: title, to: path});
      }}>
      <TitleWrapper>
        <Title variant="bodyLarge" content={title} />
      </TitleWrapper>
      <IconWrapper>{icon}</IconWrapper>
    </ContentBox>
  );
};

export default LandingPageContentBox;
