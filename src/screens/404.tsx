import {ReactElement} from 'react';
import styled from 'styled-components';
import {Button, Typography} from 'client-library';
import useAppContext from '../context/useAppContext.ts';

const Container = styled.div<{children: ReactElement | ReactElement[]}>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
  width: 100%;
  height: 100%;
  padding: 50px;
`;

const TextCenter = styled(Typography)`
  text-align: center;
`;

export const NotFound404 = () => {
  const {
    navigation: {navigate},
  } = useAppContext();
  return (
    <Container id="not-found-404">
      <TextCenter content="Oops! 404 not found" variant={'h1'} />
      <TextCenter
        content="Looks like you've wandered off the beaten path and landed in the land of lost web pages. Don't worry, we've sent out a search party to retrieve the missing page and bring it back to its rightful place. In the meantime, why not take a breather and enjoy the view? We hear the pixels in this neck of the woods are particularly vibrant."
        variant="bodyMedium"
      />
      <Button content="Go back" onClick={() => navigate('/')} />
      {/*TODO remove after testing*/}
      <Typography
        content="Remove buttons below after correct routing has been set for those pages"
        variant="bodyMedium"
        style={{color: 'red'}}
      />
      <Button
        variant={'secondary'}
        style={{width: 170}}
        content="Non finance page"
        onClick={() => navigate('/finance/budget/nonFinance')}
      />
      <Button
        variant={'secondary'}
        style={{width: 170}}
        content="Non finance page preview (sluzbenik)"
        onClick={() => navigate('/finance/budget/nonFinancePreview/non-financial ')}
      />
      <Button
        variant={'secondary'}
        style={{width: 170}}
        content="Budget template"
        onClick={() => navigate('/finance/budget-template')}
      />
      <Button
        variant={'secondary'}
        style={{width: 170}}
        content="Budget FO"
        onClick={() => navigate('/finance/budgetFO/2023/')}
      />
    </Container>
  );
};
