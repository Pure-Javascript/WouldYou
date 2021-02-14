import { getUniqueId, setEventListener } from '../common';
import './style.scss';

const Place = ({ place: { id, name, address, groupId, x, y }, onClick }) => {
  const dataKey = getUniqueId();
  setEventListener({
    dataKey,
    onClick: (event) => {
      onClick && onClick(event);
    }
  })
  return `
    <div class="place" data-key="${dataKey}" data-id="${id}">
      ${name}
    </div>
  `;
};

export default Place;
