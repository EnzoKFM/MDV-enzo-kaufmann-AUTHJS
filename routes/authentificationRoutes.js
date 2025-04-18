import { Router } from "express";
import jwt from 'jsonwebtoken';
import { createNewUser, verifyUser, getUserDetails, getAllUsers, getUsersByRole, setUserRole, setOTPDetails } from "../controllers/userController.js"
import dotenv from 'dotenv';

//OTP
import QRCode from 'qrcode';
import {TOTP, Secret} from 'otpauth';

dotenv.config();

const router = Router();
const jwtSecretKey = process.env.jwtSecretKey;

// Middleware
const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/apiauth/login');
    try {
        const user = jwt.verify(token, jwtSecretKey);
        req.user = user;
        next();
    } catch {
        res.redirect('/apiauth/login');
    }
}

const isEtudiant = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/apiauth/dashboard');
    try {
        const user = jwt.verify(token, jwtSecretKey);
        if((user.role==="etudiant")){
            req.user = user;
            next();
        }else{
            return res.redirect('/apiauth/dashboard');
        }
    } catch {
        res.redirect('/apiauth/dashboard');
    }
}

const isIntervenant = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/apiauth/dashboard');
    try {
        const user = jwt.verify(token, jwtSecretKey);
        if((user.role==="intervenant") || (user.role==="admin")){
            req.user = user;
            next();
        }else{
            return res.redirect('/apiauth/dashboard');
        }
    } catch {
        res.redirect('/apiauth/dashboard');
    }
}

const isAdmin = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/apiauth/dashboard');
    try {
        const user = jwt.verify(token, jwtSecretKey);
        if(user.role==="admin"){
            req.user = user;
            next();
        }else{
            return res.redirect('/apiauth/dashboard');
        }
    } catch {
        res.redirect('/apiauth/dashboard');
    }
}


// Register & Login
const register = async (req, res) => {
    const {username, password} = req.body;

    createNewUser(username,password);

    res.redirect("/apiauth/login")
}

const login = async (req, res) => {
    const {username, password} = req.body;

    const answer = await verifyUser(username,password);
    if(answer){
        const user = await getUserDetails(username);
        const token = jwt.sign({username:username, role:user.role}, jwtSecretKey, { expiresIn: '1h' })
        res.cookie('token', token, {httpOnly : true});
        req.session.user = {username:username, totpSecret:user.totpSecret, mfaValidated:user.mfaValidated};
        req.session.authenticated = true;
        res.redirect("/apiauth/dashboard");
    } else {
        res.send("Mauvais Mot de Passe");
    }   
}

const changeUserRole = async (req,res) => {
    const { username, newRole } = req.body;

    setUserRole(username, newRole);

    res.redirect("/apiauth/adminPanel");

}

// Inscription
router.get('/register', (req,res) => {
    res.render('register');
})

router.post('/register', register)

// Authentification
router.get('/login', (req,res) => {
    res.render('login');
})

router.post('/login', login)

// Dashboard
router.get('/dashboard', authenticate, (req,res) => {
    res.render('dashboard', { username: req.user.username, role:req.user.role });
})

// Détails de l'étudiant
router.get('/etudiantDetails', isEtudiant, (req,res) => {
    res.render('etudiantDetails', { username: req.user.username, role:req.user.role });
})

// Liste des Etudiants
router.get('/etudiantsList', isIntervenant, async (req,res) => {
    const etudiantsList = await getUsersByRole("etudiant");
    res.render('etudiantsList', {etudiantsList});
})

// Liste des Intervenants
router.get('/intervenantsList', isAdmin, async (req,res) => {
    if (req.session.authenticated && req.session.user.mfaValidated) {
        const intervenantsList = await getUsersByRole("intervenant");
        res.render('intervenantsList', {intervenantsList});
    } else {
        res.redirect('/apiauth/dashboard');
    }
})

router.get('/adminPanel', isAdmin, async (req,res) => {
    const usersList = await getAllUsers();
    res.render('adminPanel', {usersList});
})

router.post('/adminPanel', changeUserRole)

// Déconnexion
router.get('/logout', (req,res) => {
    res.clearCookie('token');
    res.redirect('/');
})

// OTP
router.get('/verify', async (req, res) => {
    if (!req.session.authenticated) return res.redirect('/');

    if (!req.session.user.totpSecret) {
        // Générer une clé TOTP
        const totp = new TOTP({
            issuer: 'CiveLampus',
            label: req.session.user.username,
            algorithm: 'SHA1',
            digits: 6,
            period: 30
        });
        req.session.user.totpSecret = totp.secret.base32;
        const otpauthUrl = totp.toString(); // format otpauth://...
        const qr = await QRCode.toDataURL(otpauthUrl); // génération d'un qrcode pour l'ajout dans un authenticator

        return res.render('verify', { qr });
    }
    res.render('verify', { qr: null });
});

router.post('/verify', (req, res) => {
    const { otpToken } = req.body;

    const totp = new TOTP({
        issuer: 'CiveLampus',
        label: req.session.user.username,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: Secret.fromBase32(req.session.user.totpSecret)
    });

    const now = Date.now();
    const delta = totp.validate({ token: otpToken, timestamp: now });

    if (delta !== null) {
        req.session.user.mfaValidated = true
        setOTPDetails(req.session.user.username, req.session.user.totpSecret, req.session.user.mfaValidated)
        res.redirect('/apiauth/intervenantsList');
    } else {
        res.send('Code TOTP invalide.');
    }
});


export default router; 