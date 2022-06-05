import express from 'express';
import { GoogleDriveService } from './google-drive.service.js';
import multer from 'multer';

const app = express();
app.listen(3000, () => console.log('Server has been started'));
app.use(multer().single('file'));

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
  console.log(request.params.filename);
  const filedata = request.file;
  console.log(filedata);
  await googleDriveService.uploadFile(request.params.filename, filedata, next);
  response.end();
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