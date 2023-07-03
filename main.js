const express = require('express');
const multer  = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('pdf'), (req, res) => {
  const inputFilePath = req.file.path;
  const outputFilePath = path.join(__dirname, 'public', 'output.pdf');
  const password = req.body.password;

  const command = `qpdf --encrypt ${password} ${password} 256 -- ${inputFilePath} ${outputFilePath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      res.status(500).send('Error executing command');
      return;
    }
    if (stderr) {
      console.error(`Error in qpdf: ${stderr}`);
      res.status(500).send('Error in qpdf');
      return;
    }

    // Delete the uploaded file
    fs.unlink(inputFilePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
      }
    });

    console.log(`PDF successfully encrypted: ${stdout}`);
    // Send the file name back to the client
    res.send('/output.pdf');
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
