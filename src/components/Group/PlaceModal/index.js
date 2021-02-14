import Button from '../../Button';
import Map, { moveMap } from '../../Map';
import Modal from '../../Modal';
import { getUniqueId, onRender } from '../../common';
import './style.scss';

const PlaceModal = ({ title, className = '', headerClassName = '', onOk, onCancel }) => {
  const dataKey = getUniqueId();
  const mapId = `place-modal--${getUniqueId()}`;
  
  const place = {};
  let $root;

  onRender(() => {
    $root = document.querySelector(`[data-key="${dataKey}"]`);
    const $infoForm = $root.querySelector('.place-modal__info-form');
    const $addressForm = $root.querySelector('.place-modal__address-form');
    
    $infoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const { name: { value: placeName } } = $infoForm;

      if (!place.address) {
        $addressForm.querySelector('button[type="submit"]').click();
        return;
      }
      
      onOk && onOk({
        place: {
          id: getUniqueId(),
          name: placeName,
          x: place.x,
          y: place.y,
          address: place.address,
        }
      });
      document.querySelector('.modal-backdrop').remove();
    });
  
    $addressForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const { address: { value = '' } } = $addressForm;
      Map.searchAddress({
        address: value,
        onSearch: ({ roadAddress, x, y }) => {
          place.marker?.setMap(null);
          const map = globalThis.maps[mapId];
          moveMap({ map, x, y });

          place.marker = new naver.maps.Marker({
            map,
            position: new naver.maps.LatLng(y, x),
            zoom: 15
          });
          place.x = Number(x);
          place.y = Number(y);
          place.address = roadAddress;
        }
      })
    });
  });

  return Modal({
    title,
    className: `place-modal ${className}`,
    headerClassName: `place-modal ${headerClassName}`,
    body: `
      <div class="place-modal" data-key="${dataKey}">
        <form class="place-modal__info-form needs-validation">
          <div class="row">
            <div class="col-md-12">
              <label for="name" class="form-label">장소 이름</label>
              <input type="text" class="form-control place-modal__name" id="name" required>
              <div class="valid-feedback">
                이름을 입력해주세요!
              </div>
            </div>
          </div>
          <button class="hide" type="submit"></button>
        </form>
        <form class="place-modal__address-form needs-validation">
          <div class="row">
            <div class="col-md-9">
              <label for="address" class="form-label">장소 이름</label>
              <input type="text" class="form-control place-modal__address" id="address" required>
              <div class="valid-feedback">
                주소를 입력해주세요!
              </div>
            </div>
            <div class="col-md-3 address-form__submit-column">
              ${Button({
                className: 'btn address-form__submit',
                type: 'submit',
                content: '검색',
              })}
            </div>
          </div>
          ${Map({ id: mapId, width: '460px', height: '40vh' })}
        </form>
      </div>
    `,
    onOk: () => {
      $root.querySelector('.place-modal__info-form button[type="submit"]').click();
    },
    onCancel: () => {
      $root.querySelectorAll('input').forEach($input => {
        $input.value = '';
        onCancel && onCancel();
      });
    },
  });
};


export default PlaceModal;
