import axios from "axios";
import MultipleResults from "./MultipleResults";
import ShowWeather from "./ShowWeather";
import Footer from "./Footer";
import { useState, useRef } from "react";
import loading from "./images/loading.gif";

function App() {
    const [data, setData] = useState();
    const inputRef = useRef(null);
    const loadingRef = useRef();

    const handleChange = (thisData) => {
        setData(thisData);
    };

    const handleSubmit = (e) => {
        loadingRef.current.style.visibility = "visible";

        e.preventDefault();

        let location = inputRef.current.value;

        const options = {
            method: "GET",
            url: `http://localhost:5000/weather?location=${location}`,
        };

        axios
            .request(options)
            .then(function (response) {
                setData(response.data);
            })
            .catch(function (error) {
                console.error(error);
            });
    };

    return (
        <div className="App">
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <label className="location-label" htmlFor="city">
                        Search for Weather
                    </label>
                    <div className="form-inputs">
                        <input ref={inputRef} type="text" name="city" id="city" placeholder="Location" style={{ backgroundColor: "white" }} />
                        <input type="submit" className="search-button" value="Go" />
                    </div>
                </form>
                <img id="loading" className="loading" src={loading} alt="" ref={loadingRef} />
                {data && data.length === 0 && ((loadingRef.current.style.visibility = "hidden"), (<p>No Results were found. Please try again!</p>))}
                {data && Array.isArray(data) && data.length > 1 && <MultipleResults data={[data, handleChange, loadingRef]} />}
                {data && (!Array.isArray(data) || (Array.isArray(data) && data.length === 1)) && <ShowWeather data={[data, loadingRef]} />}
                {/* {data && console.log(data)} */}
            </div>
            <Footer />
        </div>
    );
}

export default App;
