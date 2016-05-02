
/**
 * @swagger
 * resourcePath: /apiJs
 * description: All about API using JavaScript annotations
 */

/**
 * @swagger
 * path: /loginJs
 * operations:
 *   -  method: POST
 *      summary: Login with username and password
 *      notes: Returns a user based on username
 *      type: User
 *      nickname: login
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: username
 *          description: Your username
 *          paramType: query
 *          required: true
 *          type: string
 *        - name: password
 *          description: Your password
 *          paramType: query
 *          required: true
 *          type: string
 */
exports.login = function *() {
  var user = {}
    , query = this.request.query;

  user.username = query.username;
  user.password = query.password;

  this.body = user;
};

/**
 * @swagger
 * models:
 *   User:
 *     id: User
 *     properties:
 *       username:
 *         type: String
 *       password:
 *         type: String
 */