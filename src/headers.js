/**
 * This should only be needed in development, so this being insecure isn't a big problem.
 *
 * I'm not to well versed in all of this though, but I'll definitely look into this
 * more before pushing anything into production.
 */
exports.headers = function (req, res, next) {

  // Websites who can connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  // Methods to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // If I need cookies/sessions
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
}