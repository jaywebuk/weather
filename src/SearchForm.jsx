/* eslint-disable react/prop-types */
function SearchForm({ handleSubmit, inputRef }) {
  return (
    <form onSubmit={handleSubmit} role="search">
      <input
        ref={inputRef}
        type="text"
        name="city"
        id="city"
        placeholder="Location"
        style={{ backgroundColor: 'white' }}
        required
      />
      <input type="submit" className="search-button" value="Go" />
    </form>
  );
}

export default SearchForm;
