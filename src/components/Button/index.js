import { setEventListener } from '../common';

export const BUTTON_COLOR = {
  BLUE: 'primary',
  GRAY: 'secondary',
  GREEN: 'success',
  RED: 'danger',
  YELLOW: 'warning',
  SKY_BLUE: 'info',
  WHITE: 'light',
  BLACK: 'dark',
  LINK: 'link',
};

export const BUTTON_BORDER_TYPE = {
  OUTLINE: 'outline',
};

export const BUTTON_TYPE = {
  BUTTON: 'button',
};

const getButtonTheme = (...args) => {
  const buttonThemes = ['btn', ...args].filter(Boolean);
  return buttonThemes.join('-');
};

const randomID = () => {
  let randomID = Math.floor(Math.random() * 1000000) + 100000;
  if (randomID > 1000000) {
    randomID = randomID - 100000;
  }

  return randomID;
}
const Button = ({
  id,
  className,
  content = '',
  type = BUTTON_TYPE.BUTTON,
  color = BUTTON_COLOR.BLUE,
  borderType = BUTTON_BORDER_TYPE.SOLID,
  onClick,
} = {}) => {
  const dataKey = randomID();

  setEventListener({ dataKey, onClick });
  const buttonTheme = getButtonTheme(borderType, color);
  return `
    <button
      data-key=${dataKey}
      ${id ? `id=${id}` : ''}
      class="btn ${buttonTheme} ${className || ''}"
      type=${type}>
      ${content}
    </button>
  `;
};

export default Button;
