import Button, { BUTTON_COLOR } from '../Button';
import { showModal } from '../common';
import AuthModal from './AuthModal';

const Header = ({ className = '' } = {}) => {
  let newAccount = null;

  return `
    <header class=${className}>
    ${AuthModal(newAccount)}
      <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="/"></a>
          <div class="d-flex header__right">
            ${Button({
              className: 'header__signin',
              color: BUTTON_COLOR.YELLOW,
              content: '로그인',
              onClick: ({ target }) => {
                showModal({ target: target.closest('button'), modalSelector: '.signin-modal' });
                newAccount = false;
              },
             })}
             ${Button({
              className: 'header__signup',
              color: BUTTON_COLOR.BLUE,
              content: '회원가입',
              borderType: 'outline',
              onClick: ({ target }) => {
                showModal({ target: target.closest('button'), modalSelector: '.signup-modal' });
                newAccount = true;
              },
             })}
          </div>
        </div>
      </nav>
    </header>
  `;
};

export default Header;
