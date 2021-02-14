import Button, { BUTTON_COLOR } from '../Button';

const Modal = ({
  id,
  title = '',
  body = '',
  className = '',
  headerClassName = '',
  okText = '확인',
  cancleText = '취소',
  onOk = () => { },
  onCancel = () => { },

} = {}) => {
  const onOkModal = (event) => {
    onOk(event);
  }

  const closeModal = (event) => {
    const { target } = event;
    new Promise(resolve => {
      onCancel(event);
      resolve();
    }).then(() => {
      target.closest('.modal').querySelector('.btn-close').click();
    });
  }

  return `
    <div class="modal fade ${className}" id="${id}" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header ${headerClassName}">
            <h5 class="modal-title" id="modalLabel">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${body}
          </div>
          <div class="modal-footer">
            ${Button({
              className: 'cancle__btn',
              color: BUTTON_COLOR.GRAY,
              content: cancleText,
              onClick: closeModal,
            })}
            ${Button({
              className: 'confirm__btn',
              color: BUTTON_COLOR.BLUE,
              content: okText,
              onClick: onOkModal,
            })}
          </div>
        </div>
      </div>
    </div>
  `;
};

export default Modal;

