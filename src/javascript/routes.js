const EventEmitter = require('events')
const {PythonShell} = require('python-shell')
const _ = require('lodash')
const config  = require('../../config')

const eventEmitter = new EventEmitter();

let ner = new PythonShell('ner.py', _.extend( config.python, {args: config.service.lang}));

console.log('MODEL HAS BEEN LOADED');

let ner_result_storage = {lang: config.service.lang, result: null};

let store = (result, storage, event_name) => {
	storage.result = result;
	eventEmitter.emit(event_name);
}

ner.on('message', function (message) {
	store(message, ner_result_storage, 'ner_result');
});

let clearResults = () => {
	ner_result_storage.result = null;
}

let writeResults = (method, params, res) => {
	console.log("SEND> ", JSON.stringify({method, params}))
	ner.send(JSON.stringify({method, params}), { mode: 'json' });
	eventEmitter.once('ner_result', () => {
			console.log("RECIEVE> ", ner_result_storage)
			ner_result_storage.result = JSON.parse(ner_result_storage.result);
	    res.json(ner_result_storage);
	});
}

module.exports = [
	{
		method: "get",
		path: "/version",
		handler: (req, res) => {
		  clearResults();
			writeResults('get_possible_ner_tags', null, res);
		}
	},

	{
		method: "post",
		path: "/ner/tokenize",
		handler: (req, res) => {
		  clearResults();
			let params = {
				"text": req.body.text,
				"offsets": req.body.offsets
			};
		  writeResults('tokenize', params, res);
		}
	},
	{
		method: "post",
		path: "/ner/extract_entities",
		handler: (req, res) => {
		  clearResults();
			let params = {
				"text": req.body.text,
				"tags": req.body.tags
			};
		  writeResults('extract_entities', params, res);
		}
	}
]
