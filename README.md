# Node.js API for File Upload to Google Cloud Storage

This is a Node.js API that accepts POST requests with a Formidable form file and uploads it to a Google Cloud Storage (GCS) bucket. The API is built using Express, Formidable, @google-cloud/storage, and cors libraries.

## Prerequisites

Before you can use this API, make sure you have the following:

- Node.js and npm installed on your machine
- A Google Cloud Storage (GCS) bucket created
- GCS credentials (in JSON format) with write access to the bucket

## Getting Started

1. Clone this repository to your local machine.

```
git clone https://github.com/yourusername/nodejs-gcs-file-upload-api.git
```

2. Install the dependencies.

```
cd nodejs-gcs-file-upload-api
npm install
```

3. Update a .env bucket information and credentials in the `index.js` file.

```
PORT=9000
PROJECT_ID=gcs-name
GOOGLE_SERVICE_KEY=[BASE64 stringified version of the KEY file from gcs]
```
google key is in base64 for ease of loading in vercel (https://github.com/orgs/vercel/discussions/219)

4. Start the API server.

```
node index.js
```

The API server will now be running on http://localhost:3000 by default.

- API Endpoints
- POST /upload

This endpoint accepts a POST request with a Formidable form file attached as the file field in the request body. The API will then upload the file to the GCS bucket specified in the BUCKET_NAME and CREDENTIALS_PATH variables.

Request Body

> file: The file to be uploaded. The file should be attached as a Formidable form file in the request body.
Response

> Success: 200 OK with the public URL of the uploaded file in the response body.

> Failure: 400 Bad Request if no file is attached, 500 Internal Server Error for any other errors.

Resonse

> the public URL for the uplaoded resource

CORS Configuration

- The API has Cross-Origin Resource Sharing (CORS) configured to allow all origins (*) by default. You can modify the CORS options in the corsOptions variable in the index.js file to restrict the allowed origins or methods as needed.

License
This project is licensed under the MIT License.