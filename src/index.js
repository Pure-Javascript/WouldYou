import { authService, databaseService } from './firebase';
import Header from './components/Header';
import Map, { moveMap } from './components/Map';
import Group from './components/Group';
import { getHypotenuse, onRender } from './components/common';
import './style.scss';

const mapId = 'main';
const getMap = () => globalThis.maps[mapId];

const { List: GroupList } = Group;

const postGroup = ({ group }) => {
  databaseService.ref(`groups/${group.id}`).set(group);
}

const moveMapToGroup = ({ group = {}}) => {
  const { places = [] } = group;
  const { length: placesLength } = places;
  if (!placesLength ) {
    return;
  }
  if (placesLength === 1) {
    moveMapToPlace({ place: places[0]});
    return;
  }
  
  const map = getMap();
  const { xSum, xMin, xMax, ySum, yMin, yMax } = places.reduce(({ xSum, xMin, xMax, ySum, yMin, yMax}, { x, y }) => ({
    xSum: xSum + x,
    xMin: xMin < x ? xMin : x,
    xMax: xMax > x ? xMax : x,
    ySum: ySum + y,
    yMin: yMin < y ? xMin : y,
    yMax: yMax > y ? xMax : y,
  }), {xSum: 0, xMin: 180, xMax: -180, ySum: 0, yMin: 180, yMax: -180 });
  const xDistance = xMax - xMin, yDistance = yMax - yMin;
  if ( !xDistance || !yDistance) {
    return;
  }
  const hypotenuse = getHypotenuse({ x: xDistance, y: yDistance });
  const zoom = 19 - parseInt(Math.sqrt(hypotenuse));
  map.setZoom(zoom, true);
  moveMap({ map, x: xSum / placesLength, y: ySum / placesLength });
}

const moveMapToPlace = ({ place }) => {
  const { x, y } = place;
  const map = getMap();
  map.setZoom(15, true);
  moveMap({ map, x: Number(x), y: Number(y) });
}

const postPlace = ({ place }) => {
  databaseService.ref(`places/${place.id}`).set(place);
}

window.onload = () => {
  const $root = document.querySelector('#root');

  databaseService.ref('groups').on('value', (response) => {
    const groups = response.val() || [];
    databaseService.ref('places').on('value', (response) => {
      const places = response.val() || [];
      for (const placeId of Object.keys(places)) {
        const place = places[parseInt(placeId)];
        const { x, y, groupId } = place;
        if (!x || !y) {
          continue;
        }
        new naver.maps.Marker({
          position: new naver.maps.LatLng(Number(y), Number(x)),
          map: globalThis.maps[mapId],
          zoom: 15
        });

        if (groups[groupId].places) {
          groups[groupId].places.push(place);
        } else {
          groups[groupId].places = [place];
        }
      }

      const $grouopListContainer = document.querySelector('.group-list-container');
      $grouopListContainer.innerHTML = GroupList({
        groups,
        onAddGroup: postGroup,
        onSelectGroup: moveMapToGroup,
        onAddPlace: postPlace,
        onSelectPlace: moveMapToPlace,
      });
    });
  });

  $root.innerHTML = `
    ${Header({ className: 'header' })}
    <div class="content">
      <div class="flex-row">
        ${Map({ id: mapId, width: '70%', height: '80vh' })}
        <div class="group-list-container"></div>
      </div>
    </div>
  `;
};
