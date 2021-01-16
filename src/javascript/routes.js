const EventEmitter = require('events')
const {PythonShell} = require('python-shell')
const _ = require('lodash')
const config  = require('../../config')
const v4 = require("uuid").v4

const eventEmitter = new EventEmitter();

let ner = new PythonShell('ner.py', _.extend( config.python, {args: config.service.lang}));

console.log('MODEL HAS BEEN LOADED');

let storage = []

ner.on('message', function (message) {
	let data = JSON.parse(message)
	let stored = _.find(storage, s => data.request.params._id == s.params._id)
	stored.result = data.response
	eventEmitter.emit("ner_result");
});

let writeResults = (method, params, res) => {
	params = _.extend(params,{_id:v4()})
	
	let command = {
		lang: config.service.lang,
		method, 
		params
	}
	
	storage.push(command)
	
	console.log("SEND> ", JSON.stringify(command))
	
	ner.send(JSON.stringify(command), { mode: 'json' });
	
	eventEmitter.once('ner_result', () => {

			let stored = _.find(storage, s => command.params._id == s.params._id)
			let index = _.findIndex(storage, s => command.params._id == s.params._id)
			storage.splice(index,1)
			console.log("RECIEVE> ", stored)
			
			res.json(stored);
	});
}

module.exports = [
	{
		method: "get",
		path: "/version",
		handler: (req, res) => {
			writeResults('get_possible_ner_tags', null, res);
		}
	},

	{
		method: "post",
		path: "/ner/tokenize",
		handler: (req, res) => {
			writeResults(
			  	'tokenize', 
			  	{
					"text": req.body.text || '',
					"offsets": req.body.offsets || false
				}, 
			  	res
			);
		}
	},
	{
		method: "post",
		path: "/ner/extract_entities",
		handler: (req, res) => {
		  	writeResults(
			  	'extract_entities', 
			  	{
					"text": req.body.text || '',
					"tags": req.body.tags || ''
				}, 
			  	res
			);
		}
	}
]
