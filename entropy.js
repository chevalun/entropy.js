var fs  = require("fs"),
	sys = require("sys");

var express = require("express"),
	connect = require("connect");

var entropy = express.createServer();

entropy.use(connect.conditionalGet());
entropy.use(connect.methodOverride());

try {
	configJSON = fs.readFileSync(__dirname+"/config.json");
} catch(e) {
	sys.log("File config.json not found. Try: `cp config.json.sample config.json`");
}
var config = JSON.parse(configJSON.toString());

if (config.debug) {
	entropy.use(connect.errorHandler({
		showStack: true,
		dumpExceptions: true
	}));
}

if (config.logger) {
	entropy.use(connect.logger());
}

var mongoose = require("mongoose").Mongoose,
	mongodb  = mongoose.connect("mongodb://"+config.mongo.host+":"+config.mongo.port+"/"+config.mongo.name);

// FIND
entropy.get("/:collection", function(req, res) {
	res.send("find:"+req.param("collection"), 200);
});

// READ
entropy.get("/:collection/:id", function(req, res) {
	res.send("read:"+req.param("collection")+"/"+req.param("id"), 200);
});

// CREATE
entropy.post("/:collection", function(req, res) {
	res.send("create:"+req.param("collection"), 201);
});

// MODIFY
entropy.post("/:collection/:id", function(req, res) {
	res.send("modify:"+req.param("collection")+"/"+req.param("id"), 200);
});

// REMOVE
entropy.del("/:collection/:id", function(req, res) {
	res.send("remove:"+req.param("collection")+"/"+req.param("id"), 200);
});

entropy.listen(config.server.port, config.server.addr);
