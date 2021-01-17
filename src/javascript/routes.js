const {PythonShell} = require('python-shell')
const _ = require('lodash')
const config  = require('../../config')
const v4 = require("uuid").v4


let ner = new PythonShell('ner.py', _.extend( config.python, {args: config.service.lang}));

console.log('MODEL HAS BEEN LOADED');


let writeResults = (method, params, res) => {
	params = _.extend(params,{_id:v4()})
	
	let command = {
		lang: config.service.lang,
		method, 
		params
	}
	
	console.log("SEND> ", JSON.stringify(command))

	ner.once("message", message => {
		let data = JSON.parse(message)
		command.result = data.response
		console.log("RECIEVE> ", command)
		res.json(command);
	})
	
	ner.send(JSON.stringify(command), { mode: 'json' });
	
}

module.exports = [
	{
		method: "get",
		path: "/",
		handler: (req, res) => {
			writeResults('get_possible_ner_tags', {}, res);
		}
	},

	{
		method: "get",
		path: "/version",
		handler: (req, res) => {
			writeResults('get_possible_ner_tags', {}, res);
		}
	},

	{
		method: "post",
		path: "/version",
		handler: (req, res) => {
			writeResults('get_possible_ner_tags', {}, res);
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
