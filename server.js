const bodyParser = require('body-parser');
const CORS = require("cors")
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const config  = require("./config")

const app = express();
app.use(CORS())
app.use(express.static(config.service.publicDir));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require("./src/javascript/routes").forEach( route => {
	app[route.method]( route.path, route.handler)
})

let swaggerDocument = YAML.load('./jace-ner-api.yaml');
swaggerDocument.info.title = config.yaml[config.service.lang].title
swaggerDocument.info.description = config.yaml[config.service.lang].description
swaggerDocument.host = config.service.host
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument,{customCssUrl:"sw-theme.css"}));

app.listen(config.service.port, () => {
  console.log(`JACE-NER SERVICE for ${config.yaml[config.service.lang].name} language starts on port ${config.service.port} in ${config.service.mode} mode.`);
});
