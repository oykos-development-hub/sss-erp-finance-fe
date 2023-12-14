import {ReactElement, ReactNode} from 'react';
import useAppContext from '../../context/useAppContext.ts';
import {Container, StyledBreadcrumbs} from './styles.ts';

const ScreenWrapper = ({children}: {children: ReactNode}) => {
  const {
    breadcrumbs,
    navigation: {navigate},
  } = useAppContext();

  const breadcrumbItems = breadcrumbs?.get();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined,
    item?: {
      name: string;
      to: string;
      icon?: ReactElement;
    },
  ) => {
    e?.preventDefault();
    const newBreacrumbs = [...breadcrumbItems];
    const index = newBreacrumbs.findIndex((breadcrumb: any) => breadcrumb.name === item?.name);
    newBreacrumbs.splice(index + 1, newBreacrumbs.length - index);
    breadcrumbs.set(newBreacrumbs);
    navigate(item?.to);
  };

  return (
    <Container>
      <StyledBreadcrumbs items={breadcrumbItems} onClick={handleNavigation} />
      {children}
    </Container>
  );
};

export default ScreenWrapper;
