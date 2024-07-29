// convertTemp function takes a temperature value in Fahrenheit as an argument
// and returns the equivalent temperature in Celsius after rounding it to the nearest integer
const convertTemp = (temp) => {
  // convert Fahrenheit to Celsius using the formula: (Fahrenheit - 32) * 5/9
  const tempConvert = Math.round((temp - 32) * (5 / 9));
  // if the converted temperature is -0, return 0 instead
  return Object.is(tempConvert, -0) ? 0 : tempConvert;
};

// getCardinals function takes a degree value as an argument
// and returns the corresponding cardinal direction based on the degree value
function getCardinals(deg) {
  // define a variable to store the direction name
  let direction = 'direction';

  // define an object with cardinal directions and their corresponding degree ranges
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

  // define an array of cardinal direction keys
  const cardinalDirections = Object.keys(cardinals);

  // iterate through the cardinal directions and check if the degree value falls within the corresponding range
  cardinalDirections.forEach((key) => {
    const [min1, max1, min2 = 0, max2 = 0] = cardinals[key];
    if ((deg >= min1 && deg < max1) || (min2 !== 0 && deg >= min2 && deg < max2)) {
      // if the degree value falls within the range, set the direction name to the corresponding cardinal direction
      direction = key;
    }
  });

  // return the direction name
  return direction;
}

// getWind function takes a wind speed value as an argument
// and returns the corresponding wind description based on the wind speed value
function getWind(windSpeed) {
  // define an object with wind descriptions and their corresponding wind speed ranges
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
// define an array of wind description keys
// const windDescriptions = Object.keys(windDesc);
// define a variable to store the wind description
// let wind = 'wind';

// iterate through the wind descriptions and check if the wind speed value falls within the corresponding range
/* windDescriptions.forEach((key) => {
  const [min, max] = windDesc[key];
  if (windSpeed >= min && windSpeed <= max) {
    // if the wind speed value falls within the range, set the wind description to the corresponding wind description
    wind = key;
  }
  return wind;
}); */

// return the wind description

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
// toUpper function takes a string as an argument
// and returns the same string with the first character converted to uppercase

// getLongDate function takes a timestamp and timezone as arguments
// and returns a formatted date string in the format: "Weekday, Day Month Year Hour:Minute"

// getTime function takes a timestamp and timezone as arguments
// and returns a formatted time string in the format: "Weekday Hour:Minute"
const getTime = (date, timezone) => {
  // create a new Date object with the timestamp multiplied by 1000 (since JavaScript Date object uses milliseconds)
  const newDate = new Date(date * 1000);
  // return a formatted time string using the Intl.DateTimeFormat object
  // with the following options: weekday (short), hour (numeric), minute (numeric), timeZone (timezone)
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
// getUTime function returns the current time in the format: "Hour:Minute"
const getDay = (date, timezone) => {
  const newDate = new Date(date * 1000);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    timeZone: timezone,
  }).format(newDate);
};
const getUTime = () => {
  // create a new Date object with the current time
  const date = new Date();
  // return a formatted time string using the toLocaleTimeString method
  // with the following options: hour (2-digit), minute (2-digit)
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// smoothScrollIntoView function scrolls the specified element into view smoothly
const smoothScrollIntoView = (element) => {
  // use the scrollIntoView method with the following options: behavior (smooth), block (nearest), inline (nearest)
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest',
  });
};

// showHiddenElement function shows the specified hidden element and updates the UI
function showHiddenElement(element, thisElem, openElem, styles) {
  // add the "show-hidden-elem" class to the specified hidden element
  element.classList.add(styles['show-hidden-elem']);
  // add the "elem-selected" class to the current element
  thisElem.classList.add(styles['elem-selected']);
  // set the innerHTML of the open element to "<"
  // eslint-disable-next-line no-param-reassign
  openElem.innerHTML = '&lt;';
}

// hideHiddenElement function hides the specified hidden element and restores the UI
function hideHiddenElement(element, styles, previousState) {
  // create a variable to store the previous state
  const prevState = previousState;
  // remove the "show-hidden-elem" class from the specified hidden element
  element.classList.remove(styles['show-hidden-elem']);
  // remove the "elem-selected" class from the previous element
  prevState.thisElem.classList.remove(styles['elem-selected']);
  // set the innerHTML of the open element to ">"
  prevState.hiddenElem.innerHTML = '&gt;';
}

// handleClick function handles the click event for the specified element
// and toggles the visibility of the corresponding hidden element
function handleClick(
  e,
  i,
  hiddenElemSections,
  openHiddenElem,
  previousState,
  setPreviousState,
  styles,
) {
  // get the ID of the hidden element to be toggled
  const hiddenId = hiddenElemSections.current[i];
  // get the current element that was clicked
  const thisElem = e.target.closest('section');
  // get the open element that corresponds to the hidden element
  const openElem = openHiddenElem.current[i];

  // if the current hidden element is already visible
  if (hiddenId === previousState.thisId) {
    // toggle the visibility of the hidden element
    if (hiddenId.classList.contains(styles['show-hidden-elem'])) {
      hideHiddenElement(hiddenId, styles, previousState);
    } else {
      showHiddenElement(hiddenId, thisElem, openElem, styles);
    }
  } else {
    // if the current hidden element is not visible, show it and hide the previously visible hidden element
    showHiddenElement(hiddenId, thisElem, openElem, styles);
    // if there was a previously visible hidden element, hide it
    if (previousState.thisId !== null) {
      hideHiddenElement(previousState.thisId, styles, previousState);
    }
  }

  // smoothly scroll the current element and the hidden element into view
  smoothScrollIntoView(thisElem);
  smoothScrollIntoView(hiddenId);

  // update the previous state with the new hidden element and current element
  setPreviousState((prevState) => ({
    ...prevState,
    thisId: hiddenId,
    thisElem,
    hiddenElem: openElem,
  }));
}

// export the functions to be used in other modules
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
