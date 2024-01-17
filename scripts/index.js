


      const loader = document.querySelector('.loader')


    document.getElementById('searchForm').addEventListener('submit', function (event) {
      event.preventDefault();
       loader.style.display="block"

      const keyword = document.getElementById('keyword').value;

      const itemtype = document.getElementById('itemtype').value;
      const display = document.getElementById('display').value;

      axios.post('/album/search', { keyword, itemtype, display })
        .then(function (response) {
          displaySearchResults(response.data);
        })
        .catch(function (error) {
          console.error('Error:', error.message);
        });
    });

function displaySearchResults(xmlString) {
  const resultsContainer = document.getElementById('searchResults');
  
  resultsContainer.innerHTML = '';
 

  // Parse the XML string to a DOM document
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  // Log the entire XML document to inspect its structure


  // Example: Displaying album titles
  const items = xmlDoc.querySelectorAll('item');

if (items.length > 0) {
    items.forEach(item => {
        const albumTitle = item.querySelector('title').textContent;
        const thumbnail = item.querySelector('thumnail').textContent;
        const albumId = item.getAttribute('id');

        // Create a container for each result
        const resultContainer = document.createElement('div');

        // Display album title and thumbnail inside the <a> tag
        const linkElement = document.createElement('a');
        linkElement.href = `/album/${albumId}`;
        //`https://www.maniadb.com/api/album/${albumId}/&v=0.5`;
         

        // Display album title
        const titleElement = document.createElement('p');
        titleElement.textContent = albumTitle;

        // Display thumbnail
        const thumbnailElement = document.createElement('img');
        thumbnailElement.src = thumbnail;
        thumbnailElement.alt = 'Thumbnail';

        // Append title and thumbnail elements to the <a> tag
        linkElement.appendChild(titleElement);
        linkElement.appendChild(thumbnailElement);

        //disaply id
        const idElement = document.createElement('p');
        

        // Append elements to the result container
        resultContainer.appendChild(linkElement);
        resultContainer.appendChild(idElement);

        // Append the result container to the main results container
        resultsContainer.appendChild(resultContainer);

        
    });
    loader.style.display="none"
} else {
    const noResults = document.createElement('p');
    noResults.textContent = 'No results found';
    resultsContainer.appendChild(noResults);
      loader.style.display="none"
}




}




