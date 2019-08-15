// @flow

export default class User {
  id: string;
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  avatar: string = '';

  fullName: Function;

  constructor({ id, email, firstName, first_name, lastName, last_name, avatar }
    : { id: string, email: string, firstName: string, first_name: string, lastName: string, last_name: string, avatar: string }) {
    this.id = id;
    this.email = email;
    this.firstName = firstName || first_name;
    this.lastName = lastName || last_name;
    this.avatar = avatar;

    this.fullName = this.fullName.bind(this);
  }

  fullName(): string {
    return `${ this.firstName } ${ this.lastName }`;
  }
}
