
const cardContent = document.getElementsByClassName('card-content')
const favoriteBtn = document.getElementsByClassName('favorite')

for (var i = 0; i < cardContent.length; i++) {
   
    favoriteBtn[i].addEventListener("click", addToFavorite);
  }
  
  
  
  
  
  
  function addToFavorite(){
  
  
   let contentId = this.closest('.social').parentNode.id;
  
  
    const heartIcon = this.querySelector('i');
  
  if(heartIcon.className=='far fa-heart'){
  
  heartIcon.className='fa fa-heart'
  
  
  
      fetch(`/api/favorite/${contentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isFavorite: true }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }
      // Handle the success response if needed
      console.log('Favorite status updated successfully');
    })
  
  
    .catch(error => {
      // Handle the error if needed
      console.error('Error:', error);
  
    });
  
  
  
  }
  else{
      heartIcon.className='far fa-heart'
      fetch(`/api/favorite/${contentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isFavorite: false }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }
      // Handle the success response if needed
      console.log('Favorite status updated successfully');
    })
  
  
    .catch(error => {
      // Handle the error if needed
      console.error('Error:', error);
  
    });
  
  
  
  }
  
  
  
  }
  
  
  
  function updateFavorites() {
    // Assuming favoriteButtons is not an array, convert it to an array
    const favoriteButtonsArray = Array.from(favoriteBtn);
  
  
  
    // Fetch data from the API
    fetch('/api/favorites')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Check if data is an array
        if (!Array.isArray(data)) {
          console.error('Data is not an array');
          return;
        }
  
        // Get an array of musicIds from favoriteButtonsArray
        const favoriteButtonIds = favoriteButtonsArray.map(button => button.closest('.social').parentNode.id);
  
    
        // Iterate through the fetched data and update the buttons
        data.forEach(item => {
          const favorited = item._id;
  
          if (favoriteButtonIds.includes(favorited)) {
            // Update the corresponding button
            const index = favoriteButtonIds.indexOf(favorited);
            favoriteButtonsArray[index].children[0].className = "fa fa-heart";
          
          }
        });
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }
  
  updateFavorites();
  
  
  
  
  
  
  
  
  
  
  