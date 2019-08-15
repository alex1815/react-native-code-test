// @flow

export default class User {
  id: string;
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  avatar: string = '';

  constructor({ id, email, firstName, lastName, avatar }
    : { id: string, email: string, firstName: string, lastName: string, avatar: string }) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.avatar = avatar;
  }

  fullName() {
    return `${ this.firstName } ${ this.lastName }`;
  }
}
