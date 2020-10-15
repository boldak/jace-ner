# jace-nlp
Natural Languages Processing Service

Prerequisite (will be handled by Docker)
==
* node = v12.16.1
* npm = 6.13.4
* mitie models (./MITIE-models folder) is handled by git lfs now
* python = 3.8.6
  * python should be installed on path: 'C:/Apps/Python/Python38/python.exe' (only 64-bit version).
If path is another, than change it appropriately in server.js file (python_options.pythonPath)
  * pip install git+https://github.com/mit-nlp/MITIE.git
  * pip install langdetect

How to run
==
* npm install
* npm run start
