/**
 * Created by gbu on 08/11/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import User from '../../src/Models/User';
import Login from '../../src/Services/User/Login';
import bluebird from 'bluebird';

bluebird.promisifyAll(mongoose);

describe('Login', ()=> {

    before((done) => {
        User.remove({}).then(()=> {
            done();
        });
    });

    it('should register new user to the system', (done) => {
        const user = new User({
            name: "John Doe",
            username: "jd",
            email: "jdoe@gmail.com",
            password: "jdrocks",
            activated: false,
            apiID: "1"
        });
        Login.register(user)
            .then( (result) => {
            assert.equal(result.name, "John Doe");
            done();
        });

    });

    it('should fail the registration for not unique email', (done) => {
        const user = new User({
            name: "Jane Doe",
            username: "jad",
            email: "jdoe@gmail.com",
            password: "jdrocks",
            activated: false,
            apiID: "1"
        });

        Login.register(user)
            .then( (result) => {

             })
            .catch((error) => {
                assert.equal(error, "Email is not unique");
                done();
            })

    });

    it('should fail the registration for not unique username', (done) => {
        const user = new User({
            name: "Jane Doe",
            username: "jd",
            email: "jadoe@gmail.com",
            password: "jdrocks",
            activated: false,
            apiID: "1"
        });
        Login.register(user)
            .then( (result) => {


            })
            .catch((error) => {
                assert.equal(error, "Username is not unique");
                done();
            })
    });

    it('should fail the registration for missing argument', (done) => {
        const user = new User({
            name: "John Doe",
            username: "jad",
            email: "johndoe@gmail.com",
            password: "jdrocks",
            apiID: "1"
        });
        Login.register(user)
            .then( (result) => {


            })
            .catch((error) => {
                assert.equal(error, "Could not create user");
                done();
            })
    });

    it('should login to the system', (done) => {
        Login.login("jdoe@gmail.com", "jdrocks")
            .then( (result) => {
                assert.equal(result.name, "John Doe");
                done();
            });
    });

    it('should fail login to the system for wrong password', (done) => {
        Login.login("jdoe@gmail.com", "jdrock")
            .then( (result) => {


            })
            .catch( (error) => {
                assert.equal(error, "Wrong Password");
                done();
            });
    });

    it('should fail login to the system for not found email', (done) => {
        Login.login("jadoe@gmail.com", "jdrock")
            .then( (result) => {


            })
            .catch( (error) => {
                assert.equal(error, "User does not exist");
                done();
            });
    });
});