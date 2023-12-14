import useAppContext from '../../context/useAppContext.ts';
import useTitle from '../../utils/useTitle.tsx';
import {TabsProps} from '@oykos-development/devkit-react-ts-styled-components';
import {ScreenTitle, TabsWrapper} from './styles.ts';
import {Tabs} from 'client-library';

const StyledTabsWithTitle = (props: TabsProps) => {
  const {
    navigation: {
      location: {pathname},
    },
  } = useAppContext();

  const title = useTitle(pathname);

  return (
    <TabsWrapper>
      <ScreenTitle content={title} />
      <Tabs {...props} />
    </TabsWrapper>
  );
};

export default StyledTabsWithTitle;
