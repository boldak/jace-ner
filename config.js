const path = require("path")

module.exports = {
	
	mode: process.env.NODE_ENV || "development", // production (heroku NODE_ENV variable) or development
	
	lang: process.env.NER_LANG || "en",

	models: {
		destDir: path.resolve( __dirname, './MITIE-models'),
		source:{
			en: {
				name:'English',
				url: "https://github.com/boldak/jace-ner/blob/master/build/data/en_model.zip?raw=true"
				// file: path.resolve( __dirname, './build/data/en_model.zip')
			},

			uk: {
				name:'Ukrainian',
				url:'https://lang.org.ua/static/downloads/ner_models/uk_model.dat.bz2'
			},

			ru: {
				name:'Russian',
				url:'https://lang.org.ua/static/downloads/ner_models/ru_model.dat.bz2'
			}
		}
	},
	
	python: {
		mode: 'text',
		encoding: 'utf8',
		pythonOptions: ['-u'],
		scriptPath: './src/python/',
		pythonPath:   (process.env.NODE_ENV && process.env.NODE_ENV == "production") ? 'python' : 'python.exe' // process.env.PYTHONPATH // (process.env.PYTHONPATH || '')+'/'+'python' //'C:/Apps/Python/python.exe' //'C:/Users/bolda/AppData/Local/Programs/Python/Python38/python.exe' //'C:/Apps/Python/Python38/python.exe'
	},
	
	port: process.env.PORT || 3000

}
