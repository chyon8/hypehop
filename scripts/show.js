const albumTitleHolder= document.getElementById('title').textContent

const albumTitle = document.getElementById('albumTitle')
albumTitle.value=albumTitleHolder


 const editor = new toastui.Editor({
           el: document.querySelector('#editor'),
           height: '500px',
           initialEditType: 'wysiwyg',
           previewStyle: 'vertical',
           usageStatistics: false,
           

           toolbarItems:[
       ['heading', 'bold','italic','strike'],
       ['hr','quote'],      
       [ 'ul', 'ol','indent', 'outdent'],
       ['scrollSync'],
      ]
               
       });

function prepareForm() {
  
        var ratingValue = parseFloat(document.getElementById('albumRating').value);
       if (ratingValue === 0) {
           alert("앨범 평점을 매겨주세요!");
           return false; 
       }
           else{
       
       const bodyContent = editor.getHTML();
       document.getElementById('body').value = bodyContent;
       return true;
   }

}

     function toggleTextarea() {
     var textareaContainer = document.getElementById('textarea-container');
     textareaContainer.style.display = 'block';
   }















   function toggleLyrics(lyricsId) {
     
   
       var lyricsElement = document.getElementById(lyricsId);
     
       if (lyricsElement) {
           var isHidden = lyricsElement.style.display === 'none' || !lyricsElement.style.display;
           lyricsElement.style.display = isHidden ? 'block' : 'none';
       }
   }


     function toggleTrackRate() {

   
       var trackRateElement = document.getElementById('tracks-rate');
     
       if (trackRateElement) {
           var isHidden = trackRateElement.style.display === 'none' || !trackRateElement.style.display;
           trackRateElement.style.display = isHidden ? 'block' : 'none';
       }
   }


function cancelTextarea() {

  
       document.getElementById('textarea-container').style.display = 'none';
   }
 


let userRating = 0;





function rate(stars) {
   userRating = stars;

   const albumRatingValue=document.getElementById('albumRating')
   albumRatingValue.value=userRating


   


   const labels = document.querySelectorAll('.rate label');


const index = Array.from(labels).indexOf(event.currentTarget.labels[0]);
  

   

 
   for (let i = labels.length - 1; i >= index; i--) {
     labels[i].style.color = 'gold';
   }

  
   for (let i = index - 1; i >= 0; i--) {
     labels[i].style.color = '';
   }




}

function rateTrack(stars, trackId) {
   userRating = stars;

   
   console.log('User rated:', userRating);


  const trackFieldset = document.getElementById(trackId);
   const trackRatingInput = trackFieldset.querySelector('#trackRating');

   
   trackRatingInput.value = userRating;
   




   const track = document.getElementById(trackId);
     const labels = track.querySelectorAll('label');

   const index = Array.from(labels).indexOf(event.currentTarget.labels[0]);
  
console.log(labels)
   

      
   for (let i = labels.length - 1; i >= index; i--) {
     labels[i].style.color = 'gold';
   }

 
   for (let i = index - 1; i >= 0; i--) {
     labels[i].style.color = '';
   }


}






