README
======

entropy is a simple [RESTful][1] server in front of a [MongoDB][2] instance
using [node.js][3], [Express][4] and [Mongoose][5].

DEPENDENCIES
------------

* [node.js][3]
* [Express][4]
* [Mongoose][5]

INSTALLATION
------------

Clone the Github repository. Initialize and update the git submodules:

    git submodule init --recursive
    git submodule update --recursive


You can run an entropy instance just by starting it with the `node` command:

    node entropy.js


CONFIGURATION
-------------

Copy the `config.json.sample` file to `config.json` and modify it to fit your
needs.


USAGE
-----

You can put your Mongoose models in the `/models` directory. Here's an example
of an simple user model:

    // models/user.js
    var mongoose = require("mongoose").Mongoose;

    mongoose.model("user", {
      properties: ["username", "email"],
      cast: {
        username: String,
        email: String
      },
      indexes: ["username", "email"]
    });


That's it. You can now find, read, create, modify and remove user objects via
REST, just by calling the appropriate URLs:

    GET localhost:3000/user // find
    GET localhost:3000/user/1 // read
    POST localhost:3000/user?user[username]=foo&user[email]=bar // create
    POST localhost:3000/user/1?user[username]=foo&user[email]=bar // modify
    DELETE localhost:3000/user/1 // remove

CUSTOMIZATION
-------------

If you want to overload the default behavior of the REST controllers, simply
put your own in the `/controllers` directory. Here's an example for a customized
user controller which removes users' email address from the response:

    // controllers/user.js
    var app = modules.parent.exports.app,
        db = modules.parent.exports.db;
        
    app.get('/user', function(req, res) {
      db.model('user').find().all(function(users) {
        ret = [];
        users.forEach(function(user) {
          user = user.toObject();
          delete user.email;
          ret.push(user);
        });

        res.header('Content-Type', 'application/json');
        res.send(ret, 200);
      })
    });


LICENSE
-------

For the full copyright and license information, please view the `LICENSE` file
that was distributed with this source code.


[1]: http://en.wikipedia.org/wiki/Representational_State_Transfer
[2]: http://www.mongodb.org/
[3]: http://nodejs.org/
[4]: http://expressjs.com/
[5]: http://www.learnboost.com/mongoose/
