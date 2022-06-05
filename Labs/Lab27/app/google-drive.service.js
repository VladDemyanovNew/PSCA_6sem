import { createClient } from 'webdav';
import createError from 'http-errors';
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const client = createClient('https://webdav.yandex.ru', {
  username: process.env.YANDEX_DRIVE_LOGIN,
  password: process.env.YANDEX_DRIVE_PASSWORD,
});

export class GoogleDriveService {

  async createDirectory(directoryName, next) {
    const doesDirectoryExist = await client.exists(directoryName);
    if (doesDirectoryExist) {
      return next(createError(408, 'Can\'t create directory, because it already exists'));
    }

    await client.createDirectory(directoryName);
  }

  async deleteDirectory(directoryName, next) {
    const doesDirectoryExist = await client.exists(directoryName);
    if (!doesDirectoryExist) {
      return next(createError(408, 'Can\'t delete directory, because it doesn\'t exist'));
    }

    await client.deleteFile(`/${ directoryName }`);
  }

  async uploadFile(filename, filedata, next) {
    let rs = fs.createReadStream('./app/files/t.txt');
    let ws = client.createWriteStream('t.txt');
    rs.pipe(ws);
  }

  async downloadFile(filename, next) {
    const doesFileExist = await client.exists(filename);
    if (!doesFileExist) {
      return next(createError(404, 'Can\'t download file, because it doesn\'t exist'));
    }
    return client.createReadStream('Горы.jpg');
  }

  async deleteFile(filename, next) {
    const doesFileExist = await client.exists(filename);
    if (!doesFileExist) {
      return next(createError(404, 'Can\'t delete file, because it doesn\'t exist'));
    }
    await client.deleteFile(filename);
  }

  async copyFile(sourceFilename, destFilename, next) {
    const doesFileExist = await client.exists(sourceFilename);
    if (!doesFileExist) {
      return next(createError(404, 'Can\'t copy file, because it doesn\'t exist'));
    }

    await client.copyFile(sourceFilename, destFilename);
  }

  async moveFile(sourceFilename, destFilename, next) {
    const doesFileExist = await client.exists(sourceFilename);
    if (!doesFileExist) {
      return next(createError(404, 'Can\'t move file, because it doesn\'t exist'));
    }

    await client.moveFile(sourceFilename, destFilename);
  }
}