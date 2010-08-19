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

Clone the Github repository. Update the vendor libraries:

    $> git clone git://github.com/pminnieur/entropy.js.git
    $> sh update_vendors.sh


You can run an entropy instance just by starting it with the `node` command:

    node entropy.js


CONFIGURATION
-------------

Copy the `config.json.sample` file to `config.json` and modify it to fit your
needs.


USAGE
-----

You can use entropy without any models, but I recommend to have a schema for
each of your models. You can put your Mongoose models in the `/models`
directory. Here's an example of an simple user model:

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
REST, just by calling the appropriate URLs. The routing schema is very simple:

### Find

    GET /:collection


### Read

    GET /:collection/:id


### Create
    
    POST /:collection?collection[field1]=value1&collection[field2]=value2...


### Modify

    POST /:collection/:id?collection[field1]=value1&collection[field2]=value2...


### Remove

    DELETE /:collection/:id


> **NOTE:** the `collection[]` array must be named like the model you want to
> access, thus for creating or modifying a user you must use it like this:
> `?user[username]=foo&user[email]=bar`


### Finding documents

You can specifiy what you want to find with the following parameters:

#### Querying

    GET /:collection?query[field1]=value1&query[field2]=value2&...


#### Sorting

    GET /:collection?order[field1]=asc|desc&order[field2]=asc|desc&...


#### Pagination

    GET /:collection?limit=5&offset=5


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
