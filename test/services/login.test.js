/**
 * Created by gbu on 08/11/2016.
 */
import assert from 'assert';
import mongoose from 'mongoose';
import Login from '../../src/Services/User/Login';
import bluebird from 'bluebird';

describe('Login', ()=> {



    it('should register new user to the system', (done) => {
        var result = Login.register("John Doe", "jd", "jdoe@gmail.com", "jdrocks", false, "1");
        assert.equal(result.name, "John Doe");
        done();
    });

    it('should fail the registration for not unique email', (done) => {
        var result = Login.register("Jane Doe", "jad", "jdoe@gmail.com", "jdrocks", false, "1");
        assert.equal(result, "Email is not unique");
        done();
    });

    it('should fail the registration for not unique username', (done) => {
        var result = Login.register("Jane Doe", "jd", "jadoe@gmail.com", "jdrocks", false, "1");
        assert.equal(result, "Username is not unique");
        done();
    });

    it('should fail the registration for missing argument', (done) => {
        var result = Login.register("John Doe", "jd", "johndoe@gmail.com", "jdrocks", "1");
        assert.equal(result, "Could not create user");
        done();
    });

    it('should login to the system', (done) => {
        var result = Login.login("johndoe@gmail.com", "jdrocks");
        assert.equal(result.name, "John Doe");
        done();
    });

    it('should fail login to the system for wrong password', (done) => {
        var result = Login.login("johndoe@gmail.com", "jdrock");
        assert.equal(result, "Wrong password");
        done();
    });

    it('should fail login to the system for not found email', (done) => {
        var result = Login.login("johndo@gmail.com", "jdrocks");
        assert.equal(result, "User does not exist");
        done();
    });
});