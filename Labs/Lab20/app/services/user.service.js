import createError from 'http-errors';

let users = [
    {
        id: 1,
        name: 'Петров В.В.',
        phone_number: '8(999)123-45-64',
    },
    {
        id: 2,
        name: 'Сидоров С.С.',
        phone_number: '8(999)123-45-64',
    },
    {
        id: 3,
        name: 'Алексеев А.А.',
        phone_number: '8(999)123-45-64',
    },
    {
        id: 4,
        name: 'Фёдоров Ф.Ф.',
        phone_number: '8(999)123-45-64',
    },
    {
        id: 5,
        name: 'Павлов П.П.',
        phone_number: '8(999)123-45-64',
    }
];

export class UserService {
    getAll() {
        return users;
    }

    getUser(userId) {
        const user = users.find(user => user.id === userId);

        if (user) {
            return user;
        } else {
            throw createError(400, `Пользователь с id=${userId} не найден`);
        }
    }

    update(userUpdateData) {
        const updatedUserIndex = users.findIndex(user => user.id === userUpdateData.id);

        if (updatedUserIndex !== -1) {
            users.splice(updatedUserIndex, 1, userUpdateData);
        } else {
            throw createError(400, `Невозможно обновить пользователя с id=${userUpdateData.id}, ` +
                `т.к. его не существует.`);
        }
    }

    create(userCreateData) {
        let createdUserId = 1;

        if (users.length > 0) {
            createdUserId = users[users.length - 1].id + 1;
        }

        const user = {
            id: createdUserId,
            ...userCreateData,
        };

        users.push(user);
    }

    delete(userId) {
        const deletedUserIndex = users.findIndex(user => user.id === userId);

        if (deletedUserIndex !== -1) {
            users.splice(deletedUserIndex, 1);
        } else {
            throw createError(400, `Невозможно удалить пользователя с id=${userId}, ` +
                `т.к. его не существует.`);
        }
    }
}