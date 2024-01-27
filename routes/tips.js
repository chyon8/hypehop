const express = require('express')
const router = express.Router()


router.get('/roadmap', (req, res) => {
  res.render('tips/roadmap', {
    
  })
})




module.exports = router

