const bodyParser = require('body-parser');
const CORS = require("cors")
const express = require('express');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const EventEmitter = require('events');
const YAML = require('yamljs');
const {PythonShell} = require('python-shell');
const _ = require("lodash")

const config  = require("./config")

const app = express();
app.use(CORS())
app.use(express.static(config.service.publicDir));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const eventEmitter = new EventEmitter();
const swaggerDocument = YAML.load('./jace-ner-api.yaml');

// console.log("ENVIROMENT")
// console.log(
// 	Object.keys(process.env).map( key => `${key}: ${process.env[key]}`).join("\n")
// )

// console.log("CONFIG")
// console.log(JSON.stringify(config, null, " "))


swaggerDocument.info.title = config.yaml[config.service.lang].title
swaggerDocument.info.description = config.yaml[config.service.lang].description
swaggerDocument.host = config.service.host

// console.log(JSON.stringify(swaggerDocument,null," "))

let ner = new PythonShell('ner.py', _.extend( config.python, {args: config.service.lang}));

// let lang_detect = new PythonShell('lang_detect.py', config.python);

var ner_result_storage = {result: null};
var lang_detect_result_storage = {result: null};

// var lang_dict = {
//   "en": en_ner,
//   "ru": ru_ner,
//   "uk": uk_ner
// };

function store(result, storage, event_name) {
	storage.result = result;
	eventEmitter.emit(event_name);
}

ner.on('message', function (message) {
	store(message, ner_result_storage, 'ner_result');
});

// lang_detect.on('message', function (message) {
// 	store(message, lang_detect_result_storage, 'lang_detect');
// });

function clearResults() {
	ner_result_storage.result = null;
	lang_detect_result_storage.result = null;
}

function writeResults(method, text, res) {

		ner.send(JSON.stringify({method, text}), { mode: 'json' });
		eventEmitter.once('ner_result', () => {
		    res.send(ner_result_storage.result);
		});
	

	// lang_detect.send(JSON.stringify( {"text": text}), { mode: 'json' });
	// eventEmitter.once('lang_detect', () => {
 	//    var current_ner = lang_dict[lang_detect_result_storage.result];
	// 	var request_data = {"method": method, "text": text};
	// 	current_ner.send(JSON.stringify(request_data), { mode: 'json' });
	// 	eventEmitter.once('ner_result', () => {
	// 	    res.send(ner_result_storage.result);
	// 	});
	// });
}

app.post("/ner/tokenize", (req, res) => {
  clearResults();
  var text = req.body;
  writeResults('tokenize', text, res);
});

app.post("/ner/tokenize_with_offsets", (req, res) => {
  clearResults();
  var text = req.body;
  writeResults('tokenize_with_offsets', text, res);
});

app.post("/ner/get_possible_ner_tags", (req, res) => {
  clearResults();
  var lang = req.query.lang;
  writeResults('get_possible_ner_tags', lang, res);
});

app.post("/ner/extract_entities", (req, res) => {
  clearResults();
  var text = req.body;
  writeResults('extract_entities', text, res);
});

app.post("/ner/extract_entities_pretty", (req, res) => {
  clearResults();
  var text = req.body;
  writeResults('extract_entities_pretty', text, res);
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument,{customCssUrl:"sw-theme.css"}));

app.listen(config.service.port, () => {
  console.log(`JACE-NER SERVICE for ${config.yaml[config.service.lang].name} language starts on port ${config.service.port} in ${config.service.mode} mode.`);
});
