const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const KEYFILEPATH = path.join(__dirname, '../../GDrive_apikeys.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

async function listFiles() {
  try {
    const response = await drive.files.list({
      pageSize: 10,
      fields: 'files(id, name)',
    });
    //console.log('Files:', response.data.files);
  } catch (error) {
    console.error('Error listing files:', error);
  }
}

listFiles();

async function uploadFile(filePath) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: path.basename(filePath),
        mimeType: 'image/jpeg',
        parents: ["15W1nusubkWsL154O0lLt1T8V3HmDC7m0"],
      },
      media: {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(filePath),
      },
    });
    return response.data.id;
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
}

async function generatePublicUrl(fileId) {
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const result = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink',
    });
    return result.data.webViewLink;
  } catch (error) {
    console.error('Error generating public URL:', error);
    throw error;
  }
}

module.exports = { uploadFile, generatePublicUrl };