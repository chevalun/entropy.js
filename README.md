README
======

entropy is a simple [RESTful][1] server in front of a [MongoDB][2] instance
using [node.js][3], [Express][4], [Connect][5] and [Mongoose][6].

DEPENDENCIES
------------

* [node.js][3]
* [Express][4]
* [Connect][5]
* [Mongoose][6]

INSTALLATION
------------

Clone the Github repository or simply download the sources. You can run an
entropy instance just by starting it with the `node` command:

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
    


LICENSE
-------

For the full copyright and license information, please view the `LICENSE` file
that was distributed with this source code.


[1]: http://en.wikipedia.org/wiki/Representational_State_Transfer
[2]: http://www.mongodb.org/
[3]: http://nodejs.org/
[4]: http://expressjs.com/
[5]: http://senchalabs.github.com/connect/
[6]: http://www.learnboost.com/mongoose/
[7]: http://npmjs.org/
