var fs = require('fs'),
    sys = require('sys'),
    express = require('express'),
    extname = require('path').extname;

var app = express.createServer();

app.use(express.conditionalGet());
app.use(express.methodOverride());

try {
  var cfg = JSON.parse(fs.readFileSync(__dirname+'/config.json').toString());
} catch(e) {
  throw new Error("File config.json not found. Try: 'cp config.json.sample config.json'");
}

if (cfg.debug) {
  app.use(express.errorHandler({
    showStack: true,
    dumpExceptions: true
  }));
}

if (cfg.logger) {
  app.use(express.logger());
}

var mongoose = require('mongoose').Mongoose,
    mongodb = mongoose.connect('mongodb://'+cfg.mongo.host+':'+cfg.mongo.port+'/'+cfg.mongo.name);

require.paths.unshift(__dirname+'/models');
fs.readdir(__dirname+'/models', function(err, files) {
  if (err) {
    throw new Error;
  }

  files.forEach(function(file) {
    if (extname(file) == '.js') {
      require(file.replace('.js', ''));
    }
  });
});

function NotFound(msg) {
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

sys.inherits(NotFound, Error);

app.error(function(err, req, res, next) {
  if (err instanceof NotFound) {
    res.send('404 Not found', 404);
  } else {
    next(err);
  }
});

app.error(function(err, req, res) {
  res.send('500 Internal server error', 500);
});

// HELLO
app.get('/', function(req, res, next) {
  res.send('200 OK', 200);
});

// FIND
app.get('/:collection', function(req, res, next) {
  var col = mongodb.model(req.param('collection'));

  col.find().all(function(docs) {
    var ret = [];
    docs.forEach(function(doc) {
      ret.push(doc.toObject());
    });

    res.header('Content-Type', 'application/json');
    res.send(ret, 200);
  });
});

// READ
app.get('/:collection/:id', function(req, res, next) {
  var col = mongodb.model(req.param('collection'));

  col.findById(req.param('id'), function(doc) {
    if (!doc) {
      next(new NotFound);
    } else {
      res.header('Content-Type', 'application/json');
      res.send(doc.toObject(), 200);
    }
  });
});

// CREATE
app.post('/:collection', function(req, res, next) {
  var col = mongodb.model(req.param('collection')),
      doc = new col;

  doc.merge(req.param(req.param('collection')));

  doc.save(function() {
    res.send(doc.toObject(), 201);
  });
});

// MODIFY
app.post('/:collection/:id', function(req, res, next) {
  var col = mongodb.model(req.param('collection'));

  col.findById(req.param('id'), function(doc) {
    if (!doc) {
      next(new NotFound);
    } else {
      doc.merge(req.param(req.param('collection')));

      doc.save(function() {
        res.send(doc.toObject(), 201);
      });
    }
  });
});

// REMOVE
app.del('/:collection/:id', function(req, res, next) {
  var col = mongodb.model(req.param('collection'));

  col.findById(req.param('id'), function(doc) {
    if (!doc) {
      next(new NotFound);
    } else {
      doc.remove(function() {
        res.send(doc.toObject(), 200);
      });
    }
  });
});

app.listen(cfg.server.port /* , cfg.server.addr */);
