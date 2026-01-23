import prisma from "../../config/prisma.js"
import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'


export const login = async (req, res) => {
        const {email, password} = req.body;

        try {
            const requestdb =await prisma.user.findUnique({
                where: {
                    email: email
                }
            })

            if (requestdb) {
                const isPasswordValid = bcrypt.compare(password, requestdb.password)
                if (isPasswordValid) {
                    console.log("Successful Login!!");
                    res.status(201).json({
                        success: true,
                        message: "!!Successful Login!!"
                    })
                } else {
                    res.status(500).json({
                        success: false,
                        message: "!!Incorrect Password!!"
                    })
                }
            } else {
                res.status(500).json({
                    success: false,
                    message: "Email doesn't exist"
                })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                    success: false,
                    message: "Something went wrong...while checking Email.",
                    data: error
                })
            }
        }