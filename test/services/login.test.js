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
        Login.register("John Doe", "jd", "jdoe@gmail.com", "jdrocks", false, "1")
            .then( (result) => {
            console.log(result);
            assert.equal(result.name, "John Doe");
            done();
        });

    });

    it('should fail the registration for not unique email', (done) => {
        Login.register("Jane Doe", "jad", "jdoe@gmail.com", "jdrocks", false, "1")
            .then( (result) => {

                console.log(result);
             })

            .catch((error) => {

                console.log("err " + error);
                assert.equal(error, "Email is not unique");
                done();
            })

    });

    it('should fail the registration for not unique username', (done) => {
        Login.register("Jane Doe", "jd", "jadoe@gmail.com", "jdrocks", false, "1")
            .then( (result) => {


            })
            .catch((error) => {

                console.log("err " + error);
                assert.equal(error, "Username is not unique");
                done();
            })
    });

    it('should fail the registration for missing argument', (done) => {
        Login.register("John Doe", "jad", "johndoe@gmail.com", "jdrocks", "1")
            .then( (result) => {


            })
            .catch((error) => {
                console.log("err " + error);
                assert.equal(error, "Could not create user");
                done();
            })
    });

    it('should login to the system', (done) => {
        Login.login("jdoe@gmail.com", "jdrocks")
            .then( (result) => {
                console.log(result);
                assert.equal(result.name, "John Doe");
                done();
            });
    });

    it('should fail login to the system for wrong password', (done) => {
        Login.login("jdoe@gmail.com", "jdrock")
            .then( (result) => {


            })
            .catch( (error) => {
                console.log("err " + error);
                assert.equal(error, "Wrong Password");
                done();
            });
    });

    it('should fail login to the system for not found email', (done) => {
        Login.login("jadoe@gmail.com", "jdrock")
            .then( (result) => {


            })
            .catch( (error) => {
                console.log("err " + error);
                assert.equal(error, "User does not exist");
                done();
            });
    });
});