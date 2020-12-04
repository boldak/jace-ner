# Requirements (local use)

npm v.6.13.4
node v.12.16.1
python v.3.8.6

# How to run (local, dev)

npm install
npm run dev

Standard configuration (file config.js)
lang: "en"
host: "localhost"
port: "3001"

# How to deploy (heroku, via CLI, foe lang='en')

1. Create app.
heroku create -a jace-ner-en
2. Add buildpacks:
- heroku/nodejs
- heroku/python
3. Set language.
heroku config:set -a jace-ner-en NER_LANG=en
4. Deploy!
git push https://git.heroku.com/jace-ner-en.git HEAD:master
