"use server";

import { connectToDatabase } from "@/lib/db";
import { Contact } from "@/models/Contact";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const contactSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().min(1, "Company Name is required"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export async function createContactAction(rawData: any) {
  try {
    await connectToDatabase();

    const parsed = contactSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const contact = await Contact.create(parsed.data);

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      contact: JSON.parse(JSON.stringify(contact)),
      message: "Message submitted successfully! We will reach out to you shortly.",
    };
  } catch (error: any) {
    console.error("createContactAction error:", error);
    return { success: false, error: error.message || "Failed to submit message" };
  }
}

export async function getContactsAction() {
  try {
    await connectToDatabase();

    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();

    return {
      success: true,
      contacts: JSON.parse(JSON.stringify(contacts)),
    };
  } catch (error: any) {
    console.error("getContactsAction error:", error);
    return { success: false, contacts: [], error: error.message };
  }
}

export async function deleteContactAction(id: string) {
  try {
    await connectToDatabase();
    await Contact.findByIdAndDelete(id);
    revalidatePath("/admin/dashboard");
    return { success: true, message: "Contact deleted successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
