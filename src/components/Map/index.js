import { onRender } from '../common';


const DEFAULT_MAP_OPTIONS = {
  center: new naver.maps.LatLng(37.5666805, 126.9784147),
  zoom: 15,
  mapTypeId: naver.maps.MapTypeId.NORMAL,
};

const Map = ({
  id = 'map',
  width = '100vw',
  height = '80vh',
  options = DEFAULT_MAP_OPTIONS,
} = {
    id: 'map',
    width: '100vw',
    height: '80vh',
    options: DEFAULT_MAP_OPTIONS,
  }) => {
  onRender(() => {
    const map = new naver.maps.Map(id, options);
    if (globalThis.maps) {
      globalThis.maps[id] = map;
      return;
    }
    globalThis.maps = { [id]: map };
  });

  return `<div id="${id}" style="width:${width};height:${height};"></div>`;
}

Map.searchAddress = ({ address, onSearch }) => {
  naver.maps.Service.geocode(
    { query: address },
    (status, response) => {
      if (status === naver.maps.Service.Status.ERROR) {
        return alert('시스템 에러');
      };
      const { v2: { meta, addresses } } = response;
      if (meta.totalCount === 0) {
        return alert('검색 결과가 없습니다.');
      }
      onSearch(addresses[0]);
    }
  );
};


export const moveMap = ({ map, x, y }) => {
  if (!map || !x || !y) {
    return;
  }
  const position = new naver.maps.LatLng(y, x);
  map.panTo(position);
}

export default Map;
