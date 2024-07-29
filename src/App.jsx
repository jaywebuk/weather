import axios from 'axios';
import React, { useState, useRef } from 'react';
import MultipleResults from './MultipleResults';
import SearchForm from './SearchForm';
import ShowWeather from './ShowWeather';
import Footer from './Footer';
import loading from './images/loading.gif';

// Define the App component
function App() {
  // Initialize state variables
  const [data, setData] = useState(); // To store the fetched data
  const [requestError, setRequestError] = useState(); // To store any request errors
  const inputRef = useRef(null); // A reference to the search input field
  const loadingRef = useRef(); // A reference to the loading image element
  const [longLoading, setLongLoading] = useState(false); // To indicate if the long loading message should be displayed
  const [abortFetch, setAbortFetch] = useState(false); // To indicate if the fetch request was aborted

  // Handle changes in the data
  const handleChange = (thisData) => {
    setData(thisData);
  };

  // Set the visibility of the loading image
  const setLoading = (value) => {
    loadingRef.current.style.visibility = value;
  };

  // Create a new abort signal with a timeout
  function newAbortSignal(timeoutMs) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);

    return abortController.signal;
  }

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
      url: `http://localhost:5000/weather?location=${location}`,
      signal: newAbortSignal(30000), // Set a timeout of 30 seconds for the request
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
      setData(fetchedData);
    } catch (error) {
      if (error.name === 'Cancel') {
        // If the request was aborted, set the abortFetch state variable
        setAbortFetch(true);
      } else {
        // Otherwise, set the request error
        setRequestError(error.message);
      }
    } finally {
      clearTimeout(timeoutId); // Clear the long loading timer
      setLoading('hidden');
    }
  };

  // Render the ShowWeather component based on the fetched data
  const renderShowWeather = () => {
    if (Array.isArray(data)) {
      return <ShowWeather data={data[0]} setLoading={setLoading} />;
    }
    return <ShowWeather data={data} setLoading={setLoading} />;
  };

  // Render the MultipleResults component based on the fetched data
  const renderMultipleResults = () => {
    return <MultipleResults data={data} setData={handleChange} setLoading={setLoading} />;
  };

  return (
    <div className="App" role="main">
      <div className="wrapper">
        {/* Render the SearchForm component */}
        <SearchForm handleSubmit={handleSubmit} inputRef={inputRef} />
        {/* Render the loading image */}
        <img id="loading" className="loading" src={loading} alt="" ref={loadingRef} />
        {/* Display the long loading message */}
        {longLoading && (
          <div>
            <p>This is taking longer than usual. Please wait...</p>
          </div>
        )}
        {/* Display the abort fetch message */}
        {abortFetch && !requestError && (
          <div>
            <p>
              Unfortunately the request took too long or there was a connection error. Please try
              again.
            </p>
          </div>
        )}
        {/* Display the fetched data */}
        {data && !requestError && (
          <>
            {/* Display the "No Results" message if no results were found */}
            {Array.isArray(data) && data.length === 0 && (
              <p>No Results were found. Please try again!</p>
            )}

            {/* Render the MultipleResults component if multiple results were found */}
            {Array.isArray(data) && data.length > 1 && renderMultipleResults()}

            {/* Render the ShowWeather component if a single result was found */}
            {((Array.isArray(data) && data.length === 1) || !Array.isArray(data)) &&
              renderShowWeather()}
          </>
        )}
        {/* Display the request error */}
        {requestError && <p>{requestError.error}</p>}
        {/* {data && console.log(data)} */}
      </div>
      {/* Render the Footer component */}
      <Footer />
    </div>
  );
}

// Export the App component
export default App;
