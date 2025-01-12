// @flow

import User from '../../models/user-mod';

// in real app should be extra checks
export async function getInitialData(pages: number): Promise<Array<User>> {
  if (pages < 0) throw new Error('Pages should be > 0');

  let promises = [];
  for (let i = 1; i <= pages; i++) {
    promises.push(getDataByPage(i));
  }

  return Promise.all(promises)
    .then((res) => {
      let concatedRes = [];      
      res.forEach(arr => { concatedRes = concatedRes.concat(arr) });
      return concatedRes;
    })
    // delay according task TODO - fix time here
    .then(res => new Promise(resolve => setTimeout(() => resolve(res), 3000)))
    .catch(err => console.log(err));

    // example of response
    // return [{'id':1,'email':'george.bluth@reqres.in','first_name':'George','last_name':'Bluth','avatar':'https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg'}]
}

export async function getDataByPage(page: number): Promise<Array<User>> {
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

export async function getTotalPages(): Promise<number> {
  return fetch(`https://reqres.in/api/users?page=1`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(res => res.json())
  .then(res => res.total_pages)
  .catch(err => console.log(err));
}
