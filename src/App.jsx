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
  const inputRef = useRef(null);
  const loadingRef = useRef();
  const [longLoading, setLongLoading] = useState(false);
  const [abortFetch, setAbortFetch] = useState(false);

  const handleChange = (thisData) => {
    setData(thisData);
  };

  const setLoading = (value) => {
    loadingRef.current.style.visibility = value;
  };

  function newAbortSignal(timeoutMs) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);

    return abortController.signal;
  }

  const handleSubmit = (e) => {
    setData(null);
    setRequestError(null);
    setLongLoading(false);
    setAbortFetch(false);
    setLoading('visible');

    e.preventDefault();

    const timeoutId = setTimeout(() => {
      setLongLoading(true);
    }, 10000);

    const location = encodeURIComponent(inputRef.current.value.trim());

    const options = {
      method: 'GET',
      // url: `http://192.168.1.81:5000/weather?location=${location}`,
      url: `http://localhost:5000/weather?location=${location}`,
      signal: newAbortSignal(30000),
    };

    axios
      .request(options)
      .then((response) => {
        clearTimeout(timeoutId);
        setAbortFetch(false);
        setLongLoading(false);
        setLoading('hidden');
        setData(response.data);
      })
      .catch((error) => {
        console.error(error.response.data);
        setLongLoading(false);
        clearTimeout(timeoutId);
        setAbortFetch(true);
        setLoading('hidden');
        setRequestError(error.response.data);
      });
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
            <p>Request took too long or there was a connection error. Please try again.</p>
          </div>
        )}
        {data && !requestError && (
          <>
            {data.length === 0 && (
              <>
                {setLoading('hidden')}
                <p>No Results were found. Please try again!</p>
              </>
            )}

            {Array.isArray(data) && data.length > 1 && (
              <MultipleResults data={data} setData={handleChange} setLoading={setLoading} />
            )}

            {Array.isArray(data) && data.length === 1 && (
              <ShowWeather data={data[0]} setLoading={setLoading} />
            )}
            {!Array.isArray(data) && <ShowWeather data={data} setLoading={setLoading} />}
          </>
        )}
        {requestError && <p>{requestError.error}</p>}
        {/* {data && console.log(data)} */}
      </div>
      <Footer />
    </div>
  );
}

export default App;
