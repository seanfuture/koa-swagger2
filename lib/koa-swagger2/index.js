var koa = require('koa');
var mount = require('koa-mount');
var serve = require('koa-static');
var route = require('koa-route');
var _ = require('underscore');

/**
 * init swagger
 * @api    public
 * @param  {Object} app
 * @param  {Object} opt
 * @return {Function}
 */
function init(opt) {
  var Spec;

  var app = koa()

  app.use(function *(next) {
    if (this.path === opt.swaggerURL) { // koa static barfs on root url w/o trailing slash
      this.redirect(this.path + '/');
    } else {
      yield next;
    }
  });

  // get version specific swagger initializer
  try {
    Spec = require('./spec-v' + (opt.swaggerVersion || opt.swagger) +'.js');
  } catch (err) {
    throw new Error('Invalid swaggerVersion/swagger option: ' + (opt.swaggerVersion || opt.swagger));
  }

  var spec = new Spec(opt);

  if (spec.swaggerURL && opt.swaggerUI !== false) {

    // Serve up swagger ui interface.
    app.use(mount(opt.swaggerURL, serve(opt.swaggerUI)));

    // // Serve up swagger ui interface.
    // var swaggerURL = new RegExp('^\\' + spec.swaggerURL + '(\/.*)?$');

    // app.get(opt.swaggerURL, function(req, res, next) {
    //     res.header('Location', opt.swaggerURL + '/index.html?url=' + spec.swaggerJSON);
    //     res.send(301);
    //     next();
    // });

    // app.get(swaggerURL, restify.serveStatic({
    //   directory: opt.swaggerUI || (__dirname + '/../../public'),
    //   default: "index.html"
    // }));

  }

  var swaggerJSON = function *(resourceName) {
    var result = spec.getDescription();

    if (resourceName) {
      var resource = resources['/' + resourceName];

      if (!resource) {
        this.status = 404;
        return;
      }

      result.resourcePath = resource.resourcePath;
      result.apis = resource.apis;
      result.models = resource.models;
    } else {
      result.apis = _.map(result.apis, function (api) {
        return {
          path: opt.swaggerJSON + api.resourcePath,
          description: api.description
        };
      });
    }

    this.body = result;
  };

  var regex = new RegExp('^' + spec.swaggerJSON + '(\/.*)?$');
  app.use(route.get( regex, swaggerJSON ));

  // app.use(route.get(opt.fullSwaggerJSONPath + '/:resourceName*', swaggerJSON));

  return mount(app, '/');

  // app.get(regex,
  //     ((_.isFunction(opt.middleware) || _.isArray(opt.middleware)) && opt.middleware) || [],
  //     function (req, res, next) {
  //       spec.getDescription(req, function(description) {
  //         if (!description) res.send(404);
  //         else res.send(200, description);
  //         next();
  //       });
  //     }
  //   );

}

exports = module.exports = {
  init: init
};
