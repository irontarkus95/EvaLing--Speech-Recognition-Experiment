# To launch Experiment
 

1. `run npm install`
    * Installs dependencies. If adding any more packages to node js use :
    `npm install packagename --save`

2. `Run server`
    * In order to not have to refresh the node js server all the time use use `nodemon` in terminal

3. `Making post request to the API's`
    Make post request of the filename to:
    * /watson for the watson api
    * /google for the google api
    * /azure for the azure api
    * /all for simultaneous processing of the api calls

    Make the post request with the file and the firebase key to store the data under.
    file key = "audiofile"
    firebase key = "key"
    sentence key = "phrase"