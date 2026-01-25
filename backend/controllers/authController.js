import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

const saltRounds = 10;

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    console.log(email, password);


    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ email })
    console.log(foundUser);

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser._id,
                "email": foundUser.email,
                // "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "id": foundUser._id, "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing email and roles 
    res.json({ accessToken })
})

const refresh = async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ email: decoded.email }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id": foundUser._id,
                        "email": foundUser.email,
                        // "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}

const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

const register = asyncHandler(async (req, res) => {
    console.log("Here's the thing", req.body);
    
    try {
        const { firstname, lastname, dateOfBirth, email, password } = req.body; 
        console.log(firstname, lastname, dateOfBirth, email, password );

        const existingUser = await User.findOne({ email: email });
        console.log("Existing user associated to the email:",existingUser);

        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("hashed password:",hashedPassword);

        const user = await User.create({
            firstname,
            lastname,
            dateOfBirth: dateOfBirth || null,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
})
const authController = { login, refresh, logout, register }
export default authController