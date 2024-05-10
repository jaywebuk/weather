/*
 * SearchForm Component:
 * This functional component represents a search form for inputting a location.
 * It takes two props: handleSubmit (a function) and inputRef (a ref object).
 */

// Disable ESLint rule for prop-types as this component does not use prop-types
/* eslint-disable react/prop-types */

// Import the SearchForm component
import SearchForm from './SearchForm';

// Export the SearchForm component for use in other files
export default SearchForm;

// The SearchForm component definition
function SearchForm({ handleSubmit, inputRef }) {
  // Return the JSX for the search form
  return (
    <form
      // Attach the onSubmit event listener to the form, which will trigger the
      // handleSubmit function when the form is submitted
      onSubmit={handleSubmit}

      // Set the role attribute of the form to 'search' to indicate its purpose
      role="search"
    >
      {/* Include an input field for the location */}
      <input
        // Attach the inputRef ref to the input field
        ref={inputRef}

        // Set the type attribute of the input field to 'text'
        type="text"

        // Set the name attribute of the input field to 'city'
        name="city"

        // Set the id attribute of the input field to 'city'
        id="city"

        // Set the placeholder attribute of the input field to 'Location'
        placeholder="Location"

        // Set the background color of the input field to white
        style={{ backgroundColor: 'white' }}

        // Set the required attribute of the input field to true
        required
      />

      {/* Include a submit button for the form */}
      <input
        // Set the type attribute of the submit button to 'submit'
        type="submit"

        // Set the className attribute of the submit button to 'search-button'
        className="search-button"

        // Set the value attribute of the submit button to 'Go'
        value="Go"
      />
    </form>
  );
}

