import { Request, Response } from "express";

const Identify = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({ error: "Email or phone number is required" });
    }
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
