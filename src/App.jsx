import axios from 'axios';
import React, { useState, useRef } from 'react';
import MultipleResults from './MultipleResults';
import SearchForm from './SearchForm';
import ShowWeather from './ShowWeather';
import Footer from './Footer';
import loading from './images/loading.gif';

function App() {
  const [data, setData] = useState();
  const [requestError, setRequestError] = useState();
  const loadingRef = useRef();
  const [longLoading, setLongLoading] = useState(false);
  const [abortFetch, setAbortFetch] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (thisData) => {
    setData(thisData);
  };

  const setLoading = (value) => {
    loadingRef.current.style.visibility = value;
  };

  const startLongLoading = () => {
    const timeoutId = setTimeout(() => {
      setLongLoading(true);
    }, 10000);

    return timeoutId;
  };

  const fetchData = async (location) => {
    const options = {
      method: 'GET',
      url: `https://localhost:6010/weather?location=${location}`,
      timeout: 30000,
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
    };

    const response = await axios(options);
    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target.city.value);

    setData(null);
    setRequestError(null);
    setLongLoading(false);
    setAbortFetch(false);
    setLoading('visible');

    const timeoutId = startLongLoading();

    const location = e.target.city.value.trim();

    try {
      const fetchedData = await fetchData(location);
      setErrorMessage(null);
      setData(fetchedData);
    } catch (error) {
      if (error.name === 'Cancel') {
        setAbortFetch(true);
      } else {
        setErrorMessage(`Shucks, an error occurred. Please try again. ${requestError}`);
        setRequestError(error.message);
      }
    } finally {
      clearTimeout(timeoutId);
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
        <SearchForm handleSubmit={handleSubmit} />
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
