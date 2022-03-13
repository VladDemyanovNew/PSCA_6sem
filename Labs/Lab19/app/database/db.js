import { Model, Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    database: 'social_network',
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
        nickname: { type: Sequelize.STRING, allowNull: false  },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,
    });

    Post.init({
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        content: { type: Sequelize.STRING, allowNull: false  },
        owner_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            onDelete: 'cascade',
            references: { model: User, key: 'id' }
        },
    }, {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        timestamps: false,
    });

    Comment.init({
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        content: { type: Sequelize.STRING, allowNull: false  },
        owner_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: User, key: 'id' }
        },
        post_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            onDelete: 'cascade',
            references: { model: Post, key: 'id' }
        },
    }, {
        sequelize,
        modelName: 'Comment',
        tableName: 'comments',
        timestamps: false,
    });

    await sequelize.sync();
}

export class User extends Model { }

export class Post extends Model { }

export class Comment extends Model { }

export { sequelize };