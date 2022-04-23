import { Model, Sequelize } from 'sequelize';

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
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false  },
    password: { type: Sequelize.STRING, allowNull: false  },
    refreshToken: { type: Sequelize.STRING, allowNull: true  },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
  });

  await sequelize.sync();
}

export class User extends Model {
}

export { sequelize };