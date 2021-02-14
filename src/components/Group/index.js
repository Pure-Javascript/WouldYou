import Button, { BUTTON_COLOR } from '../Button';
import { getUniqueId, setEventListener, showModal } from '../common';
import Icon from '../Icon';
import Place from '../Place';
import GroupList from './GroupList';
import './style.scss';

const Group = ({ group, onClickTitle, onSelectPlace }) => {
  const { id, name, places = [] } = group;
  const dataKey = getUniqueId();
  setEventListener({
    dataKey,
    onClick: (event) => {
      const { target } = event;
      const $groupTitle = target.closest('.group-title');
      if ($groupTitle) {
        onClickTitle(event);
        return;
      }
    },
  });

  const onClickPlace = ({ target }) => {
    const { dataset: { id: placeId } } = target;
    togglePlaceSelected({ $el: target });
    const place = group.places.find(({ id }) => id === Number(placeId));
    onSelectPlace && onSelectPlace({ place });
  };

  return `
    <div class="group" data-key="${dataKey}" data-id="${id}">
      <div class="group-title d-flex justify-content-between align-items-center">
        ${name}
        <div>
          ${Button({
            content: Icon.plus(),
            className: 'add-group-button',
            color: BUTTON_COLOR.LINK,
            onClick: ({ target }) => {
              showModal({ target: target.closest('button'), modalSelector: '.group-list__add-place-modal' });
            },
          })}
          <span class="badge bg-primary rounded-pill">${places.length}</span>
        </div>
      </div>
      <ul class="place-list list-group ${places.length ? '' : 'place-list--hide' }">
        ${places.map((place, index) => `<li class="place-item list-group-item" data-index="${index}">${Place({ place, onClick: onClickPlace })}</li>`).join('')}
      </ul>
    </div>
  `;
}

const togglePlaceSelected = ({ $el }) => {
  const placeElements = $el.closest('.group').querySelectorAll('.place');
  for (const $place of placeElements) {
    $place.classList[$place === $el ? 'add' : 'remove']('place--is-selected');
  }
};

Group.List = GroupList(Group);

export default Group;
