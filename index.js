const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
var path = require('path');

if (process.env.NODE_ENV == 'test') {
    var env = require('node-env-file');
    env('.env');
}

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

var visualRecognition = new VisualRecognitionV3({
    api_key: process.env.api_key,
    version: '2016-05-20'
});

// default options
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('index');
});
app.post('/upload', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "name") is used to retrieve the uploaded file
    let sampleFile = req.files.img;//value of name in the input tag
    // console.log(sampleFile);
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`./images/${sampleFile.name}`, function (err) {
        if (err)
            return res.status(500).send(err);
        else {
            var params = {
                images_file: fs.createReadStream(`./images/${sampleFile.name}`)
            };
            visualRecognition.classify(params, function (err, processedImg) {
                if (err) {
                    console.log(err);
                } else {
                    var firstGuess = {
                        type: processedImg.images[0].classifiers[0].classes[0].class,
                        score: processedImg.images[0].classifiers[0].classes[0].score * 100
                    };
                    var secondGuess = {
                        type: processedImg.images[0].classifiers[0].classes[1].class,
                        score: processedImg.images[0].classifiers[0].classes[1].score * 100
                    };
                    // var processedImgJson = JSON.stringify(processedImg, null, 2);
                    res.send({
                        message: `it is ${firstGuess.score}% to be a ${firstGuess.type}
                    and ${secondGuess.score}% to be a ${secondGuess.type}`
                    });
                }
            });
        }
        // res.send('File uploaded!');
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000')
})