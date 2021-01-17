const {PythonShell} = require('python-shell')
const _ = require('lodash')
const config  = require('../../config')
const v4 = require("uuid").v4

let Queue = require("queue-promise")
const queue = new Queue({
  concurrent: 1,
  interval: 2
});
 
queue.on("start", () => {
	console.log(`Queue started at ${new Date()}`)
});
queue.on("stop", () => {
	console.log(`Queue stoped at ${new Date()}`)
});
 
queue.on("resolve", data => console.log("task:", data, " resolved"));
queue.on("reject", error => console.error(error));
 
// queue.enqueue(asyncTaskA); // resolved/rejected after 0ms
// queue.enqueue(asyncTaskB); // resolved/rejected after 2000ms
// queue.enqueue(asyncTaskC); // resolved/rejected after 4000ms  


let task = (method, params, res) => () => new Promise((resolve,reject) => {
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
		resolve(command)
	})
	
	ner.send(JSON.stringify(command), { mode: 'json' });

})


let ner = new PythonShell('ner.py', _.extend( config.python, {args: config.service.lang}));

console.log('MODEL HAS BEEN LOADED');


// let writeResults = (method, params, res) => {
// 	params = _.extend(params,{_id:v4()})
	
// 	let command = {
// 		lang: config.service.lang,
// 		method, 
// 		params
// 	}
	
// 	console.log("SEND> ", JSON.stringify(command))

// 	ner.once("message", message => {
// 		let data = JSON.parse(message)
// 		command.result = data.response
// 		console.log("RECIEVE> ", command)
// 		res.json(command);
// 	})
	
// 	ner.send(JSON.stringify(command), { mode: 'json' });
	
// }

module.exports = [
	{
		method: "get",
		path: "/",
		handler: (req, res) => {
			// writeResults('get_possible_ner_tags', {}, res);
			queue.enqueue(task('get_possible_ner_tags', {}, res))
		}
	},

	{
		method: "get",
		path: "/version",
		handler: (req, res) => {
			// writeResults('get_possible_ner_tags', {}, res);
			queue.enqueue(task('get_possible_ner_tags', {}, res))
		}
	},

	{
		method: "post",
		path: "/version",
		handler: (req, res) => {
			// writeResults('get_possible_ner_tags', {}, res);
			queue.enqueue(task('get_possible_ner_tags', {}, res))
		
		}
	},

	{
		method: "post",
		path: "/ner/tokenize",
		handler: (req, res) => {
			queue.enqueue(task(
			  	'tokenize', 
			  	{
					"text": req.body.text || '',
					"offsets": req.body.offsets || false
				}, 
			  	res
			))
		}
	},
	{
		method: "post",
		path: "/ner/extract_entities",
		handler: (req, res) => {
		  	queue.enqueue(task(
			  	'extract_entities', 
			  	{
					"text": req.body.text || '',
					"tags": req.body.tags || ''
				}, 
			  	res
			))
		}
	}
]
