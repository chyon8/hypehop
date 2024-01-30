
const favoriteBtn = document.getElementsByClassName('favorite')

const cardContent = document.getElementsByClassName('card-content')

document.addEventListener('DOMContentLoaded',  function () {
   


const loadMoreBtn = document.getElementById('load-more-btn');
const loadMoreContainer = document.getElementById('load-more-container');
const loginModal = document.getElementById('myModal');;




let page=1
let isLoading = false;
let now =new Date();


async function loadMoreStories() {
  try {


function dateDifference(createdAt, now) {
   
  const createdDate = moment(createdAt).utc();
  const currentDate = moment(now).utc();
  const diffDuration = moment.duration(currentDate.diff(createdDate));

  const days = diffDuration.days();
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();

 
  if (days === 0) {
    if (hours === 0) {
      if (minutes === 0) {
        // If the difference is less than 1 minute, return "방금 전" (now)
        return '방금 전';
      } else {
        // If the difference is less than 1 hour, return "n분 전" (minutes ago)
        return `${minutes}분 전`;
      }
    } else {
      // If the difference is less than a day, return "n시간 전" (hours ago)
      return `${hours}시간 전`;
    }
  } else if (days <= 7) {
    // If the difference is 7 days or less, return "n일 전" (days ago)
    return `${days}일 전`;
  } else {
    // If the difference is more than 7 days, return the "YYYY년 MM월 DD일 dddd"
    return createdDate.format('YYYY년 MM월 DD일 ');
  }

}


function truncate (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  }



     isLoading = true;
     page++

     
   

   
    const response = await fetch(`/album/api/review/scroll?page=${page}`);
    
    const newStories = await response.json();




    if (newStories.length > 0) {
        
     newStories.forEach((story) => {
        story.formattedDate = dateDifference(story.createdAt, now);
        story.truncated = truncate(story.albumTitle,100)
     
       const storyCardTemplate = Handlebars.compile(`

      <div class="card">   

            <div id="${story._id}" class="card-content ">

<div class="chip"><img src="${story.user.image}" alt="">  
   
                   <a style="color: black;" href="/stories/user/${story.user._id}">
                   ${
                    story.user.name ? story.user.name : story.user.displayName
                  }
		 </a>

                    <p> ${story.formattedDate}</p>                  
</div>

<div class="reviewedAblum">
    <a href="/album/${story.albumId}">

<img  src="${story.thumbnail}" alt="">

<p>${story.truncated} </p>
<p> ${story.albumRating}</p>

</a>
</div>

        <a target="_blank" class="content-container" style="color: black;" onclick="viewCount()" href="/album/review/${story._id}"> 
                <p class="card-title" style="text-align: left;">${story.title}</p>
                       <div class="content-body" >${story.body}
                      
                       </div>   
                              
                 <br> 
          
</a>


     <p class="chip view" style="position: absolute; bottom: 20px; right: 0;" >조회 ${story.view}</p>
      


 <div class="social" style="display: flex;">
  
     <button class="favorite"><i class="far fa-heart">
      좋아요
       ${story.isFavorite.length}

     </i></button>

    <a  class="commentBtn" href="/album/review/${story._id}" target="_blank">
    <button class="comment">

       
       <i class="far fa-comment"> 
          댓글   ${story.comments.length} 
    
        



              </i>
    </i></button>
  </a>

</div>

                              
            </div>      

        </div>



`);
  
        const storyHtml = storyCardTemplate(story)
        const storyElement = document.createElement('div');
        storyElement.innerHTML = storyHtml;
        loadMoreContainer.appendChild(storyElement);
        
      });


      isLoading=false;
      
      
     
       


      for (var i = 0; i < cardContent.length; i++) {
   
  favoriteBtn[i].addEventListener("click", addToFavorite);
  updateFavorites()
}



    } else {

      
      loadMoreBtn.innerText = '끝';
    }




  } catch (error) {
    console.error('Error loading more stories:', error);
  }
}   //loadmorestories end

  



window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !isLoading) {
       
   
   loadMoreStories();

   loginModal.style.display='block'
    
  


  }


});




})  //DOM loaded 
