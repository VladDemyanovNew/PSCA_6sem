import url from 'url';
import { Auditorium, AuditoriumType, Faculty, Pulpit, Subject } from './entities.js';
import { DB } from './db.js';
import fs from 'fs';

export class HttpHandler {

    static onGet(request, response) {
        const path = url.parse(request.url).pathname;

        switch (path) {
            case '/':
                fs.readFile('./hello.html', (error, data) => {
                    if (error) {
                        HttpHandler.onError(response, error.code, error.message);
                    } else {
                        response.writeHead(200, { 'Content-Type' : 'text/html' });
                        response.end(data);
                    }
                });
                break;
            case '/api/faculties':
                Faculty.findAll().then(faculties => {
                    response.writeHead(200, { 'Content-Type' : 'application/json' });
                    response.end(JSON.stringify(faculties));
                }).catch(error => {
                    HttpHandler.onError(response, 500, error.message);
                });
                break;
            case '/api/pulpits':
                Pulpit.findAll().then(pulpits => {
                    response.writeHead(200, { 'Content-Type' : 'application/json' });
                    response.end(JSON.stringify(pulpits));
                }).catch(error => {
                    HttpHandler.onError(response, 500, error.message);
                });
                break;
            case '/api/subjects':
                Subject.findAll().then(subjects => {
                    response.writeHead(200, { 'Content-Type' : 'application/json' });
                    response.end(JSON.stringify(subjects));
                }).catch(error => {
                    HttpHandler.onError(response, 500, error.message);
                });
                break;
            case '/api/auditoriumstypes':
                AuditoriumType.findAll().then(auditoriums_types => {
                    response.writeHead(200, { 'Content-Type' : 'application/json' });
                    response.end(JSON.stringify(auditoriums_types));
                }).catch(error => {
                    HttpHandler.onError(response, 500, error.message);
                });
                break;
            case '/api/auditoriums':
                Auditorium.findAll().then(auditoriums => {
                    response.writeHead(200, { 'Content-Type' : 'application/json' });
                    response.end(JSON.stringify(auditoriums));
                }).catch(error => {
                    HttpHandler.onError(response, 500, error.message);
                });
                break;
            default:
                HttpHandler.onError(response, 404, 'Not found');
                break;
        }
    }

    static onPost(request, response) {
        const path = url.parse(request.url).pathname;

        switch (path) {
            case '/api/faculties':
                let facultyCreateData = '';

                request.on('data', chunk => {
                    facultyCreateData += chunk;
                });

                request.on('end', async () => {
                    const faculty = JSON.parse(facultyCreateData);

                    DB.createFaculty(faculty).then(task => {
                        response.writeHead(200, { 'Content-Type' : 'application/json' });
                        response.end(JSON.stringify(task.dataValues));
                    }).catch(error => {
                        HttpHandler.onError(response, 500, error.message);
                    });
                });
                break;
            case '/api/pulpits':
                let pulpitCreateData = '';

                request.on('data', chunk => {
                    pulpitCreateData += chunk;
                });

                request.on('end', async () => {
                    const pulpit = JSON.parse(pulpitCreateData);

                    DB.createPulpit(pulpit).then(task => {
                        response.writeHead(200, { 'Content-Type' : 'application/json' });
                        response.end(JSON.stringify(task.dataValues));
                    }).catch(error => {
                        HttpHandler.onError(response, 500, error.message);
                    });
                });
                break;
            case '/api/subjects':
                let subjectCreateData = '';

                request.on('data', chunk => {
                    subjectCreateData += chunk;
                });

                request.on('end', async () => {
                    const subject = JSON.parse(subjectCreateData);

                    DB.createSubject(subject).then(task => {
                        response.writeHead(200, { 'Content-Type' : 'application/json' });
                        response.end(JSON.stringify(task.dataValues));
                    }).catch(error => {
                        HttpHandler.onError(response, 500, error.message);
                    });
                });
                break;
            case '/api/auditoriumstypes':
                let auditoriumTypeCreateData = '';

                request.on('data', chunk => {
                    auditoriumTypeCreateData += chunk;
                });

                request.on('end', async () => {
                    const auditoriumType = JSON.parse(auditoriumTypeCreateData);

                    DB.createAuditoriumType(auditoriumType).then(task => {
                        response.writeHead(200, { 'Content-Type' : 'application/json' });
                        response.end(JSON.stringify(task.dataValues));
                    }).catch(error => {
                        HttpHandler.onError(response, 500, error.message);
                    });
                });
                break;
            case '/api/auditoriums':
                let auditoriumCreateData = '';

                request.on('data', chunk => {
                    auditoriumCreateData += chunk;
                });

                request.on('end', async () => {
                    const auditorium = JSON.parse(auditoriumCreateData);

                    DB.createAuditorium(auditorium).then(task => {
                        response.writeHead(200, { 'Content-Type' : 'application/json' });
                        response.end(JSON.stringify(task.dataValues));
                    }).catch(error => {
                        HttpHandler.onError(response, 500, error.message);
                    });
                });
                break;
            default:
                HttpHandler.onError(response, 404, 'Not found');
                break;
        }
    }

    static onPut(request, response) {
        const path = url.parse(request.url).pathname;

        switch (path) {
            case '/api/faculties':
                let facultyUpdateData = '';

                request.on('data', (chunk) => {
                   facultyUpdateData += chunk;
                });

                request.on('end', () => {
                    facultyUpdateData = JSON.parse(facultyUpdateData);

                    DB.updateFaculty(facultyUpdateData).then(() => {
                        response.writeHead(200, { 'Content-Type' : 'application/json' });
                        response.end(JSON.stringify(facultyUpdateData));
                    }).catch(error => {
                        HttpHandler.onError(response, 500, error.message);
                    });
                });
                break;
            case '/api/pulpits':
                let pulpitUpdateData = '';

                request.on('data', (chunk) => {
                    pulpitUpdateData += chunk;
                });

                request.on('end', () => {
                    pulpitUpdateData = JSON.parse(pulpitUpdateData);

                    DB.updatePulpit(pulpitUpdateData).then(() => {
                        response.writeHead(200, { 'Content-Type' : 'application/json' });
                        response.end(JSON.stringify(pulpitUpdateData));
                    }).catch(error => {
                        HttpHandler.onError(response, 500, error.message);
                    });
                });
                break;
            case '/api/subjects':
                break;
            case '/api/auditoriumstypes':
                break;
            case '/api/auditoriums':
                break;
            default:
                HttpHandler.onError(response, 404, 'Not found');
                break;
        }
    }

    static onDelete(request, response) {
        const { path, code } = configPathAndCodeForDelete(url.parse(request.url).pathname);

        switch (path) {
            case '/api/faculties':
                DB.deleteFaculty(code).then(deletedFaculty => {
                    response.writeHead(200, { 'Content-Type' : 'application/json' });
                    response.end(JSON.stringify(deletedFaculty));
                }).catch(error => {
                    HttpHandler.onError(response, 500, error.message);
                });
                break;
            case '/api/pulpits':
                DB.deletePulpit(code).then(deletedPulpit => {
                    response.writeHead(200, { 'Content-Type' : 'application/json' });
                    response.end(JSON.stringify(deletedPulpit));
                }).catch(error => {
                    HttpHandler.onError(response, 500, error.message);
                });
                break;
            case '/api/subjects':
                DB.deleteSubject(code).then(deletedSubject => {
                    response.writeHead(200, { 'Content-Type' : 'application/json' });
                    response.end(JSON.stringify(deletedSubject));
                }).catch(error => {
                    HttpHandler.onError(response, 500, error.message);
                });
                break;
            case '/api/auditoriumstypes':
                DB.deleteAuditoriumType(code).then(deletedAuditoriumType => {
                    response.writeHead(200, { 'Content-Type' : 'application/json' });
                    response.end(JSON.stringify(deletedAuditoriumType));
                }).catch(error => {
                    HttpHandler.onError(response, 500, error.message);
                });
                break;
            case '/api/auditoriums':
                DB.deleteAuditorium(code).then(deletedAuditorium => {
                    response.writeHead(200, { 'Content-Type' : 'application/json' });
                    response.end(JSON.stringify(deletedAuditorium));
                }).catch(error => {
                    HttpHandler.onError(response, 500, error.message);
                });
                break;
            default:
                HttpHandler.onError(response, 404, 'Not found');
                break;
        }
    }

    static onError(response, code, message) {
        response.writeHead(code, { 'Content-Type' : 'application/json' });
        response.end(JSON.stringify({ code: code, error: message }));
    }
}

function configPathAndCodeForDelete(requestUrl) {
    let path = requestUrl.split('/');
    path.splice(path.length - 1, 1);
    path = path.join('/');
    let code = requestUrl.split('/').pop();

    return { path, code };
}