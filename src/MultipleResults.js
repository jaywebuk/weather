const MultipleResults = ({ data }) => {
    let [cityData, setData, loadingRef] = data;
    function handleChange(thisData) {
        const selectedIndex = thisData.target.options.selectedIndex;
        const lat = thisData.target.options[selectedIndex].dataset.lat;
        const lon = thisData.target.options[selectedIndex].dataset.lon;

        var sendData = cityData.filter((obj) => {
            if (obj.lat == lat && obj.lon == lon) {
                return obj;
            }
        });

        setData(sendData);
    }

    const extractData = () => {
        loadingRef.current.style.visibility = "hidden";
        let id = 0;
        let options = {};
        return cityData.map((city) => {
            options = {
                id: `city-${id}`,
                "data-lat": city["lat"],
                "data-lon": city["lon"],
                key: id++,
            };
            return <option {...options}>{`${city["name"]} (${city["country"]}) ${city["lat"]}, ${city["lon"]}`}</option>;
        });
    };

    return (
        <>
            <p>Multiple results were found! Please choose a city below.</p>

            <form className="multipleForm">
                <select onChange={handleChange} size={cityData.length}>
                    {extractData()}
                </select>
            </form>
        </>
    );
};

export default MultipleResults;
