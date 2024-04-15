const convertTemp = (temp) => {
  const tempConvert = Math.round((temp - 32) * (5 / 9));
  return Object.is(tempConvert, -0) ? 0 : tempConvert;
};

function getCardinals(deg) {
  let direction = 'direction';

  const cardinals = {
    north: [0, 349, 11, 361],
    'north-north-east': [11, 34],
    'north-east': [34, 56],
    'east-north-east': [56, 79],
    east: [79, 101],
    'east-south-east': [101, 124],
    'south-east': [124, 146],
    'south-south-east': [146, 169],
    south: [169, 191],
    'south-south-west': [191, 214],
    'south-west': [214, 236],
    'west-south-west': [236, 259],
    west: [259, 281],
    'west-north-west': [281, 304],
    'north-west': [304, 326],
    'north-north-west': [326, 349],
  };

  const keys = Object.keys(cardinals);

  keys.forEach((key) => {
    const [min1, max1, min2 = 0, max2 = 0] = cardinals[key];
    if ((deg >= min1 && deg < max1) || (min2 !== 0 && deg >= min2 && deg < max2)) {
      direction = key;
    }
  });

  return direction;
}

function getWind(windSpeed) {
  const windDesc = {
    'a calm breeze': [0, 0],
    'light air': [1, 3],
    'a light breeze': [4, 7],
    'a gentle breeze': [8, 12],
    'a moderate breeze': [13, 18],
    'a fresh breeze': [19, 24],
    'a strong breeze': [25, 31],
    'high wind': [32, 38],
    'a gale force wind': [39, 46],
    'a strong gale': [47, 54],
    'storm winds': [55, 63],
    'a violent storm': [64, 72],
    'a hurricane': [73, 200],
  };

  const keys = Object.keys(windDesc);
  let wind = 'wind';
  keys.forEach((key) => {
    const [min, max] = windDesc[key];
    if (windSpeed >= min && windSpeed <= max) {
      wind = key;
    }
  });

  return wind;
}

function toUpper(word) {
  if (typeof word.charAt === 'function') {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  return word;
}

const getLongDate = (date, timezone) => {
  const newDate = new Date(date * 1000);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone,
  }).format(newDate);
};

const getAlertDate = (date, timezone) => {
  const newDate = new Date(date * 1000);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone,
  }).format(newDate);
};

const getShortDate = (date, timezone) => {
  const newDate = new Date(date * 1000);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: timezone,
  }).format(newDate);
};

const getTime = (date, timezone) => {
  const newDate = new Date(date * 1000);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone,
  }).format(newDate);
};

const getShortTime = (date, timezone) => {
  const newDate = new Date(date * 1000);
  return new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone,
  }).format(newDate);
};

const getDay = (date, timezone) => {
  const newDate = new Date(date * 1000);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    timeZone: timezone,
  }).format(newDate);
};

const getUTime = () => {
  const date = new Date();
  return date.toLocaleTimeString('en-GB');
};

const smoothScrollIntoView = (element) => {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest',
  });
};

function showHiddenElement(element, thisElem, openElem, styles) {
  const elem = openElem;
  element.classList.add(styles['show-hidden-elem']);
  thisElem.classList.add(styles['elem-selected']);
  elem.innerHTML = '&lt;';
}

function hideHiddenElement(element, styles, previousState) {
  const prevState = previousState;
  element.classList.remove(styles['show-hidden-elem']);
  prevState.thisElem.classList.remove(styles['elem-selected']);
  prevState.hiddenElem.innerHTML = '&gt;';
}

function handleClick(
  e,
  i,
  hiddenElemSections,
  openHiddenElem,
  previousState,
  setPreviousState,
  styles,
) {
  const hiddenId = hiddenElemSections.current[i];
  const thisElem = e.target.closest('section');
  const openElem = openHiddenElem.current[i];
  if (hiddenId === previousState.thisId) {
    if (hiddenId.classList.contains(styles['show-hidden-elem'])) {
      hideHiddenElement(hiddenId, styles, previousState);
    } else {
      showHiddenElement(hiddenId, thisElem, openElem, styles);
    }
  } else {
    showHiddenElement(hiddenId, thisElem, openElem, styles);
    if (previousState.thisId !== null) {
      hideHiddenElement(previousState.thisId, styles, previousState);
    }
  }

  smoothScrollIntoView(thisElem);
  smoothScrollIntoView(hiddenId);

  setPreviousState((prevState) => ({
    ...prevState,
    thisId: hiddenId,
    thisElem,
    hiddenElem: openElem,
  }));
}

export {
  convertTemp,
  getCardinals,
  getWind,
  toUpper,
  getLongDate,
  getTime,
  getUTime,
  getShortDate,
  getShortTime,
  getAlertDate,
  getDay,
  smoothScrollIntoView,
  showHiddenElement,
  hideHiddenElement,
  handleClick,
};
