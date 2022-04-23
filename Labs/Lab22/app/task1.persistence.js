let data = [
  {
    "name": "user1",
    "password": "user1"
  },
  {
    "name": "user2",
    "password": "user2"
  },
  {
    "name": "user3",
    "password": "user3"
  },
];

export function getByName(name) {
  return data.find(user => user.name === name);
}
