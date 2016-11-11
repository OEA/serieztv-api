/**
 * Created by gbu on 08/11/2016.
 */
import mongoose from 'mongoose';
import User from '../../Models/User';

class Login {

    static register(name, username, email, password, activated, apiID) {
        const user = new User();
        return user;
    }

    static checkUniqueEmail(email) {
        return false;
    }

    static checkUniqueUsername(username) {
        return false;
    }

    static checkPassword(password) {
        return false;
    }

    static login(email, password) {
        const user = new User();
        return user;
    }


}



export default Login;