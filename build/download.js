const path = require("path")
const axios = require('axios'); 
const url = require('url')
const fs = require('fs')

module.exports = ( fileUrl, path2dest ) => 

	axios.get(fileUrl, {responseType: "stream"} )  
	.then(response => new Promise( (resolve, reject) => {

		let filePath = path.resolve( __dirname, path2dest, path.parse(url.parse(fileUrl).pathname).base)
		let outputStream = fs.createWriteStream(filePath)
		
		response.data.pipe(outputStream);
		
		outputStream.on("close", () => {
			resolve(filePath)
		})
		
		outputStream.on("error", error => {
			reject(error)
		})
	}))
