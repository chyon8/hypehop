

const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story')
const Comment = require('../models/Comment')
const User = require('../models/User')
const Review = require('../models/Review')

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add')
})

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Story.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all stories
// @route   GET /stories
router.get('/', async (req, res) => {
  try {

   
    const page = req.query.page || 1;
    const perPage = 10; // Adjust this according to your needs

   
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()



      const today = new Date();
      today.setUTCHours(23, 59, 59, 999); // Set the time to the beginning of the day
      
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setUTCDate(oneWeekAgo.getUTCDate() - 7);
     
      const storiesRank = await Story.aggregate([
        {
          $match: {
            status: 'public',
            createdAt: { $gte: oneWeekAgo, $lte: today}
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

  



   

   const commentCounts = await Comment.aggregate([
    {
      $group: {
        _id: '$story',
        commentCount: { $sum: 1 },
      },
    },
  ]);


  const commentCountMap = new Map(commentCounts.map(({ _id, commentCount }) => [String(_id), commentCount]));

  // Add the comment count to each story
  const storiesWithCommentCounts = stories.map(story => ({
    ...story,
    commentCount: commentCountMap.get(String(story._id)) || 0,
  }));
      


  
    res.render('stories/index', {
      user: req.user,
     stories :storiesWithCommentCounts,
    
      storiesRank,
      pageTitle: '하입합 | hype-hop',
 pageDescription: '앨범 리뷰 평점 커뮤니티',
 pageKeywords:"하입합, hypehop, 앨범 리뷰, 힙합, 음악, 차트, 앨범 차트, 힙합 차트, 앨범, 앨범 평점"

 

   
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


//api infinite infinite scroll

router.get('/api/scroll', async (req, res) => {
  try {
 
    const page = req.query.page || 1;
    const perPage = 10; // Adjust this according to your needs

   
    const storiesInfinite = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()


    res.json(storiesInfinite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//api infinite scroll





let view = 0


// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean()
    let comments = await Comment.find({story :req.params.id}).populate('user').lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user._id != req.user.id && story.status == 'private') {
      res.render('error/404')
    } else {
      await Story.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { view: 1 } }, // Increment the 'view' field by 1
        {
          new: true,
          runValidators: true,
        }
      );
    console.log(story)
      res.render('stories/show', {
        story,
        comments,
        userId: req.user._id,
        userDisplayName : req.user.displayName,
        userImage : req.user.image,
        pageTitle: story.title,
 pageDescription: '앨범 리뷰 평점 커뮤니티',
 pageKeywords:"하입합, hypehop, 앨범 리뷰, 힙합, 음악, 차트, 앨범 차트, 힙합 차트, 앨범, 앨범 평점"
       

      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      res.render('stories/edit', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
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



// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      await Story.remove({ _id: req.params.id })
      res.redirect(req.get('referer'));
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
   

    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()


      const reviews = await Review.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()


        const category = req.query.category;

    res.render('stories/moreFromUser', {
      stories,
      reviews,
      category,
      users:req.params.userId,
     
      
      
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router


