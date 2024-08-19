import axios from 'axios';
import React, { useState, useRef } from 'react';
import MultipleResults from './MultipleResults';
import SearchForm from './SearchForm';
import ShowWeather from './ShowWeather';
import Footer from './Footer';
import loading from './images/loading.gif';

function App() {
  // Initialize state variables
  const [data, setData] = useState(); // To store the fetched data
  const [requestError, setRequestError] = useState(); // To store any request errors
  const inputRef = useRef(null); // A reference to the search input field
  const loadingRef = useRef(); // A reference to the loading image element
  const [longLoading, setLongLoading] = useState(false); // To indicate if the long loading message should be displayed
  const [abortFetch, setAbortFetch] = useState(false); // To indicate if the fetch request was aborted
  const [errorMessage, setErrorMessage] = useState(null); // To store any error messages

  // Handle changes in the data
  const handleChange = (thisData) => {
    setData(thisData);
  };

  // Set the visibility of the loading image
  const setLoading = (value) => {
    loadingRef.current.style.visibility = value;
  };

  // Start a long loading timer
  const startLongLoading = () => {
    const timeoutId = setTimeout(() => {
      setLongLoading(true);
    }, 10000); // Set the long loading message after 10 seconds

    return timeoutId;
  };

  // Fetch data from the API
  const fetchData = async (location) => {
    const options = {
      method: 'GET',
      url: `https://localhost:6010/weather?location=${location}`,
      timeout: 30000, // Set a timeout of 30 seconds for the request
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
    };

    const response = await axios(options);
    return response.data;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setData(null);
    setRequestError(null);
    setLongLoading(false);
    setAbortFetch(false);
    setLoading('visible');

    const timeoutId = startLongLoading();

    const location = encodeURIComponent(inputRef.current.value.trim()); // Encode and trim the search input value

    try {
      const fetchedData = await fetchData(location); // Fetch data from the API
      setErrorMessage(null);
      setData(fetchedData);
    } catch (error) {
      if (error.name === 'Cancel') {
        // If the request was aborted, set the abortFetch state variable
        setAbortFetch(true);
      } else {
        // Otherwise, set the request error
        setErrorMessage(`Shucks, an error occurred. Please try again. ${requestError}`);
        setRequestError(error.message);
      }
    } finally {
      clearTimeout(timeoutId); // Clear the long loading timer
      setLoading('hidden');
    }
  };

  const renderShowWeather = () => {
    if (Array.isArray(data)) {
      return <ShowWeather data={data[0]} setLoading={setLoading} />;
    }
    return <ShowWeather data={data} setLoading={setLoading} />;
  };

  const renderMultipleResults = () => {
    return <MultipleResults data={data} setData={handleChange} setLoading={setLoading} />;
  };

  return (
    <div className="App" role="main">
      <div className="wrapper">
        <SearchForm handleSubmit={handleSubmit} inputRef={inputRef} />
        <img id="loading" className="loading" src={loading} alt="" ref={loadingRef} />
        {longLoading && (
          <div>
            <p>This is taking longer than usual. Please wait...</p>
          </div>
        )}
        {abortFetch && !requestError && (
          <div>
            <p>
              Unfortunately the request took too long or there was a connection error. Please try
              again.
            </p>
          </div>
        )}
        {errorMessage && <div>{errorMessage}</div>}
        {data && !requestError && (
          <>
            {Array.isArray(data) && data.length === 0 && (
              <p>No Results were found. Please try again!</p>
            )}

            {Array.isArray(data) && data.length > 1 && renderMultipleResults()}

            {((Array.isArray(data) && data.length === 1) || !Array.isArray(data)) &&
              renderShowWeather()}
          </>
        )}
        {requestError && <p>{requestError.error}</p>}
      </div>
      <Footer />
    </div>
  );
}

export default App;
