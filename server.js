const bodyParser = require('body-parser')
const express = require('express')

const config  = require('./config')

const app = express();
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("./src/javascript/routes").forEach( route => {
	app[route.method](route.path, route.handler)
})

app.listen(config.service.port, () => {
  console.log(`JACE-NER SERVICE for ${config.service.lang} language starts on port ${config.service.port} in ${config.service.mode} mode.`);
});
