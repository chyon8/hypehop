document.addEventListener('DOMContentLoaded',  function () {

    
    
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreContainer = document.getElementById('load-more-container');
    const loginModal = document.getElementById('myModal');
    
   
    
    
    
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
        
            return '방금 전';
          } else {
    
            return `${minutes}분 전`;
          }
        } else {

          return `${hours}시간 전`;
        }
      } else if (days <= 7) {
 
        return `${days}일 전`;
      } else {

        return createdDate.format('YYYY년 MM월 DD일 ');
      }
    
    }
    
    
    
    
         isLoading = true;
         page++
    
         
       
    
       
        const response = await fetch(`stories/api/scroll?page=${page}`);
        
        const newStories = await response.json();
    
    
    
        if (newStories.length > 0) {
            
         newStories.forEach((story) => {
            story.formattedDate = dateDifference(story.createdAt, now);
         
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
    
            <a target="_blank" class="content-container" style="color: black;" onclick="viewCount()" href="/stories/${story._id}"> 
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
    
        <a  class="commentBtn" href="/stories/${story._id}" target="_blank">
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
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    