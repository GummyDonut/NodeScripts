const commandLineArgs = require('command-line-args')
const fs = require('fs');
const path = require('path');
const moment = require('moment');


const readDirectory = (directory)=> {

    const files = fs.readdirSync(directory);

    files.forEach((file) => {
        const filePath = path.join(directory, file)
        const stat = fs.statSync(filePath)
    
        // recursively call the directories
        if (stat.isDirectory()) {
            readDirectory(filePath)
        } 
        
        // we only care about the .md files
        else if (file.endsWith(".md")) {

            // read the contents
            console.log("-------------------------")
            console.log('Reading the file: ' + file)
            const data = fs.readFileSync(filePath, 'utf8')
    
            // parse the content date
            const re = /Created:(.*)/g;
            const result = data.match(re)

            if (result && result[0] && result[0].includes('Invalid date')) {
                return //continue
            } else if(result && result.length > 1) {
                const newData = data.replace(result[1], '')
                fs.writeFileSync(filePath, newData)
            }

        }
    });
}


// setup our command line options
const optionDefinitions = [
    { name: 'containerPath', alias: 'c', type: String, defaultOption: true }, // does not need the param indicator normally
]

const options = commandLineArgs(optionDefinitions)

// we want to go through the container file loop through all file types

readDirectory(options.containerPath)

