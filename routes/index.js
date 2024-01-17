const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')

const User = require('../models/User')
const Comment = require('../models/Comment')
const Review= require('../models/Review')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {

  


  try {
    const stories = await Story.find({ user: req.user.id })
    .sort({ createdAt: 'desc' })
    .lean()

    const reviews = await Review.find({ user: req.user.id })
    .sort({ createdAt: 'desc' })
    .lean()

    const comments = await Comment.find({ user: req.user.id })
    .sort({ createdAt: 'desc' })
    .lean()

    const favorites= Array.from(req.user.favorites.keys())
    const favStories = await Story.find({ _id:favorites }).lean()

    const favoriteReview= Array.from(req.user.favoritesReview.keys())
    const favReviews = await Review.find({ _id:favoriteReview }).lean()

    const category = req.query.category;


    res.render('dashboard', {
      name: req.user.firstName,
     
      stories,
      reviews,
      comments,
    
      favStories,
      favReviews,
      category
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


// api/favorite

router.get('/api/favorites', ensureAuth, async (req, res) => {
  try {
    const favoriteList=req.user.favorites

    const favoriteIds = Array.from(favoriteList.keys());

    
    const result = await Story.find({_id: { $in: favoriteIds }}).lean()

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.post('/api/favorite/:contentId', ensureAuth, async (req, res) => {
  const { contentId } = req.params;
  const { isFavorite } = req.body;
  const userId = req.user.id

  try {
    const user = await User.findById(userId);
 

    if (isFavorite) {

    await Story.findByIdAndUpdate(contentId, { $addToSet: { isFavorite: userId } }, { new: true });
  
    await User.findByIdAndUpdate(userId, { $set: { [`favorites.${contentId}`]: isFavorite } }, { new: true })
    } else {
      user.favorites.delete(contentId);
      
      await Story.findByIdAndUpdate(contentId, { $pull: { isFavorite: userId } }, { new: true });


    }

    await user.save();

    // Send a response indicating success
    res.status(200).json({ success: true });
  } catch (error) {
    // Handle the error and send an error response
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update favorite status' });
  }
});





//favorite/review 


router.post('/api/favorite/review/:contentId',ensureAuth, async (req, res) => {
  const { contentId } = req.params;
  const { isFavorite } = req.body;
  const userId = req.user.id

  try {
    const user = await User.findById(userId);
 
   

    if (isFavorite) {
  
    await Review.findByIdAndUpdate(contentId, { $addToSet: { isFavorite: userId } }, { new: true });
  
    await User.findByIdAndUpdate(userId, { $set: { [`favoritesReview.${contentId}`]: isFavorite } }, { new: true })
    } else {
      user.favoritesReview.delete(contentId);
      
      await Review.findByIdAndUpdate(contentId, { $pull: { isFavorite: userId } }, { new: true });


    }

    await user.save();

    // Send a response indicating success
    res.status(200).json({ success: true });
  } catch (error) {
    // Handle the error and send an error response
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update favorite status' });
  }
});



// review favorites
router.get('/api/favorites/review', ensureAuth, async (req, res) => {
  try {
    const favoriteList=req.user.favoritesReview

    const favoriteIds = Array.from(favoriteList.keys());

    
    const result = await Review.find({_id: { $in: favoriteIds }}).lean()

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});








//comment 


router.post('/api/comments/:storyId', ensureAuth, async (req, res) => {
  const { storyId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const comment = new Comment({
      content,
      user: userId,
      story: storyId,
    });

   
    await comment.save();

    const story = await Story.findByIdAndUpdate(storyId, { $push: { comments: comment._id } }, { new: true });

    res.status(201).json({ success: true, comment, story });


    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to create comment' });
  }
});

// Get comments for a story
router.get('/api/comments/:storyId', ensureAuth, async (req, res) => {
  const { storyId } = req.params;

  try {
    const comments = await Comment.find({ story: storyId }).populate('user');
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch comments' });
  }
});

//delete comment

router.delete('/comments/:id', ensureAuth, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id).lean()
   
    if (!comment) {
      return res.render('error/404')
    }

    if (comment.user != req.user.id) {
      //
      res.redirect('/stories')
    } else {
      await Comment.remove({ _id: req.params.id })
      res.redirect(req.get('referer'));
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})


/////////////////////////////review comment ///////////////////


router.post('/api/comments/review/:reviewId',ensureAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const comment = new Comment({
      content,
      user: userId,
      review: reviewId,
    });

   
    await comment.save();

    const review = await Review.findByIdAndUpdate(reviewId, { $push: { comments: comment._id } }, { new: true });

    res.status(201).json({ success: true, comment, review });


    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to create comment' });
  }
});

// Get comments for a story
router.get('/api/comments/review/:reviewId', ensureAuth, async (req, res) => {
  const { reviewId } = req.params;

  try {
    const comments = await Comment.find({ review: reviewId }).populate('user');
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch comments' });
  }
});

//delete comment

router.delete('/comments/:id', ensureAuth, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id).lean()
  
    if (!comment) {
      return res.render('error/404')
    }

    if (comment.user != req.user.id) {
      //
      res.redirect('/album/review')
    } else {
      await Comment.remove({ _id: req.params.id })
      res.redirect(req.get('referer'));
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})


//////////////// review comment ///////////////////







module.exports = router
