import {IconProps} from '@oykos-development/devkit-react-ts-styled-components';

const ChevronIcon = ({fill, style}: IconProps) => {
  return (
    <svg
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24">
      <path d="M6 9L12 15 18 9" stroke={fill} fill="transparent"></path>
    </svg>
  );
};

export default ChevronIcon;
