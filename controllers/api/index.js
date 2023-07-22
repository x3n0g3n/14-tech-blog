const router = require('express').Router(),
      authRoutes = require('./authRoutes'),
      commentRoutes = require('./commentRoutes'),
      blogRoutes = require('./blogRoutes');

router.use('/auth', authRoutes);
router.use('/comment', commentRoutes);
router.use('/blog', blogRoutes);

module.exports = router;
