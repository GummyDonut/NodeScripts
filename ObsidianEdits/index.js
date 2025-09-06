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
            const re = /Created:(.*)/;
            const result = data.match(re)
            
            // extract regex
            let date = result ? result[1]: ''
            console.log(date.includes(','))
            if (date.includes(',')) {
                date = date.replace(',', '')
            }
        
            // use moment to parse dates
            console.log(date)
            const convertedDate = moment(date.trim(),'LL').format('YYYY-MM-DD')
            console.log('converted:', convertedDate)

            // append content
            const newContent = '---\nCreated: ' + convertedDate + "\n---\n"

            // write the content
            const finalContent = newContent + data
            fs.writeFileSync(filePath, finalContent)

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

