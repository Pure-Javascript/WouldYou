import Button, { BUTTON_COLOR, BUTTON_TYPE } from '../Button';
import { firebaseInstatnce, authService } from '../../firebase';
import Modal from '../Modal';
// import { getUniqueId, onRender } from '../common';

const AuthModal = (newAccount) => {
  const onSocialClick = () => {
    const provider = new firebaseInstatnce.auth.GoogleAuthProvider();
    authService.signInWithPopup(provider);
  };

  const onAuthValid = ((e) => {
    e.preventDefault();

    const myModal = document.getElementById(`${id}`);
    const authForm = newAccount ? document.querySelector('.auth-form-login') : document.querySelector('.auth-form-signup');
    const email = authForm.email.value;
    const password = authForm.password.value;

    const emailRegExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const emailValid = emailRegExp.test(email);

    const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,10}$/;
    const passwordValid = passwordRegExp.test(password);
    //  6 ~ 10자 영문, 숫자 조합

    if (!emailValid || !passwordValid) {
      alert('이메일 또는 비밀번호 형식이 맞지 않습니다.');
      return;
    }

    try {
      let data;
      if (newAccount) {
        //회원가입
        data = authService.createUserWithEmailAndPassword(email, password).then(() => {
          myModal.querySelector('.btn-close').click();
          alert('회원가입완료');
          authForm.email.value = '';
          authForm.password.value = '';
        });
      } else {
        //로그인
        data = authService.signInWithEmailAndPassword(email, password).then(() => {
          myModal.querySelector('.btn-close').click();
          alert('로그인완료');
          authForm.email.value = '';
          authForm.password.value = '';
        });
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }

  })
  return Modal({
    title: `${newAccount ? '회원가입' : '로그인'}`,
    className: `${newAccount ? 'signup-modal' : 'signin-modal'}`,
    headerClassName: `${newAccount ? 'signup-modal' : 'signin-modal'}`,
    body: `
    <form class="auth-form-${newAccount ? 'login' : 'signup'}">
    <input class="form-control mb-2" name="email" type="email" placeholder="이메일 주소" value='' required />
    <input class="form-control mb-2" name="password" type="password" placeholder="비밀번호${newAccount ? '(6 ~ 10자 영문, 숫자 조합)' : ''}" value='' minlength="6" maxlength="10" required />
    ${Button({
      className: 'w-100',
      color: BUTTON_COLOR.BLUE,
      content: `${newAccount ? '회원가입' : '로그인'}`,
      type: BUTTON_TYPE.SUBMIT,
      onClick: onAuthValid,
    })}
  </form>
  <hr />
  <div>
    ${Button({
      className: 'w-100',
      color: BUTTON_COLOR.BLUE,
      content: `Google 계정으로 ${newAccount ? '회원가입' : '로그인'} 하기`,
      onClick: onSocialClick,
    })}
  </div>
    `
  })
}

export default AuthModal;
