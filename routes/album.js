const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const bodyParser = require('body-parser');
const axios = require('axios');
const parseXml = require('xml2js').parseStringPromise;
const Story = require('../models/Story')

const Comment = require('../models/Comment');
const Review = require('../models/Review');
const { constants } = require('fs-extra');

//sitemap




//sitemap




const generateSitemap = async () => {
  const reviewId = await Review.find({ status: 'public' })
  .sort({ createdAt: 'desc' })
  .limit(100)
  .lean()

 const albumIdsList =[...new Set (reviewId.map(item=>item._id))]

 // Implement the function to fetch album IDs


  const xmlItems = albumIdsList.map((reviewId) => {
    return `<url>
        <loc>https://hype-hop.onrender.com/album/review/${reviewId}</loc>
       
      </url>
    `;
  });

  // Construct the complete XML
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
      ${xmlItems.join('')}
    </urlset>
  `;

  return sitemapContent;
  

};




router.get('/sitemap.xml', async (req, res) => {
  try {
    // Dynamically generate the sitemap content here
    const sitemapContent = (await generateSitemap()).trim(); // Implement the function to generate sitemap content

    res.header('Content-Type', 'application/xml');
    res.send(sitemapContent);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





////     spotyfy 

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

router.post('/search', async (req, res) => {
  const { keyword } = req.body;
  try {
    // Step 1: Obtain Access Token
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Step 2: Use Access Token in Search Request
    const spotify_search_one = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        q: keyword,
        type: "album",
        limit:10
      },
    });

    // Access and log the 'items' array from the response
    //console.log(spotify_search_one.data.albums.items);

    // Send the 'items' array in the response
    res.status(200).json(spotify_search_one.data.albums.items);
  } catch (error) {
    console.error(error);

    // Handle errors and send an appropriate response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





/// spotify




















router.get('/',async (req, res) => {
  try {
    const sort = req.query.sort;
 
    const currentDate = new Date();

// Set the end date to today at the end of the day
let endDate = new Date(currentDate);


// Set the start date to three months ago from today
let startDate =new Date(currentDate);

   

if(sort=='alltime'){
  startDate = new Date(1900, 0, 1);
}
else if (sort=='yearly'){


  startDate.setMonth(currentDate.getMonth() - 12);
  
}
else{
  startDate = new Date(1900, 0, 1);
}

    
  
  const reviews = await Review.find({}).sort({ createdAt: 'desc' }).lean()



const albumRank = await Review.find({
  albumReleaseDate: {
    $gte: startDate.toISOString(),
    $lt: endDate.toISOString(),
  }
}).sort({ createdAt: 'desc' })
.lean()
 


  
const uniqueAlbumTitles = [];



const uniqueAlbumsSet = new Set();
const uniqueAlbumsArray = [];
const resultLimit = 5;
let uniqueAlbumsCount = 0;

reviews.forEach(item => {
  if (uniqueAlbumsCount >= resultLimit) {
    return; // Break out of the loop if the result limit is reached
  }

  const albumTitle = item.albumTitle.trim();
  const albumId = item.albumId;
  const albumRating = item.albumRating;

  if (!uniqueAlbumsSet.has(albumTitle)) {
    uniqueAlbumsSet.add(albumTitle);
    uniqueAlbumsArray.push({
      albumTitle,
      albumId,
      albumRating
    });

    uniqueAlbumsCount++;
  }
});





//                         앨범 평점 차트  all time 


const uniqueAlbumsMap = new Map(); // Using Map to store album titles and their ratings
//const resultLimitChart = 3;

albumRank.forEach(item => {

  const albumTitle = item.albumTitle.trim();
  const albumId = item.albumId;
  const albumRating = item.albumRating;
  const thumbnail = item.thumbnail

  if (!uniqueAlbumsMap.has(albumTitle)) {
    // If album title is not in the map, add a new entry with an array of ratings
    uniqueAlbumsMap.set(albumTitle, {
      albumTitle,
      albumId,
      thumbnail,
      ratings: [albumRating],
   
    });
  } else {
    // If album title is already in the map, add the rating to the existing array
    uniqueAlbumsMap.get(albumTitle).ratings.push(albumRating);
  }
});


const uniqueAlbumsArrayChart = [...uniqueAlbumsMap.values()].slice(0);

// 앨범 리뷰 2개 이상  -> 나중에 한 3~5개 이상으로 바꿔야겠지 
const filteredAlbums = uniqueAlbumsArrayChart.filter(album => album.ratings.length > 1);

filteredAlbums.forEach(album => {
  

  const sumOfRatings = album.ratings.reduce((sum, rating) => sum + rating, 0);


  const averageRating = sumOfRatings / album.ratings.length;
  album.averageRating = Number(averageRating.toFixed(1));
  const weightedAverage = (sumOfRatings + 0.1 * album.ratings.length) / (album.ratings.length + 0.5);
  album.weightedAverage = Number(weightedAverage);

});

filteredAlbums.sort((a, b) => b.weightedAverage - a.weightedAverage);

let top5Albums = filteredAlbums.slice(0, 10)


//                     앨범 평점 차트  all time







    res.render('album/index', {
     //  name: req.user.firstName,
      reviews,
      uniqueAlbumsArray,
      top5Albums,
      sort,
      pageTitle: '하입합 | hype-hop - 앨범 차트, 앨범 평점',
      pageDescription: '앨범 리뷰 평점 커뮤니티',
      pageKeywords:"하입합, hypehop, 앨범 리뷰, 힙합, 음악, 차트, 앨범 차트, 힙합 차트, 앨범, 앨범 평점"
      
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


//album feed
router.get('/review', async (req, res) => {
  try {


    const page = req.query.page || 1;
    const perPage = 10; // Adjust this according to your needs

    const reviews = await Review.find({ status: 'public' })
    .populate('user')
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: 'desc' })
    .lean()


    




    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
   
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setUTCDate(oneWeekAgo.getUTCDate() - 7);

    //daily ranking
    const reviewsRank = await Review.aggregate([
      {
        $match: {
          status: 'public',
         createdAt: { $gte: oneWeekAgo,$lte: today } 
        }
      },
      {
        $lookup: {
          from: 'users', // Replace with the actual name of your User model
          localField: 'isFavorite',
          foreignField: '_id',
          as: 'favoritedUsers'
        }
      },
       {
      $addFields: {
          favoriteCount: { $size: '$favoritedUsers' }
        } 
      },
      {
        $sort: { favoriteCount: -1, createdAt:-1 }
      },
      {
        $limit: 5 // Adjust the number based on your requirement
      }
    ]);

  
  

    res.render('album/review', {
      user:req.user,
      reviewsRank,
      reviews,
      pageTitle: '하입합 | hype-hop - 리뷰 피드',
      pageDescription: '앨범 리뷰 평점 커뮤니티',
      pageKeywords:"하입합, hypehop, 앨범 리뷰, 힙합, 음악, 차트, 앨범 차트, 힙합 차트, 앨범, 앨범 평점"
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})



router.get('/api/review/scroll', async (req, res) => {
  try {
 
    const page = req.query.page || 1;
    const perPage = 10; // Adjust this according to your needs

   
    const reviewsInfinite = await Review.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()


    res.json(reviewsInfinite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





router.get('/review/:id', async (req, res) => {
  try {
    let review = await Review.findById(req.params.id).populate('user').lean()
    let comments = await Comment.find({review :req.params.id}).populate('user').lean()

    if (!review) {
      return res.render('error/404')
    }
    await Review.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { view: 1 } }, // Increment the 'view' field by 1
      {
        new: true,
        runValidators: true,
      }
    );


    const albumTitleParts = review.albumTitle.split('-').map(part => part.trim())
    const concatenatedTitle = albumTitleParts.join(',');
    const pageKeyword = concatenatedTitle + ' 앨범 리뷰, 힙합, 음악, 앨범 평점';


 
      res.render('album/reviewShow', {
       
        id:req.params.id,
        comments,
        review,
        pageTitle: review.title,
        pageDescription: review.albumTitle.trim(),
        pageKeywords:pageKeyword
      })
    
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})







router.get('/:id',ensureAuth, async (req, res) => {
  try {

    let albumId = req.params.id;

    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
   
    const spotify_search_album_by_id = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});


const container = spotify_search_album_by_id.data.tracks.items
const disc_total=container[container.length-1].disc_number
const discArray = Array.from({ length: disc_total }, (_, index) => index + 1);

    let reviews = await Review.find({albumId :req.params.id}).populate('user').lean()
   

     //앨범 아이디 찾아서 평균치 내기
  
      const albumRatings = reviews.map(item => item.albumRating);
    
     const sum = albumRatings.reduce((acc, rating) => acc + rating, 0);
     const average = sum / albumRatings.length;
     const roundedAverage = average.toFixed(1);


    //트랙별 평점 


    const tracks = reviews.map(item => item.tracks);
    const transformedObject = {};

    tracks.forEach((discArray) => {
  discArray.forEach((track) => {
    const { discNumber, trackRating } = track;

    if (!transformedObject[discNumber]) {
      transformedObject[discNumber] = {
        trackRating: [trackRating],
      };
    } else {
      transformedObject[discNumber].trackRating.push(trackRating);
    }
  });
});


const formattedArray = Object.keys(transformedObject).map((discNumber) => ({
  [discNumber]: transformedObject[discNumber].trackRating
}));





let storedAverage = [];

//디스크 넘버에 따라 돌기 2cd면 두번
for (let i = 0,j=1; i < formattedArray.length; i++,j++){
  let arr= formattedArray[i][j] //arr = 디스크별로 첫번째 유저가 쓴거, 트랙수 구하기  위해서 쓴 변수

let average = [];


//트랙수별로 돌기 ex 23, 12트랙
  for (let i = 0, j=1; i < arr[0].length; i++, j++){
    let sum = 0;
    let reviewedCount = 0;
    for (let k = 0; k < arr.length; k++) {
      
     if(arr[k][i] !== null){
      reviewedCount += 1
     }
      

      sum += arr[k][i];
     

    }

 
  average.push((sum / reviewedCount).toFixed(1));     //arr.length = 리뷰 수 
 
  }
  storedAverage.push(average)





}


    try {
      
      const storedAverageArr = storedAverage.map((list, index) => ({ key: index + 1, values: list }));
      
      const reviewUser = reviews.map(item => item.user._id.toString());

      const albumArtist=spotify_search_album_by_id.data.artists[0].name
      const albumTitleFromApi=spotify_search_album_by_id.data.name
      const albumTitleFromSpotifyAPi =albumArtist +"-" + albumTitleFromApi
      const concatenatedTitle= albumArtist +"," + albumTitleFromApi 
      const pageKeyword = concatenatedTitle + ' 앨범 리뷰, 힙합, 음악, 앨범 평점';



      res.render('album/show', { 
        loggedInUser:req.user.id,
        albumData: spotify_search_album_by_id.data,
        id:albumId,
        disc_total : discArray,
        albumRatingAverage:roundedAverage,
        reviews,
        storedAverageArr,
        reviewUser,

        pageTitle: albumTitleFromSpotifyAPi,
        pageDescription: albumTitleFromSpotifyAPi,
        pageKeywords:pageKeyword
 
       });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
});










//album review create

router.post('/review', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
  
   // await Review.create(req.body)
   const { albumRating, title, status, albumTitle, albumId, thumbnail, user, body, albumReleaseDate } = req.body
   const { discNumber, trackTitle, trackRating } = req.body;




const tracksByDisc = {};


if (Array.isArray(trackTitle)) {
  trackTitle.forEach((track, index) => {
    const [disc, title] = track.split('-'); // Split the track into disc and title
    const discNumber = disc.slice(4); // Extract the disc number (remove "disc" prefix)
    const rating = trackRating[index];

    // Check if the disc number exists in tracksByDisc, if not, create a new entry
    if (!tracksByDisc[discNumber]) {
      tracksByDisc[discNumber] = {
        trackTitles: [],
        trackRatings: [],
      };
    }

    // Push the title to the corresponding disc number in tracksByDisc
    tracksByDisc[discNumber].trackTitles.push(title);
    tracksByDisc[discNumber].trackRatings.push(rating);
  });
} else if (typeof trackTitle === 'string') {
  // Handle the case when trackTitle is a string
  const [disc, title] = trackTitle.split('-');
  const discNumber = disc.slice(4);
  const rating = trackRating; // Assuming trackRating is a single value in this case

  if (!tracksByDisc[discNumber]) {
    tracksByDisc[discNumber] = {
      trackTitles: [],
      trackRatings: [],
    };
  }

  tracksByDisc[discNumber].trackTitles.push(title);
  tracksByDisc[discNumber].trackRatings.push(rating);
} else {
  // Handle other cases as needed
  console.error('Invalid input: trackTitle must be an array or a string');
}






const tracks = Object.keys(tracksByDisc).map((discNumber) => ({
  discNumber: Number(discNumber) + 1,
  trackTitle: tracksByDisc[discNumber].trackTitles,
  trackRating: tracksByDisc[discNumber].trackRatings,
}));




const newReview = new Review({
  albumRating,
  title,
  status,
  albumTitle,
  albumId,
  thumbnail,
  user,
  body,
  tracks,
  albumReleaseDate
});

// Save the review to the database
const savedReview = await newReview.save();



    res.redirect(req.get('referer'));
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})



// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/review/edit/:id', ensureAuth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
    }).lean()

    if (!review) {
      return res.render('error/404')
    }

    if (review.user != req.user.id) {
      res.redirect('/stories')
    } else {
      res.render('album/edit', {
        review,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})


// @desc    Update story
// @route   PUT /stories/:id
router.put('/review/:id', ensureAuth, async (req, res) => {
  try {
    let review = await Review.findById(req.params.id).lean()

    if (!review) {
      return res.render('error/404')
    }

    if (review.user != req.user.id) {
      res.redirect('/stories')
    } else {
      review = await Review.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})







//delete review
router.delete('/review/:id', ensureAuth, async (req, res) => {
  try {
    let reviews = await Review.findById(req.params.id).lean()

    if (!reviews) {
      return res.render('error/404')
    }

    if (reviews.user != req.user.id) {
      res.redirect('/stories')
    } else {
      await Review.remove({ _id: req.params.id })
      res.redirect(req.get('referer'));
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})




module.exports = router
