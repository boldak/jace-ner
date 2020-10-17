const EventEmitter = require('events');
const {PythonShell} = require('python-shell');
const _ = require("lodash")
const config  = require("../../config")


let ner = new PythonShell('ner.py', _.extend( config.python, {args: config.service.lang}));

let ner_result_storage = {result: null};
let lang_detect_result_storage = {result: null};


let store = (result, storage, event_name) => {
	storage.result = result;
	eventEmitter.emit(event_name);
}

ner.on('message', function (message) {
	store(message, ner_result_storage, 'ner_result');
});

let clearResults = () => {
	ner_result_storage.result = null;
	lang_detect_result_storage.result = null;
}

let writeResults = (method, text, res) => {

	ner.send(JSON.stringify({method, text}), { mode: 'json' });
	eventEmitter.once('ner_result', () => {
	    res.send(ner_result_storage.result);
	});
}

module.exports = [
	
	{
		method: "post",
		path: "/ner/tokenize",
		handler: (req, res) => {
		  clearResults();
		  var text = req.body;
		  writeResults('tokenize', text, res);
		}
	},

	{
		method: "post",
		path: "/ner/tokenize_with_offsets",
		handler: (req, res) => {
		  clearResults();
		  var text = req.body;
		  writeResults('tokenize_with_offsets', text, res);
		}
	},
	
	{
		method: "post",
		path: "/ner/get_possible_ner_tags",
		handler: (req, res) => {
		  clearResults();
		  var lang = req.query.lang;
		  writeResults('get_possible_ner_tags', lang, res);
		}
	},
	
	{
		method: "post",
		path: "/ner/extract_entities",
		handler: (req, res) => {
		  clearResults();
		  var text = req.body;
		  writeResults('extract_entities', text, res);
		}
	},
	{
		method: "post",
		path: "/ner/extract_entities_pretty",
		handler: (req, res) => {
		  clearResults();
		  var text = req.body;
		  writeResults('extract_entities_pretty', text, res);
		}
	}

]