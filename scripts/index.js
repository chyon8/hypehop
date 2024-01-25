


      const loader = document.querySelector('.loader')


    document.getElementById('searchForm').addEventListener('submit', function (event) {
      event.preventDefault();
       loader.style.display="block"

      const keyword = document.getElementById('keyword').value;
    




      axios.post('/album/search', { keyword  })
        .then(function (response) {
          console.log(response )
          displaySearchResults(response.data);
          
        })
        .catch(function (error) {
          console.error('Error:', error.message);
        });
    });

function displaySearchResults(data) {
  const resultsContainer = document.getElementById('searchResults');
  
  resultsContainer.innerHTML = '';
 





if (data.length > 0) {
    data.forEach(item => {
        const albumTitle = item.name
        const thumbnail = item.images[1].url
        const albumId = item.id

        // Create a container for each result
        const resultContainer = document.createElement('div');

        // Display album title and thumbnail inside the <a> tag
        const linkElement = document.createElement('a');
        linkElement.href = `/album/${albumId}`;
    
         

        // Display album title
        const titleElement = document.createElement('p');
        titleElement.textContent = albumTitle;

        // Display thumbnail
        const thumbnailElement = document.createElement('img');
        thumbnailElement.src = thumbnail;
        thumbnailElement.alt = 'Thumbnail';
        thumbnailElement.style="width:150px"

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




