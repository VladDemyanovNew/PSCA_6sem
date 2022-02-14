import { Auditorium, AuditoriumType, Faculty, Pulpit, Subject, } from './entities.js';

export class DB {

    static async createFaculty(facultyCreateData) {
        const doesFacultyExist = (await Faculty.findByPk(facultyCreateData.faculty)) !== null;

        if (!doesFacultyExist) {
            return Faculty.create(facultyCreateData);
        } else {
            throw new Error('Факультет с заданным PK уже существует');
        }
    }

    static async createPulpit(pulpitCreateData) {
        const doesPulpitExist = (await Pulpit.findByPk(pulpitCreateData.pulpit)) !== null;

        if (!doesPulpitExist) {
            const doesFacultyExist = (await Faculty.findByPk(pulpitCreateData.faculty)) !== null;

            if (doesFacultyExist) {
                return Pulpit.create(pulpitCreateData);
            } else {
                throw new Error('Факультет с заданным PK не существует');
            }
        } else {
            throw new Error('Кафедра с заданным PK уже существует');
        }
    }

    static async createSubject(subjectCreateData) {
        const doesSubjectExist = (await Subject.findByPk(subjectCreateData.subject)) !== null;

        if (!doesSubjectExist) {
            const doesPulpitExist = (await Pulpit.findByPk(subjectCreateData.pulpit)) !== null;

            if (doesPulpitExist) {
                return Subject.create(subjectCreateData);
            } else {
                throw new Error('Кафедра с заданным PK не существует');
            }
        } else {
            throw new Error('Дисциплина с заданным PK уже существует');
        }
    }

    static async createAuditoriumType(auditoriumTypeCreateData) {
        const doesAuditoriumTypeExist = (await AuditoriumType.findByPk(auditoriumTypeCreateData.auditorium_type)) !== null;

        if (!doesAuditoriumTypeExist) {
            return AuditoriumType.create(auditoriumTypeCreateData);
        } else {
            throw new Error('Тип аудитории с заданным PK уже существует');
        }
    }

    static async createAuditorium(auditoriumCreateData) {
        const doesAuditoriumExist = (await Auditorium.findByPk(auditoriumCreateData.auditorium)) !== null;

        if (!doesAuditoriumExist) {
            const doesAuditoriumTypeExist = (await AuditoriumType.findByPk(auditoriumCreateData.auditorium_type)) !== null;

            if (doesAuditoriumTypeExist) {
                return Auditorium.create(auditoriumCreateData);
            } else {
                throw new Error('Тип аудитории с заданным PK не существует');
            }
        } else {
            throw new Error('Аудитория с заданным PK уже существует');
        }
    }

    static async updateFaculty(facultyUpdateData) {
        const doesFacultyExist = (await Faculty.findByPk(facultyUpdateData.faculty)) !== null;

        if (doesFacultyExist) {
            return Faculty.update(facultyUpdateData, { where: { faculty: facultyUpdateData.faculty } });
        } else {
            throw new Error('Факультет с заданым PK не существует');
        }
    }

    static async updatePulpit(pulpitUpdateData) {
        const doesPulpitExist = (await Pulpit.findByPk(pulpitUpdateData.pulpit)) !== null;

        if (doesPulpitExist) {
            const doesFacultyExist = (await Faculty.findByPk(pulpitUpdateData.faculty)) !== null;

            if (doesFacultyExist) {
                return Pulpit.update(pulpitUpdateData, { where: { pulpit: pulpitUpdateData.pulpit } });
            } else {
                throw new Error('Факультет с заданным PK не существует');
            }
        } else {
            throw new Error('Кафедра с заданым PK не существует');
        }
    }

    static async deleteFaculty(facultyPK) {
        return Faculty.findByPk(facultyPK)
            .then(faculty => {
                if (faculty) {
                    return Faculty.destroy({ where: { faculty: facultyPK } })
                        .then(() => faculty);
                } else {
                    throw new Error('Факультет с заданым PK не существует');
                }
            });
    }

    static async deletePulpit(pulpitPK) {
        return Pulpit.findByPk(pulpitPK)
            .then(pulpit => {
                if (pulpit) {
                    return Pulpit.destroy({ where: { pulpit: pulpitPK } })
                        .then(() => pulpit);
                } else {
                    throw new Error('Кафедра с заданым PK не существует');
                }
            });
    }

    static async deleteSubject(subjectPK) {
        return Subject.findByPk(subjectPK)
            .then(subject => {
                if (subject) {
                    return Subject.destroy({ where: { subject: subjectPK } })
                        .then(() => subject);
                } else {
                    throw new Error('Дисциплина с заданым PK не существует');
                }
            });
    }

    static async deleteAuditoriumType(auditoriumTypePK) {
        return AuditoriumType.findByPk(auditoriumTypePK)
            .then(auditoriumType => {
                if (auditoriumType) {
                    return AuditoriumType.destroy({ where: { auditorium_type: auditoriumTypePK } })
                        .then(() => auditoriumType);
                } else {
                    throw new Error('Тип аудитории с заданым PK не существует');
                }
            });
    }

    static async deleteAuditorium(auditoriumPK) {
        return Auditorium.findByPk(auditoriumPK)
            .then(auditorium => {
                if (auditorium) {
                    return Auditorium.destroy({ where: { pulpit: auditoriumPK } })
                        .then(() => auditorium);
                } else {
                    throw new Error('Аудитория с заданым PK не существует');
                }
            });
    }
}