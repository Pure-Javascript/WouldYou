import { firebaseInstatnce, authService } from '../../firebase';
import Button, { BUTTON_COLOR, BUTTON_TYPE } from '../Button';
import Modal from '../Modal';

/*
 *
 * 매번 컴포넌트 실행시마다 새로 정의할 필요가 없는 함수는 밖으로 뺸다
 * 
 */

// 구글 로그인
const authInGoogle = () => {
  const provider = new firebaseInstatnce.auth.GoogleAuthProvider();
  authService.signInWithPopup(provider);
}

// 이메일 유효성 검사
const emailRegExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
const checkEmailValidation = ({ email }) => emailRegExp.test(email);

// 비밀번호 유효성 검사 6 ~ 10자 영문, 숫자 조합
const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,10}$/;
const checkPasswordValidation = ({ password }) => passwordRegExp.test(password);


/*
 *
 * 모달과 디렉토리 이름: 네이밍 컨벤션을 맞추기 위해 AuthModal로 수정함
 * 
 */
const AuthModal = ({ id, className, isSignIn }) => {
  const formClassName = isSignIn ? 'auth-form--login' : 'auth-form--signup';

  // 폼에 있는 이메일과 패스워드를 반환한다
  const getFormData = () => {
    const $modal = document.getElementById(id);
    // form 태그에서 이렇게 바로 접근할 수 있는지 몰랐네요 감사합니다!
    const {email: { value: email }, password: { value: password }} = $modal.querySelector(`.${formClassName}`);
    return {email, password};
  };

  // 모달을 닫고 인풋창을 초기화해준다(향후 초기화 로직은 따로 분리해서 사용하는것도 괜찮을듯).
  const closeModal = () => {
    const $modal = document.getElementById(id);
    const $form = $modal.querySelector(`.${formClassName}`);
    $form.email.value = '';
    $form.password.value = '';
    $modal.querySelector('.btn-close').click();
  }

  /*
   *
   * 로그인과 회원가입 함수를 분리한다.
   * 둘은 전혀 다른 로직이기때문에. 중복되는 로직은 함수로 빼서 재사용한다.
   * 
   */

  // 로그인
  const signIn = (event) => {
    event.preventDefault();
    const { email, password } = getFormData();
    if (!checkEmailValidation({ email }) || !checkPasswordValidation({ password })) {
      alert('이메일 또는 비밀번호 형식이 맞지 않습니다.');
      return;
    }
    authService.signInWithEmailAndPassword(email, password).then(() => {
      alert('로그인완료');
      closeModal();
    });
  };
  
  // 회원가입
  const signUp = (event) => {
    event.preventDefault();
    const { email, password } = getFormData();
    console.log(checkEmailValidation({ email }), checkPasswordValidation({ password }));
    if (!checkEmailValidation({ email }) || !checkPasswordValidation({ password })) {
      alert('이메일 또는 비밀번호 형식이 맞지 않습니다.');
      return;
    }
    authService.createUserWithEmailAndPassword(email, password).then(() => {
      alert('회원가입완료');
      closeModal();  
    });
  };

  return (Modal({
    id, className: `auth-modal ${className}`,
    title: isSignIn ? '로그인' : '회원가입',
    body: `
      <form class="${formClassName}">
        <input class="form-control mb-2" name="email" type="email" placeholder="이메일 주소" value='' required />
        <input class="form-control mb-2" name="password" type="password" placeholder="비밀번호${isSignIn ? '' : '(6 ~ 10자 영문, 숫자 조합)' }" value='' minlength="6" maxlength="10" required />
        ${Button({
          className: 'w-100',
          color: BUTTON_COLOR.BLUE,
          content: `${isSignIn ? '로그인' : '회원가입'}`,
          type: BUTTON_TYPE.SUBMIT,
          onClick: isSignIn ? signIn : signUp,
        })}
      </form>
      <hr />
      <div>
        ${Button({
          className: 'w-100',
          color: BUTTON_COLOR.BLUE,
          content: `Google 계정으로 ${isSignIn ? '로그인' : '회원가입'} 하기`,
          onClick: authInGoogle,
        })}
      </div>
    `,
  }));
};

export default AuthModal;

