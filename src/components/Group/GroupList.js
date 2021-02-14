import Button, { BUTTON_COLOR } from '../Button';
import Icon from '../Icon';
import { showModal } from '../common';
import AddGroupModal from './AddGroupModal';
import PlaceModal from './PlaceModal';
import Card from '../Card';

const GroupList = (Group) => ({ groups, onAddGroup, onSelectGroup, onAddPlace, onSelectPlace }) => {
  const validGrouplist = Object.entries(groups).filter(([_id, group]) => group?.id).map(([_id, group]) => group);

  const onClickGroupTitle = ({ target }) => {
    const $group = target.closest('.group');
    toggleGroupSelected({ $el: $group });
    onSelectGroup && onSelectGroup({ group: groups[$group.dataset.id]});
    document.querySelector('.place.place--is-selected')?.classList.remove('place--is-selected');
  }
  
  const groupElements = validGrouplist.map((group) =>`
    <li class="group-item list-group-item">
      ${Group({ group, onClickTitle: onClickGroupTitle, onSelectPlace })}
    </li>
  `).join('');

  return `
    <div class="group-list">
      ${AddGroupModal({ onOk: onAddGroup })}
      ${PlaceModal({
        title: '장소 추가',
        className: 'group-list__add-place-modal',
        onOk: async ({ place }) => { 
          await onAddPlace({
            place: {
              groupId: Number(document.querySelector('.group--is-selected').dataset.id),
              ...place,
            }
          });
          alert('장소를 추가했습니다');
        },
      })}
      ${ Card({ title: getCardTitle(), className: 'group-list__card', content: groupElements })}
    </div>
  `
}

const toggleGroupSelected = ({ $el }) => {
  const groupElements = $el.closest('.group-list').querySelectorAll('.group');
  for (const $group of groupElements) {
    $group.classList[$group === $el ? 'add' : 'remove']('group--is-selected');
  }
};

const getCardTitle = () => `
  <div class="flex-row group-list__title">
    <span class="card-title">
      그룹
    </span>
    <div class="right">
      ${Button({
        content: Icon.plus(),
        className: 'add-group-button',
        color: BUTTON_COLOR.LINK,
        onClick: ({ target }) => {
          showModal({ target: target.closest('button'), modalSelector: '.group-list__add-group-modal' });
        },
      })}
    </div>
  </div>
`;

export default GroupList;
