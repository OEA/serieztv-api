/**
 * Created by gbu on 08/11/2016.
 */
import mongoose from 'mongoose';
import User from '../../Models/User';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

const Messages = {
    NOT_UNIQUE_EMAIL: "Email is not unique",
    NOT_UNIQUE_USERNAME: "Username is not unique",
    WRONG_PASSWORD: "Wrong Password",
    CANNOT_CREATE_USER: "Could not create user",
    USER_NOT_EXIST: "User does not exist",
};

class Login {

    static register(user) {

        return new Promise((resolve, reject) => {

            User.find({email:user.email}).count((error, count)=> {
                if (count > 0 || error) {
                    reject(Messages.NOT_UNIQUE_EMAIL);
                }
            });


            User.find({username:user.username}).count((error, count)=> {
                if (count > 0 || error) {
                    reject(Messages.NOT_UNIQUE_USERNAME);
                }
            });

            user.save( (error) => {
                if (error) {
                    reject(Messages.CANNOT_CREATE_USER);
                } else {
                    resolve(user);
                }
            });
        });
    }

    static login(email, password) {

        return new Promise((resolve, reject) => {
            User.find({email:email}).limit(1).exec((error, users)=> {
                if (error || users.length < 1) {
                    reject(Messages.USER_NOT_EXIST);
                } else {
                    if (users[0].password == password) {
                        resolve(users[0]);
                    } else {
                        reject(Messages.WRONG_PASSWORD);
                    }
                }
            });
        });
    }
}

export default Login;