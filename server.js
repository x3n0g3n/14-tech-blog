const path = require('path'),
      express = require('express'),
      session = require('express-session'),
      exphbs = require('express-handlebars'),
      routes = require('./controllers'),
      helpers = require('./utils/helpers'),
      sequelize = require('./config/connection'),
      SequelizeStore = require('connect-session-sequelize')(session.Store),
      app = express(),
      PORT = process.env.PORT || 3001,
      hbs = exphbs.create({ helpers }),
      sess = {
        secret: process.env.SECRET, // secret used to sign the session ID cookie
        cookie: {
          maxAge: 1800000, // session expiration in milliseconds (30 minutes)
        },
        resave: false, // forces the session to be saved back to the session store, even if it hasn't been modified
        saveUninitialized: true, // forces a session that is "uninitialized" to be saved to the store
        store: new SequelizeStore({
          db: sequelize // sequelize database connection
        })
      };
      
// Use the session middleware
app.use(session(sess));
// configure the view engine to use Handlebars templates
app.engine('handlebars', hbs.engine); 
// set the default view engine to handlebars
app.set('view engine', 'handlebars'); 
// parse incoming requests with JSON payloads
app.use(express.json()); 
// parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true })); 
// serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public'))); 
// mount the routes from the controllers file
app.use(routes); 

// sync sequelize models and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});