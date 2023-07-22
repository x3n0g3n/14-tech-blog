// initialize variables
const router = require('express').Router(),
      apiRoutes = require('./api'),
      appRoutes = require('./appRoutes');
      
// set the route path for appRoutes
router.use('/', appRoutes);
// set the route path for apiRoutes
router.use('/api', apiRoutes);

// export the routes
module.exports = router;
