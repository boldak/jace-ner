
const elegantSpinner = require('elegant-spinner');
const logUpdate = require('log-update');
const chalk = require("chalk")
const unzip = require("./unzip")
const download = require("./download")
const fs = require("fs").promises
const fse = require("fs-extra")
const path = require("path")
const os = require("os")
let frame = elegantSpinner();


let config = require("../config")


// console.log(JSON.stringify(config, null, " "))

console.log(`JACE-NER SERVICE POSTINSTALL IN ${config.mode} MODE`)
console.log(`Install MITIE NER model for ${config.models.source[config.lang].name} language`)

let tempDirectory = ''

fs.mkdtemp(path.join(os.tmpdir(), 'MITIE-'))
	
	.then( dir => {
		console.log(`Create temp directory ${dir}`)
		tempDirectory = dir
		return dir
	})
	
	.then( tempDir => {
		if(config.models.source[config.lang].url){
			console.log(`Download ${config.models.source[config.lang].url.join("\n")}`);
			return download(config.models.source[config.lang].url, tempDir, config.models.source[config.lang].dest)
		}
		if(config.models.source[config.lang].file) return new Promise( resolve => { resolve(config.models.source[config.lang].file)})
			
	})
	
	.then( filePath => {
		console.log(`Create model directory ${config.models.destDir}`)
		return fse.mkdirs(config.models.destDir).then( () => filePath )
	})

	.then( filePath => {
		console.log(`Extract model into ${config.models.destDir}`);
		return unzip(filePath, config.models.destDir)
	})

	.then( () => {
		console.log(`Remove temp ${tempDirectory}`)
		fse.remove(tempDirectory)
	})
	
	// .then( () => {
	// 	console.log(`Remove temp ${config.models.source.en.file}`)
	// 	fse.remove(config.models.source.en.file)
	// })

	.then( () => {
		console.log(chalk.green(`NER Model for ${config.models.source[config.lang].name} language is installed into ${config.models.destDir}`))
	})

	.then(() => {
		if( config.mode == "development"){
			console.log("Install MITIE")
			let installer = require('execa')("pip", "install -r requirements.txt".split(" "))
			let stream = installer.stdout;
		    stream.pipe(process.stdout);
			return installer	
		}
	})
  	
  	.catch( e => {
  		console.log(chalk.red(e.toString()))
  	});
