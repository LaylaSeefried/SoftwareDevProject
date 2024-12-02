document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('class-search');
    const dropdown = document.getElementById('search-dropdown');

    searchInput.addEventListener('input', async (event) => {
        const query = event.target.value;
        console.log(`Search query: ${query}`); // Log the search term
        if (query.length > 1) { // Start searching after 2 characters
            try {
                const response = await fetch(`/api/class-search?q=${encodeURIComponent(query)}`);
                console.log(`API Response Status: ${response.status}`); // Log the status code
                const results = await response.json();
                console.log(`Results:`, results); // Log the API results
                displaySearchResults(results);
            } catch (err) {
                console.error(`Error fetching search results:`, err); // Log any errors
            }
        } else {
            clearSearchResults();
        }
    });

    function displaySearchResults(results) {
        console.log(`Displaying Results:`, results); // Log the results being displayed
        dropdown.innerHTML = ''; // Clear existing results
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.textContent = 'No classes found';
            noResults.classList.add('dropdown-item'); // Add dropdown styling
            dropdown.appendChild(noResults);
        } else {
            results.forEach(result => {
                const item = document.createElement('div');
                item.textContent = `${result.course_id} - ${result.course_name}`; // Display course_id and course_name
                item.classList.add('dropdown-item'); // Add dropdown styling
                dropdown.appendChild(item);
            });
        }
        dropdown.style.display = 'block'; // Ensure dropdown is visible
    }

    function clearSearchResults() {
        dropdown.innerHTML = ''; // Clear results
        dropdown.style.display = 'none'; // Hide dropdown
    }
});
