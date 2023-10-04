import axios from 'axios';
import React, { useState, useRef } from 'react';
import MultipleResults from './MultipleResults';
import ShowWeather from './ShowWeather';
import Footer from './Footer';
import loading from './images/loading.gif';

function App() {
  const [data, setData] = useState();
  const inputRef = useRef(null);
  const loadingRef = useRef();

  const handleChange = (thisData) => {
    setData(thisData);
  };

  const setLoading = (value) => {
    loadingRef.current.style.visibility = value;
  };

  const handleSubmit = (e) => {
    setData(null);
    setLoading('visible');

    e.preventDefault();

    const location = inputRef.current.value;

    const options = {
      method: 'GET',
      url: `http://localhost:5000/weather?location=${location}`,
    };

    axios
      .request(options)
      .then((response) => {
        setData(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="App" role="main">
      <div className="wrapper">
        <form onSubmit={handleSubmit} role="search">
          <input
            ref={inputRef}
            type="text"
            name="city"
            id="city"
            placeholder="Location"
            style={{ backgroundColor: 'white' }}
          />
          <input type="submit" className="search-button" value="Go" />
        </form>
        <img id="loading" className="loading" src={loading} alt="" ref={loadingRef} />
        {data && (
          <>
            {data.length === 0 && (
              <>
                {setLoading('hidden')}
                <p>No Results were found. Please try again!</p>
              </>
            )}

            {Array.isArray(data) && data.length > 1 && (
              <MultipleResults data={data} setData={handleChange} loadingRef={loadingRef} />
            )}

            {Array.isArray(data) && data.length === 1 && (
              <ShowWeather data={data[0]} loadingRef={loadingRef} />
            )}
            {!Array.isArray(data) && <ShowWeather data={data} loadingRef={loadingRef} />}
          </>
        )}
        {/* {data && console.log(data)} */}
      </div>
      <Footer />
    </div>
  );
}

export default App;
