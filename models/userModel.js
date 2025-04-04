import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database : "authentification_eval"
});

const createUser = async (username, pass) => {
    await db.query(`INSERT INTO user (username, password, role) VALUES ("${username}", "${pass}", "etudiant" );`)
}

const findUser = async (name) => {
    const user = await db.query(`SELECT * from user where username="${name}"`)
    return user;
}

const findAllUsers = async (name) => {
    const user = await db.query(`SELECT * from user`)
    return user;
}

const findUserByRole = async (role) => {
    const user = await db.query(`SELECT * from user where role="${role}"`)
    return user;
}

const updateUserRole = async (name, role) => {
    await db.query(`UPDATE user SET role = "${role}" WHERE username="${name}"`)
}

const updateUserOTP = async (name, totpSecret, mfaValidated) => {
    await db.query(`UPDATE user SET totpSecret = "${totpSecret}", mfaValidated=${mfaValidated} WHERE username="${name}"`)
}


export {createUser, findUser, findAllUsers, findUserByRole, updateUserRole, updateUserOTP}

