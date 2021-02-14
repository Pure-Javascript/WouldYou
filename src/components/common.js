export const onRender = (callback) => {
  (async () => {
    await new Promise((resolve) => resolve());
    callback();
  })();
}

export const setEventListener = ({ dataKey, onClick }) => {
  onRender(() => {
    document.querySelector(`[data-key="${dataKey}"]`).onclick = onClick;
  })
};

export const showModal = ({ target: $target, modalSelector }) => {
  const { dataset } = $target;
  if (dataset.bsToggle && dataset.bsTarget) {
    return;
  }
  dataset.bsToggle = 'modal';
  dataset.bsTarget = modalSelector;
  $target.click();
};

export const getUniqueId = () => {
  return Date.now() + Math.floor(Math.random() * 1000000);
}


export const getHypotenuse = ({ x, y }) => x / Math.sin(Math.atan(x / y));
