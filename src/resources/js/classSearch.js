document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('class-search');
    const dropdown = document.getElementById('search-dropdown');

    searchInput.addEventListener('input', async (event) => {
        const query = event.target.value;
        if (query.length > 1) { // Start searching after 2 characters
            const response = await fetch(`/api/class-search?q=${encodeURIComponent(query)}`);
            const results = await response.json();
            displaySearchResults(results);
        } else {
            clearSearchResults();
        }
    });

    function displaySearchResults(results) {
        dropdown.innerHTML = ''; // Clear existing results
        results.forEach(result => {
            const item = document.createElement('div');
            item.textContent = `${result.course_id} - ${result.course_name}`; // Display course_id and course_name
            dropdown.appendChild(item);
        });
        dropdown.style.display = 'block';
    }

    function clearSearchResults() {
        dropdown.innerHTML = '';
        dropdown.style.display = 'none';
    }
});
