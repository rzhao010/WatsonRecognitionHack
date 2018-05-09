const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
var path = require('path');

// default options
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    console.log(sampleFile);
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`./images/${sampleFile.name}`, function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

app.listen(3000, ()=>{
    console.log('listning')
})