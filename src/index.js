"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var jsonwebtoken_1 = require("jsonwebtoken");
var db_1 = require("./db");
var config_1 = require("./config");
var middleware_1 = require("./middleware");
var db_2 = require("./db");
var utlis_1 = require("./utlis");
var cors_1 = require("cors");
var db_3 = require("./db");
var zod_1 = require("zod");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Zod validation schema for signup
var signupSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, { message: "Username is required" }).max(20, { message: "Username is too long" }),
    password: zod_1.z.string().min(6, { message: "Password should be at least 6 characters" }),
});
// Zod validation schema for signin
var signinSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, { message: "Username is required" }),
    password: zod_1.z.string().min(6, { message: "Password should be at least 6 characters" }),
});
app.post("/api/v1/signup", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                signupSchema.parse(req.body); // Validating request body with Zod
                _a = req.body, username = _a.username, password = _a.password;
                // Create user
                return [4 /*yield*/, db_1.UserModel.create({
                        username: username,
                        password: password,
                    })];
            case 1:
                // Create user
                _b.sent();
                res.json({
                    message: "User signed up",
                });
                return [3 /*break*/, 3];
            case 2:
                e_1 = _b.sent();
                if (e_1 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({
                            message: "Validation Error",
                            errors: e_1.errors,
                        })];
                }
                res.status(411).json({
                    message: "User already exists",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/signin", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, existingUser, token, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                signinSchema.parse(req.body); // Validating request body with Zod
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, db_1.UserModel.findOne({
                        username: username,
                        password: password,
                    })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    token = jsonwebtoken_1.default.sign({
                        id: existingUser._id
                    }, config_1.JWT_PASSWORD);
                    res.json({
                        message: "Signed in successfully",
                        token: token,
                    });
                }
                else {
                    res.status(401).json({
                        message: "Incorrect Credentials",
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                e_2 = _b.sent();
                if (e_2 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({
                            message: "Validation Error",
                            errors: e_2.errors,
                        })];
                }
                res.status(500).json({
                    message: "Error occurred while signing in",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/content", middleware_1.userMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var link, type;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                link = req.body.link;
                type = req.body.type;
                return [4 /*yield*/, db_2.ContentModel.create({
                        link: link,
                        type: type,
                        //@ts-ignore
                        userId: req.userId,
                        tags: [],
                    })];
            case 1:
                _a.sent();
                res.json({
                    message: "Content added",
                });
                return [2 /*return*/];
        }
    });
}); });
app.get("/api/v1/content", middleware_1.userMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, content;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.userId;
                return [4 /*yield*/, db_2.ContentModel.find({
                        userId: userId,
                    }).populate("userId", "username")];
            case 1:
                content = _a.sent();
                res.json({
                    content: content,
                });
                return [2 /*return*/];
        }
    });
}); });
app.delete("/api/v1/content", middleware_1.userMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contentId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                contentId = req.body.contentId;
                return [4 /*yield*/, db_2.ContentModel.deleteMany({
                        contentId: contentId,
                        //@ts-ignore
                        userId: req.userId,
                    })];
            case 1:
                _a.sent();
                res.json({
                    message: "Deleted",
                });
                return [2 /*return*/];
        }
    });
}); });
app.post("/api/v1/brain/share", middleware_1.userMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var share, existingLink, hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                share = req.body.share;
                if (!share) return [3 /*break*/, 3];
                return [4 /*yield*/, db_3.LinkModel.findOne({
                        userId: req.userId
                    })];
            case 1:
                existingLink = _a.sent();
                if (existingLink) {
                    res.json({
                        hash: existingLink.hash
                    });
                    return [2 /*return*/];
                }
                hash = (0, utlis_1.random)(10);
                return [4 /*yield*/, db_3.LinkModel.create({
                        userId: req.userId,
                        hash: hash
                    })];
            case 2:
                _a.sent();
                res.json({
                    hash: hash
                });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, db_3.LinkModel.deleteOne({
                    userId: req.userId
                })];
            case 4:
                _a.sent();
                res.json({
                    message: "Removed link"
                });
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
app.get("/api/v1/brain/:shareLink", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var hash, link, content, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                hash = req.params.shareLink;
                if (!hash) {
                    return [2 /*return*/, res.status(400).json({ message: "shareLink parameter is required" })];
                }
                return [4 /*yield*/, db_3.LinkModel.findOne({ hash: hash })];
            case 1:
                link = _a.sent();
                if (!link) {
                    return [2 /*return*/, res.status(404).json({ message: "Sorry, incorrect input" })];
                }
                return [4 /*yield*/, db_2.ContentModel.find({ userId: link.userId })];
            case 2:
                content = _a.sent();
                return [4 /*yield*/, db_1.UserModel.findOne({ _id: link.userId })];
            case 3:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                }
                res.json({
                    username: user.username,
                    content: content
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error("Error fetching brain share:", error_1);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.listen(3000);
console.log("Successfully running on the port");
