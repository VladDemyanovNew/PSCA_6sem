import express from 'express';
import { GoogleDriveService } from './google-drive.service.js';
import formidable from 'formidable';
import createError from 'http-errors';
import * as fs from 'fs';

const app = express();
app.listen(3000, () => console.log('Server has been started'));

const googleDriveService = new GoogleDriveService();

app.post('/md/:directoryName', async (request, response, next) => {
  await googleDriveService.createDirectory(request.params.directoryName, next);
  response.end();
});

app.post('/rd/:directoryName', async (request, response, next) => {
  await googleDriveService.deleteDirectory(request.params.directoryName, next);
  response.end();
});

app.post('/up/:filename', async (request, response, next) => {
  const form = new formidable.IncomingForm({ uploadDir: './app/files' });
  form.parse(request, async (error, fields, files) => {
    if (error || !files?.file) {
      next(createError(408, 'Can\'t upload file'));
      return;
    }
    const oldPath = files.file.filepath;
    const readStream = fs.createReadStream(oldPath);
    await googleDriveService.uploadFile(request.params.filename, readStream, next);
    return response.send('Successfully uploaded');
  });
});

app.post('/down/:filename', async (request, response, next) => {
  const readStream = await googleDriveService.downloadFile(request.params.filename, next);
  if (!readStream) {
    response.end();
    return;
  }
  readStream.pipe(response);
});

app.post('/del/:filename', async (request, response, next) => {
  await googleDriveService.deleteFile(request.params.filename, next);
  response.end();
});

app.post('/copy/:sourceFilename/:destFilename', async (request, response, next) => {
  await googleDriveService.copyFile(
    request.params.sourceFilename,
    request.params.destFilename,
    next,
  );
  response.end();
});

app.post('/move/:sourceFilename/:destFilename', async (request, response, next) => {
  await googleDriveService.moveFile(
    request.params.sourceFilename,
    request.params.destFilename,
    next,
  );
  response.end();
});

app.use((
  error,
  request,
  response,
  next) => {
  response?.status(error?.status);
  response?.send({ error: error?.message });
});