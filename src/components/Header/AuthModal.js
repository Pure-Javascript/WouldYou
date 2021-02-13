import Button, { BUTTON_COLOR, BUTTON_TYPE } from '../Button';
import { firebaseInstatnce, authService } from '../../firebase';
import Modal from '../Modal';

// 이메일 유효성 검사
const emailValid = (email) => {
  const emailRegExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  return emailRegExp.test(email);
}

// 비밀번호 유효성 검사 6 ~ 10자 영문, 숫자 조합
const passwordValid = (password) => {
  const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,10}$/;
  return passwordRegExp.test(password);
}

const AuthModal = ({ id, newAccount }) => {
  const formClassName = newAccount ? 'auth-form--signup' : 'auth-form--login';

  // 구글 로그인
  const onSocialAuth = () => {
    const provider = new firebaseInstatnce.auth.GoogleAuthProvider();
    authService.signInWithPopup(provider).then((result) => {
      console.log(result.user);
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });
  };

  // 이메일, 비밀번호 데이터
  const getFormData = (() => {
    const $modal = document.getElementById(id);
    const {email: { value: email }, password: { value: password }} = $modal.querySelector(`.${formClassName}`);
    return {email, password};
  });

  // 로그인
  const signIn = ((e) => {
    e.preventDefault();

    authService.signInWithEmailAndPassword(email, password).then((user) => {
      alert('로그인완료');
      resetForm();
      console.log(user);
      //로그인 이후 LocalStorage에다가 넣어야할까요?
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });
  });

  // 회원가입
  const signUp = ((e) => {
    e.preventDefault();

    const { email, password } = getFormData();
    if (!emailValid(email) || !passwordValid(password)) {
      alert('이메일 또는 비밀번호 형식이 맞지 않습니다.');
      return;
    }

    authService.createUserWithEmailAndPassword(email, password).then((user) => {
      alert('회원가입완료');
      console.log(user);
      resetForm();
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });

  });

  // 초기화
  const resetForm = (() => {
    const $modal = document.getElementById(id);
    const $form = $modal.querySelector(`.${formClassName}`);
    $modal.querySelector('.btn-close').click();
    $form.email.value = '';
    $form.password.value = '';
  });

  return Modal({
    title: newAccount ? '회원가입' : '로그인',
    className: id,
    id: id,
    body: `
    <form class="${formClassName}">
      <input class="form-control mb-2" name="email" type="email" placeholder="이메일 주소" value='' required />
      <input class="form-control mb-2" name="password" type="password" placeholder="비밀번호${newAccount ? '(6 ~ 10자 영문, 숫자 조합)' : ''}" value='' minlength="6" maxlength="10" required />
      ${Button({
        className: 'w-100',
        color: BUTTON_COLOR.BLUE,
        content: `${newAccount ? '회원가입' : '로그인'}`,
        type: BUTTON_TYPE.SUBMIT,
        onClick: newAccount ? signUp : signIn,
      })}
    </form>
    <hr />
    <div>
      ${Button({
        className: 'w-100',
        color: BUTTON_COLOR.BLUE,
        content: `Google 계정으로 ${newAccount ? '회원가입' : '로그인'}하기`,
        onClick: onSocialAuth,
      })}
    </div>
    `
  })
}

export default AuthModal;
