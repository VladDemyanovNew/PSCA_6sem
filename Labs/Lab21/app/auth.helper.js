const users = [
    { username: 'user1', password: 'user1' },
    { username: 'user2', password: 'user2' },
    { username: 'user3', password: 'user3' },
];

export function getCredentials(username) {
    return users.find(user => user.username.toUpperCase() === username.toUpperCase());
}

export function isPasswordValid(password1, password2) {
    return password1 === password2;
}