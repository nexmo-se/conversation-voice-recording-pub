
var fs = require('fs');
var files, newname, currentname, date, finalname = '';
files = fs.readdirSync('./public/files');
// REMOVE PRIVATE FILES
files.forEach(function (file) {
    if (file.indexOf('.') == 0) {
        try {
            fs.unlinkSync('./public/files/' + file);
            console.log('deleted private file');
          } catch(err) {
            console.error(err)
          }
    };
});
// RENAME FILES
files = fs.readdirSync('./public/files');
console.log('files', files);
files.forEach(function (file) {
    try {
        finalname = file; // 021-12-03T22:50:47.388Z.mp3
        currentname = './public/files/' + file;
        date = file.substring(11, 19); 
        newname = './public/files/' + date.split(':').join('') + '.mp3';
        fs.renameSync(currentname, newname);
    } catch (error) {
        console.error(error);
    }
})

files = fs.readdirSync('./public/files');
var clips = [],
    // This opens up the writeable stream to finalname
    joined = fs.createWriteStream(`./public/final.mp3`);
files.forEach(function (file) {
    clips.push(file.substring(0, 6));
});

// Sort it by time (hour, minute, seconds)
clips.sort(function (a, b) {
    return a - b;
});

function handleMP3() {
    if (!clips.length) {
        joined.end("Done");
        return;
    };

    // pop off first file in array and save it as currentfile
    currentfile = './public/files/' + clips.shift() + '.mp3';
    // Read that file and write it to recording.mp3
    stream = fs.createReadStream(currentfile);
    // do not end
    stream.pipe(joined, {end: false});
    // listen on end, if end is false then log. Run the program again
    stream.on("end", function() {
        console.log('✅',currentfile + ' appended');
        handleMP3();        
    });
};
handleMP3();