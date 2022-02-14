import { Model, Sequelize } from 'sequelize';

// Второй способ определения модели с помощью метода sequelize.define

export class Faculty extends Model {};

export class Pulpit extends Model {};

export class Teacher extends Model {};

export class Subject extends Model {};

export class AuditoriumType extends Model {};

export class Auditorium extends Model {};

export function initORM(sequelize) {
    Faculty.init({
        faculty: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
        faculty_name: { type: Sequelize.STRING, allowNull: false }
    }, { sequelize, modelName: 'Faculty', tableName: 'Faculty', timestamps: false });

    Pulpit.init({
        pulpit: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
        pulpit_name: { type: Sequelize.STRING, allowNull: false },
        faculty: {
            type: Sequelize.STRING,
            allowNull: false,
            onDelete: 'cascade',
            references: { model: Faculty, key: 'faculty' }
        }
    }, { sequelize, modelName: 'Pulpit', tableName: 'Pulpit', timestamps: false });

    Teacher.init({
        teacher: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
        teacher_name: { type: Sequelize.STRING, allowNull: false },
        pulpit: {
            type: Sequelize.STRING,
            allowNull: false,
            onDelete: 'cascade',
            references: { model: Pulpit, key: 'pulpit' }
        }
    }, { sequelize, modelName: 'Teacher', tableName: 'Teacher', timestamps: false });

    Subject.init({
        subject: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
        subject_name: { type: Sequelize.STRING, allowNull: false },
        pulpit: {
            type: Sequelize.STRING,
            allowNull: false,
            onDelete: 'cascade',
            references: { model: Pulpit, key: 'pulpit' }
        }
    }, { sequelize, modelName: 'Subject', tableName: 'Subject', timestamps: false });

    AuditoriumType.init({
        auditorium_type: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
        auditorium_typename: { type: Sequelize.STRING, allowNull: false },
    }, { sequelize, modelName: 'AuditoriumType', tableName: 'auditorium_type', timestamps: false });

    Auditorium.init({
        auditorium: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
        auditorium_name: { type: Sequelize.STRING, allowNull: false },
        auditorium_capacity: { type: Sequelize.STRING, allowNull: false },
        auditorium_type: {
            type: Sequelize.STRING,
            allowNull: false,
            onDelete: 'cascade',
            references: { model: AuditoriumType, key: 'auditorium_type' }
        }
    }, { sequelize, modelName: 'Auditorium', tableName: 'Auditorium', timestamps: false });

    sequelize.sync(); // {force: true} - если таблица существует в бд, но не соответствует схеме она удалится и создаётся заново
}
