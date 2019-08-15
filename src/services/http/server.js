import User from "../../models/user-mod";

// @flow

// in real app should be extra checks
export async function getData() {
  return Promise.all([getDataByPage(1), getDataByPage(2), getDataByPage(3)])
    .then(([res1, res2, res3]) => res1.concat(res2, res3))
    .catch(err => console.log(err));

    // example of response
    // return [{"id":1,"email":"george.bluth@reqres.in","first_name":"George","last_name":"Bluth","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"},{"id":2,"email":"janet.weaver@reqres.in","first_name":"Janet","last_name":"Weaver","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"},{"id":3,"email":"emma.wong@reqres.in","first_name":"Emma","last_name":"Wong","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg"}]
}

function getDataByPage(page) {
  return fetch(`https://reqres.in/api/users?page=${ page }`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(res => res.json())
  .then(res => res.data)
  .then(res => res.map(rawUser => new User(rawUser)))
  .catch(err => console.log(err));
}