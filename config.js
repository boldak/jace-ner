const path = require("path")

module.exports = {
	
	mode: process.env.NODE_ENV || "development", // production (heroku NODE_ENV variable) or development
	
	lang: process.env.NER_LANG || "uk",

	models: {
		destDir: path.resolve( __dirname, './MITIE-models'),
		source:{
			en: {
				name:'English',
				url: "https://github.com/jace-developer/MITIE-models/raw/main/en_model.zip"
			},

			uk: {
				name:'Ukrainian',
				url:'https://github.com/jace-developer/MITIE-models/raw/main/uk_model.zip'
			},

			ru: {
				name:'Russian',
				url:'https://github.com/jace-developer/MITIE-models/raw/main/ru_model.zip'
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



