import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

const saltRounds = 10;

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser || foundUser.active === false) {
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
        { "id": foundUser._id }, // Storing just ID is safer/smaller
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Note: 'secure: true' REQUIRED for 'SameSite: None'
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,  // Works on localhost in Chrome, required for Cross-Site
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ accessToken })
})

const refresh = (req, res) => {
    const cookies = req.cookies

    // Check if cookie exists
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    // Verify the token
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' }) // Token expired or invalid

            try {
                const foundUser = await User.findById(decoded.id).exec();

                if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

                // Generate NEW Access Token
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "id": foundUser._id,
                            "email": foundUser.email,
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                )

                res.json({ accessToken })

            } catch (error) {
                res.status(500).json({ message: 'Server Error during refresh' });
            }
        }
    )
}

const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) // No content

    // pass SAME options as res.cookie to clearCookie 
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    })

    res.json({ message: 'Cookie cleared' })
}

const register = asyncHandler(async (req, res) => {
    const { firstname, lastname, dateOfBirth, email, password } = req.body;

    if (!email || !password || !firstname || !lastname) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
        return res.status(409).json({ message: 'Email already registered.' }); // 409 = Conflict
    }

    // Hash & Create
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
        firstname,
        lastname,
        dateOfBirth: dateOfBirth || null,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
})

const authController = { login, refresh, logout, register }
export default authController