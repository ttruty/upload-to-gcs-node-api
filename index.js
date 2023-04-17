const formidable = require('formidable');
const { Storage } = require('@google-cloud/storage');
const { createReadStream } = require('fs');
require('dotenv').config();
const cors = require('cors'); // Import the cors library

// Configure CORS options
const corsOptions = {
    origin: '*', // Replace with the appropriate origin or set to '*' to allow all origins
    methods: 'POST',
    allowedHeaders: 'Content-Type, Authorization',
  };

// Replace with your GCS bucket information
const credential = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()
  );
const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: credential.client_email,
      private_key: credential.private_key,
    },
    // keyFilename: process.env.KEY_FILE,
});

const createWriteStream = (filename, bucketName, contentType) => {
    console.log("Creating bucket  for", bucketName);

    const bucket = storage.bucket(bucketName);
    console.log("Creating write stream for", filename);
    const ref = bucket.file(filename);

    const stream = ref.createWriteStream({
        gzip: true,
        contentType: contentType,
    });
    return stream;
};

// Route handler for handling POST requests with file upload
const uploadFile = (req, res) => {
    cors(corsOptions)(req, res, async () => {
        const form = new formidable.IncomingForm({
            keepExtensions: true, 
            multiples: true,
            // Set bodyParser to false to disable request body parsing
            // Note that formidable will still parse the file data
            // so you can access it in the `file` property of the `files` object
            bodyParser: false,
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to parse form data' });
            return;
            }

            const bucket = fields.bucket;
            
            // Get the file from the form data
            const file = files.file;
            console.log(file)

            if (!file) {
            res.status(400).json({ error: 'No file attached' });
            return;
            }

            // Upload the file to GCS
            const stream = await createReadStream(file.filepath)

            .pipe(createWriteStream(file.newFilename, bucket,  file.mimetype))
            .on("finish", () => {
                console.log("File uploaded successfully");
            })
            .on("error", (err) => {
                console.error(err.message);
                res.status(500).json("File upload error: " + err.message);
            });
            const publicUrl = `https://storage.googleapis.com/${bucket}/${file.newFilename}`;
            res.status(200).json(publicUrl);
            // console.log("Stream", stream);
            // res.status(200).json(file.newFilename);

        });
    });
};

// Create your Express app and set up the route for the upload endpoint
const express = require('express');
const app = express();
// Use cors middleware
app.use(cors(corsOptions));

app.post('/upload', uploadFile);

// Start the server
const port = process.env.PORT || 3000; // Replace with your desired port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});