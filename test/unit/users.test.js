/* eslint-disable no-undef */
/* eslint-disable import/extensions */
import _ from 'lodash';
import fixtures from '../fixtures/db.js';

describe('Users API', () => {
  let fixture;
  let user;

  beforeEach(() => {
    fixture = _.cloneDeep(fixtures);
    app.db.data = fixture;

    [user] = fixture.users;
  });
  
  it('GET /users should get a user', (done) => {
    request
      .get(`/users/${user.id}`)
      .send(user)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.include(user);

        done(err);
      });
  });

  it('POST /users should create a user', (done) => {
    const newUser = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    request
      .post('/users')
      .send(newUser)
      .expect(201)
      .end((err, res) => {
        expect(res.body).to.include(newUser);

        done(err);
      });
  });

  it('PUT /users should update a user', (done) => {
    const userCopy = _.clone(user);
    const userUpdate = {
      id: userCopy.id,
      firstName: 'John Michael',
      lastName: 'Doe',
    };

    request
      .put('/users')
      .send(userUpdate)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.include(userUpdate);
        expect(res.body.updatedAt).to.not.eql(userCopy.updatedAt);

        done(err);
      });
  });

  it('DELETE /users should delete a user', (done) => {
    request
      .delete(`/users/${user.id}`)
      .send()
      .expect(200)
      .end((err) => {
        expect(fixture.users).to.not.include({ id: user.id });

        done(err);
      });
  });
});
