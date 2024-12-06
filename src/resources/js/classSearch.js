document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('class-search');
    const dropdown = document.getElementById('search-dropdown');

    searchInput.addEventListener('input', async (event) => {
        const query = event.target.value;
        if (query.length > 1) { // Start searching after 2 characters
            try {
                const response = await fetch(`/api/class-search?q=${encodeURIComponent(query)}`);
                const results = await response.json();
                displaySearchResults(results);
            } catch (err) {
                console.error(`Error fetching search results:`, err);
            }
        } else {
            clearSearchResults();
        }
    });

    function displaySearchResults(results) {
        dropdown.innerHTML = ''; // Clear existing results
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.textContent = 'No classes found';
            noResults.classList.add('dropdown-item'); // Add dropdown styling
            dropdown.appendChild(noResults);
        } else {
            results.forEach(result => {
                const link = document.createElement('a');
                link.href = `/courses/${result.course_id}`; // Link to the course details page
                link.textContent = `${result.course_id} - ${result.course_name}`;
                link.classList.add('dropdown-item'); // Add dropdown styling
                dropdown.appendChild(link);
            });
        }
        dropdown.style.display = 'block'; // Ensure dropdown is visible
    }

    function clearSearchResults() {
        dropdown.innerHTML = ''; // Clear results
        dropdown.style.display = 'none'; // Hide dropdown
    }
});
