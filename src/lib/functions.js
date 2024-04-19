const convertTemp = (temp) => {
  const tempConvert = Math.round((temp - 32) * (5 / 9));
  return Object.is(tempConvert, -0) ? 0 : tempConvert;
};

function getCardinals(deg) {
  let direction = 'direction';

  const cardinals = {
    North: [0, 349, 11, 361],
    'North-North-East': [11, 34],
    'North-East': [34, 56],
    'East-North-East': [56, 79],
    East: [79, 101],
    'East-south-East': [101, 124],
    'south-East': [124, 146],
    'south-south-East': [146, 169],
    South: [169, 191],
    'south-south-West': [191, 214],
    'south-West': [214, 236],
    'West-south-West': [236, 259],
    West: [259, 281],
    'West-North-West': [281, 304],
    'North-West': [304, 326],
    'North-North-West': [326, 349],
  };

  const cardinalDirections = Object.keys(cardinals);

  cardinalDirections.forEach((key) => {
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
    'a light breeze': [3.01, 7],
    'a gentle breeze': [7.01, 12],
    'a moderate breeze': [12.01, 18],
    'a fresh breeze': [18.01, 24],
    'a strong breeze': [24.01, 31],
    'high wind': [31.01, 38],
    'a gale force wind': [38.01, 46],
    'a strong gale': [46.01, 54],
    'storm winds': [54.01, 63],
    'a violent storm': [63.01, 72],
    'a hurricane': [72.01, 200],
  };

  const windDescriptions = Object.keys(windDesc);
  let wind = 'wind';
  windDescriptions.forEach((key) => {
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
