import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import { ContentModel } from "./db";
import {random } from  "./utlis"
import cors from "cors";


import{  LinkModel} from "./db"
import { z } from "zod";

const app = express();

app.use(express.json());
app.use(cors());

// Zod validation schema for signup
const signupSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }).max(20, { message: "Username is too long" }),
    password: z.string().min(6, { message: "Password should be at least 6 characters" }),
});

// Zod validation schema for signin
const signinSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(6, { message: "Password should be at least 6 characters" }),
});

app.post("/api/v1/signup", async (req, res) => {
    // Zod validation
    try {
        signupSchema.parse(req.body); // Validating request body with Zod

        const { username, password } = req.body;

        // Create user
        await UserModel.create({
            username: username,
            password: password,
        });

        res.json({
            message: "User signed up",
        });
    } catch (e) {
        if (e instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation Error",
                errors: e.errors,
            });
        }
        res.status(411).json({
            message: "User already exists",
        });
    }
});

app.post("/api/v1/signin", async (req, res) => {
    // Zod validation
    try {
        signinSchema.parse(req.body); // Validating request body with Zod

        const { username, password } = req.body;

        // Find user by username and password
        const existingUser = await UserModel.findOne({
            username: username,
            password: password,
        });

        if (existingUser) {
            const token = jwt.sign(
                {
                    id: existingUser._id
                },
                JWT_PASSWORD
            );

            res.json({
                message: "Signed in successfully",
                token,
            });
        } else {
            res.status(401).json({
                message: "Incorrect Credentials",
            });
        }
    } catch (e) {
        if (e instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation Error",
                errors: e.errors,
            });
        }
        res.status(500).json({
            message: "Error occurred while signing in",
        });
    }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type= req.body.type;

    await ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId: req.userId,
        tags: [],
    });

    res.json({
        message: "Content added",
    });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId,
    }).populate("userId", "username");

    res.json({
        content,
    });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId,
    });
    res.json({
        message: "Deleted",
    });
});

app.post("/api/v1/brain/share", userMiddleware,async  (req, res) => {
    const share = req.body.share;
    if (share) {
            const existingLink = await LinkModel.findOne({
                userId: req.userId
            });

            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                })
                return;
            }
            const hash = random(10);
            await LinkModel.create({
                userId: req.userId,
                hash: hash
            })

            res.json({
                hash
            })
    } else {
        await LinkModel.deleteOne({
            userId: req.userId
        });

        res.json({
            message: "Removed link"
        })
    }
})
     

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    try {
        const hash = req.params.shareLink;
        if (!hash) {
            return res.status(400).json({ message: "shareLink parameter is required" });
        }

        const link = await LinkModel.findOne({ hash });
        if (!link) {
            return res.status(404).json({ message: "Sorry, incorrect input" });
        }

        const content = await ContentModel.find({ userId: link.userId });
        const user = await UserModel.findOne({ _id: link.userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            username: user.username,
            content,
        });
    } catch (error) {
        console.error("Error fetching brain share:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



app.listen(3000);

console.log("Successfully running on the port");  