import styled, {css} from 'styled-components';

type FlexComponentProps = {
  gap?: number | string;
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  align?: 'start' | 'end' | 'center' | 'stretch';
  stretchChildren?: boolean;
};

// Styles

export const flexRow = css`
  display: flex;
  flex-direction: row;
`;

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const flexJustifyCenter = css`
  display: flex;
  justify-content: center;
`;

export const flexJustifyEnd = css`
  display: flex;
  justify-content: flex-end;
`;

export const flexJustifyBetween = css`
  display: flex;
  justify-content: space-between;
`;

export const flexAlignCenter = css`
  display: flex;
  align-items: center;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const flexColumnCenter = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// Components

const FlexComponent = styled.div`
  display: flex;
`;

const flexComponentStyles = (props: FlexComponentProps) => css`
  gap: ${typeof props.gap === 'string' ? props.gap : `${props.gap}px`};
  justify-content: ${props.justify || 'start'};
  align-items: ${props.align || 'start'};

  & > * {
    flex: ${props.stretchChildren ? 1 : 'none'};
  }
`;

export const FlexRow = styled(FlexComponent)<FlexComponentProps>`
  flex-direction: row;
  ${flexComponentStyles}
`;

export const FlexColumn = styled(FlexComponent)<FlexComponentProps>`
  display: flex;
  flex-direction: column;
  ${flexComponentStyles}
`;
