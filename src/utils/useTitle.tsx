import {ScreenTitlesEnum} from '../constants';

const useTitle = (pathname: string) => {
  const splitPathname = pathname.split('/').pop() as keyof typeof ScreenTitlesEnum;
  return ScreenTitlesEnum[splitPathname];
};

export default useTitle;
