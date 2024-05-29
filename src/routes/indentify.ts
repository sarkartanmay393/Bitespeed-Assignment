import { Request, Response } from "express";
import Contact from "../models/contact";
import { Op } from "sequelize";

const Identify = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({ error: "Email or phone number is required" });
    }

    let primaryContact: Contact | null = null;
    const matchedContacts = await Contact.findAll({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
      order: [["createdAt", "ASC"]],
    });

    if (matchedContacts.length && !matchedContacts[0].linkedId) {
      primaryContact = matchedContacts[0];
    } else if (matchedContacts.length && matchedContacts[0].linkedId) {
      primaryContact = await Contact.findOne({
        where: { id: matchedContacts[0].linkedId },
      });
    }

    if (!primaryContact) {
      const newPrimaryContact = await Contact.create({
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

    await Promise.all(
      matchedContacts.map(async (mc) => {
        if (mc.id !== primaryContact.id && mc.linkPrecedence !== "secondary") {
          mc.linkPrecedence = "secondary";
          mc.linkedId = primaryContact.id;
          await mc.save();
        }
      })
    );

    const secondaryContacts = await Contact.findAll({
      where: { linkedId: primaryContact?.id },
    });

    if (email && phoneNumber) {
      const emailMatchedRecords = await Contact.count({
        where: {
          email,
        },
      });
      const numberMatchedRecords = await Contact.count({
        where: {
          phoneNumber,
        },
      });

      if (!(emailMatchedRecords && numberMatchedRecords)) {
        const [contact] = await Contact.findOrCreate({
          where: { email, phoneNumber },
          defaults: {
            email,
            phoneNumber,
            linkPrecedence: "secondary",
            linkedId: primaryContact?.id,
          },
        });
        secondaryContacts.push(contact);
      }
    }

    const listOfRelatedContact = [primaryContact, ...secondaryContacts];

    const emails = [
      ...new Set(
        listOfRelatedContact
          .map((contact) => contact.email)
          .filter(Boolean) as string[]
      ),
    ];

    const phoneNumbers = [
      ...new Set(
        listOfRelatedContact
          .map((contact) => contact.phoneNumber)
          .filter(Boolean) as string[]
      ),
    ];

    return res.status(200).json({
      contact: {
        primaryContactId: primaryContact?.id,
        emails,
        phoneNumbers,
        secondaryContactIds: secondaryContacts.map((sc) => sc.id),
      },
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
};

export default Identify;
