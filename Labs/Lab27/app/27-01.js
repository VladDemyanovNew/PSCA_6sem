import express from 'express';
import { YandexDriveService } from './yandex-drive.service.js';
import formidable from 'formidable';
import createError from 'http-errors';
import * as fs from 'fs';

const app = express();
app.listen(3000, () => console.log('Server has been started'));

const yandexDriveService = new YandexDriveService();

app.post('/md/:directoryName', async (request, response, next) => {
  await yandexDriveService.createDirectory(request.params.directoryName, next);
  response.end();
});

app.post('/rd/:directoryName', async (request, response, next) => {
  await yandexDriveService.deleteDirectory(request.params.directoryName, next);
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
    await yandexDriveService.uploadFile(request.params.filename, readStream, next);
    return response.send('Successfully uploaded');
  });
});

app.post('/down/:filename', async (request, response, next) => {
  const readStream = await yandexDriveService.downloadFile(request.params.filename, next);
  if (!readStream) {
    response.end();
    return;
  }
  readStream.pipe(response);
});

app.post('/del/:filename', async (request, response, next) => {
  await yandexDriveService.deleteFile(request.params.filename, next);
  response.end();
});

app.post('/copy/:sourceFilename/:destFilename', async (request, response, next) => {
  await yandexDriveService.copyFile(
    request.params.sourceFilename,
    request.params.destFilename,
    next,
  );
  response.end();
});

app.post('/move/:sourceFilename/:destFilename', async (request, response, next) => {
  await yandexDriveService.moveFile(
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