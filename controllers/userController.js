import { createUser, findUser, findAllUsers, findUserByRole, updateUserRole, updateUserOTP } from '../models/userModel.js';
import bcrypt from 'bcrypt';

const createNewUser = async (username,password) => {
    const user = await findUser(username);

    if(user[0].length != 0){
        return;
    }

    bcrypt.hash(password, 10, (err, hash) => {
        createUser(username,hash)
    })
}

const verifyUser = async (nameToVerify,passToVerify) => {
    const user = await findUser(nameToVerify);
    
    const result = await bcrypt.compare(passToVerify,user[0][0].password)

    return result;
}

const getUserDetails = async (nameToVerify) => {
    const result = await findUser(nameToVerify);
    
    const user = result[0][0];

    return user;
}

const getAllUsers = async (role) => {
    const result = await findAllUsers();
    
    const usersList = result[0];

    return usersList;
}

const getUsersByRole = async (role) => {
    const result = await findUserByRole(role);
    
    const usersList = result[0];

    return usersList;
}

const setUserRole = async (username,role) => {
    await updateUserRole(username,role);
}

const setOTPDetails = async (username, totpSecret, mfaValidated) => {
    await updateUserOTP(username,totpSecret, mfaValidated);
}

export {createNewUser, verifyUser, getUserDetails, getAllUsers, getUsersByRole, setUserRole, setOTPDetails}



