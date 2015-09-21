
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var campaignController = require('../app/controllers/campaignController');
var campaignRegisterController = require('../app/controllers/campaignRegisterController');

/**
 * Expose
 */

module.exports = function (app, passport) {

  app.get('/', function(req, res) {
    res.render('login', {
      logged: req.isAuthenticated(),
      user : req.user 
    });   
  });

  app.get('/users', function(req, res) {
    res.render('users', {
        title:'users',
        users:[],
        count: 1
    });   
  });

  app.get('/analytics', function(req, res) {
    res.render('analytics', {
        title:'analytics',
        users:[],
        count: 1
    });   
  });

  /*===CAMPAIGN CRUD===*/
  app.post('/campaign',campaignController.createCampaign);
  app.get('/campaign/:id',campaignController.readCampaignById);
  app.put('/campaign/:id',campaignController.updateCampaign);
  app.delete('/campaign/:id',campaignController.deleteCampaign);

  /*===CAMPAIGN REGISTER===*/
  app.post('/register',campaignRegisterController.createCampaignRegister);
  app.get('/register/:id',campaignRegisterController.readCampaignRegisterById);
  app.put('/register/:id',campaignRegisterController.updateCampaignRegister);
  app.delete('/register/:id',campaignRegisterController.deleteCampaignRegister);

  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
