/**
 * Created by gbu on 08/11/2016.
 */
import mongoose from 'mongoose';
import User from '../../Models/User';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

Promise.config({
    cancellation: true
});

const Messages = {
    NOT_UNIQUE_EMAIL: "Email is not unique",
    NOT_UNIQUE_USERNAME: "Username is not unique",
    WRONG_PASSWORD: "Wrong Password",
    CANNOT_CREATE_USER: "Could not create user",
    USER_NOT_EXIST: "User does not exist",
};


class Login {

    static register(name, username, email, password, activated, apiID) {

        return new Promise((resolve, reject) => {
            if (!this.checkUniqueEmail(email)) {
                reject(this.NotUniqueEmail());

            }  else if (!this.checkUniqueUsername(username)) {
                reject(this.NotUniqueUsername());

            } else {
                const user = new User({
                    name: name,
                    username: username,
                    email: email,
                    password: password,
                    activated: activated,
                    apiID: apiID
                });

                user.save( (error) => {
                    if (error) {
                        reject(this.CannotCreateUser());

                    } else {
                        resolve(user);
                    }
                });
            }
        });
    }

    static WrongPasswordError() {
        this.name = "Wrong Password";
    }



    static NotUniqueEmail() {
    return "Email is not unique";
    }


    static NotUniqueUsername() {
    return "Username is not unique";
}


    static CannotCreateUser() {
    return "Cannot create user";
}




    static checkUniqueEmail(email) {
        User.find({email:email}).limit(1).exec((error, users)=> {
            return false;
        });
        return true;
    }

    static checkUniqueUsername(username) {

        User.find({username:username}).limit(1).exec((error, users)=> {
            return false;
        });
        return true;
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