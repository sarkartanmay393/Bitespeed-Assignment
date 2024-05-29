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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contact_1 = __importDefault(require("../models/contact"));
const sequelize_1 = require("sequelize");
const Identify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phoneNumber } = req.body;
        if (!email && !phoneNumber) {
            return res
                .status(400)
                .json({ error: "Email or phone number is required" });
        }
        let primaryContact = null;
        const matchedContacts = yield contact_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [{ email }, { phoneNumber }],
            },
            order: [["createdAt", "ASC"]],
        });
        if (matchedContacts.length && !matchedContacts[0].linkedId) {
            primaryContact = matchedContacts[0];
        }
        else if (matchedContacts.length && matchedContacts[0].linkedId) {
            primaryContact = yield contact_1.default.findOne({
                where: { id: matchedContacts[0].linkedId },
            });
        }
        if (!primaryContact) {
            const newPrimaryContact = yield contact_1.default.create({
                email,
                phoneNumber,
                linkPrecedence: "primary",
            });
            return res.status(200).json({
                contact: {
                    primaryContactId: newPrimaryContact.id,
                    emails: [newPrimaryContact.email],
                    phoneNumbers: [newPrimaryContact.phoneNumber],
                    secondaryContactIds: [],
                },
            });
        }
        yield Promise.all(matchedContacts.map((mc) => __awaiter(void 0, void 0, void 0, function* () {
            if (mc.id !== primaryContact.id && mc.linkPrecedence !== "secondary") {
                mc.linkPrecedence = "secondary";
                mc.linkedId = primaryContact.id;
                yield mc.save();
            }
        })));
        const secondaryContacts = yield contact_1.default.findAll({
            where: { linkedId: primaryContact === null || primaryContact === void 0 ? void 0 : primaryContact.id },
        });
        if (email && phoneNumber) {
            const emailMatchedRecords = yield contact_1.default.count({
                where: {
                    email,
                },
            });
            const numberMatchedRecords = yield contact_1.default.count({
                where: {
                    phoneNumber,
                },
            });
            if (!(emailMatchedRecords && numberMatchedRecords)) {
                const [contact] = yield contact_1.default.findOrCreate({
                    where: { email, phoneNumber },
                    defaults: {
                        email,
                        phoneNumber,
                        linkPrecedence: "secondary",
                        linkedId: primaryContact === null || primaryContact === void 0 ? void 0 : primaryContact.id,
                    },
                });
                secondaryContacts.push(contact);
            }
        }
        const listOfRelatedContact = [primaryContact, ...secondaryContacts];
        const emails = [
            ...new Set(listOfRelatedContact
                .map((contact) => contact.email)
                .filter(Boolean)),
        ];
        const phoneNumbers = [
            ...new Set(listOfRelatedContact
                .map((contact) => contact.phoneNumber)
                .filter(Boolean)),
        ];
        return res.status(200).json({
            contact: {
                primaryContactId: primaryContact === null || primaryContact === void 0 ? void 0 : primaryContact.id,
                emails,
                phoneNumbers,
                secondaryContactIds: secondaryContacts.map((sc) => sc.id),
            },
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({
            error: {
                message: error.message,
            },
        });
    }
});
exports.default = Identify;
