import { INTEGER, Model, Sequelize, STRING } from 'sequelize';

const sequelize = new Sequelize({
  database: 'Lab22',
  username: 'dvr_psca',
  password: 'admin',
  host: 'localhost',
  port: 1433,
  dialect: 'mssql',
});

export async function initORM() {
  User.init({
    id: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: { type: STRING, allowNull: false },
    password: { type: STRING, allowNull: false },
    refreshToken: { type: STRING, allowNull: true },
    role: {
      type: STRING(5),
      allowNull: false,
      validate: {
        isIn: [['user', 'admin']],
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
  });

  Repos.init({
    id: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: { type: STRING(255), allowNull: true },
    authorId: {
      type: INTEGER,
      allowNull: false,
      onDelete: 'cascade',
      references: { model: User, key: 'id' },
    },
  }, {
    sequelize,
    modelName: 'Repos',
    tableName: 'repos',
    timestamps: false,
  });

  User.hasMany(Repos, { foreignKey: 'authorId' });
  Repos.belongsTo(User, { foreignKey: 'authorId' });

  Commit.init({
    id: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: { type: STRING(255), allowNull: true },
    repoId: {
      type: INTEGER,
      allowNull: false,
      onDelete: 'cascade',
      references: { model: Repos, key: 'id' },
    },
  }, {
    sequelize,
    modelName: 'Commit',
    tableName: 'commits',
    timestamps: false,
  });

  Repos.hasMany(Commit, { foreignKey: 'repoId' });
  Commit.belongsTo(Repos, { foreignKey: 'repoId' });

  await sequelize.sync();
}

export class User extends Model {
}

export class Commit extends Model {
}

export class Repos extends Model {
}

export { sequelize };