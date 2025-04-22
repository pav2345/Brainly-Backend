"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.ContentModel = exports.UserModel = void 0;
var mongoose_1 = require("mongoose");
mongoose_1.default.connect("mongodb+srv://pavan:fc2GiUQDRZFkMtA8@cluster0.hyhj3.mongodb.net/brainly");
var UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true },
    password: String
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
var ContentSchema = new mongoose_1.Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true }
});
exports.ContentModel = (0, mongoose_1.model)("Content", ContentSchema);
var LinkSchema = new mongoose_1.Schema({
    hash: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true, unique: true },
});
exports.LinkModel = (0, mongoose_1.model)("Links", LinkSchema);
