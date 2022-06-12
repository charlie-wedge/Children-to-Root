const fs = require('fs');
const readline = require('readline');

var rootPath = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.question("Please enter the root target directory: ", function(path) { // ask the user what the root directory is
    path = path.trim();
    rl.close();
    if (!fs.existsSync(path)) { // make sure they've entered a valid path
        console.log("Sorry, that path doesn\'t exist. Please run the script and try again.");
        return;
    }
    rootPath = path;
    console.log("Starting...");
    readFolder(rootPath);
});

function readFolder(folderPath) { // read the files in the folder
    console.log("Reading the files in: " + folderPath);

    fs.readdir(folderPath, (err, files) => { // read the folder's content

        files.forEach(file => { // for every file in the folder..

            if (file.split("")[0] != ".") { // only touch files which aren't hidden. This prevents illegal operation errors when moving to the root
                let filePath = folderPath + "/" + file;
                if (fs.lstatSync(filePath).isDirectory()) { // if it's a folder, we'll stack this function and check that folder too
                    readFolder(filePath);
                }
                else {
                    moveFileToRoot(filePath, file); // move it to the root
                }
            }



        });
    });

}

function moveFileToRoot(originalPath, fileName) { // move the given file to the root directory
    let newPath = rootPath + "/" + fileName;
    fs.rename(originalPath, newPath, function (err) {
        if (err) { // ignore errors (mostly "EISDIR: illegal operation on a directory")
            console.log(err);
            return;
        }
    });
}