import Button, { BUTTON_COLOR } from '../Button';
import Modal from '../Modal';
import Icon from '../Icon';
import { showModal } from '../common';
import { databaseService } from '../../firebase';
import AddGroupModal from './AddGroupModal';
import AddPlaceModal from './AddPlaceModal';
import Card from '../Card';

const toggleFolding = ({ $el }) => {
  const groupElements = $el.closest('.group-list').querySelectorAll('.group');
  for (const $group of groupElements) {
    $group.classList[$group === $el ? 'add' : 'remove']('active');
  }
};

const onClickGroupTitle = ({ $el }) => {
  toggleFolding({ $el: $el.closest('.group') });
}

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

const GroupList = (Group) => ({ groups, onAddGroup, onAddPlace }) => {
  const validGrouplist = Object.entries(groups).filter(([_id, group]) => group?.id).map(([_id, group]) => group);
  const groupElements = validGrouplist.map((group) => Group({ ...group, onClickTitle: onClickGroupTitle })).join('');

  return `
    <div class="group-list">
      ${AddGroupModal({ onOk: onAddGroup })}
      ${AddPlaceModal({
        onOk: ({ place }) => { 
          onAddPlace({
            place: {
              groupId: document.querySelector('.list-group-item.active').dataset.id,
              ...place,
            }
          });
        },
      })
      }
      <ul class="group-list list-group">
        ${ Card({ title: getCardTitle(), className: 'group-list__card', content: groupElements })}
      </ul>
    </div>
  `
}

export default GroupList;
