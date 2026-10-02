"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createContactAction } from "@/actions/contactActions";
import { toast } from "sonner";
import { useState } from "react";

const contactSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().min(1, "Email is required").email("Valid email address is required"),
  company: z.string().min(1, "Company Name is required"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactGrid() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await createContactAction(data);
      if (res.success) {
        toast.success(res.message || "Message sent successfully!");
        reset();
      } else {
        toast.error(res.error || "Failed to send message");
      }
    } catch (err: any) {
      toast.error("An error occurred while sending message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Address",
      content: "1st Floor, Palmarcade, Horamavu Main Road, Kalkere, Bengaluru - 560043",
      href: "https://maps.google.com/?q=1st+Floor,Palmarcade,Horamavu+Main+Road,Kalkere,Bengaluru-560043",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "contact@unifirolabs.com",
      href: "mailto:contact@unifirolabs.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 91588 57575",
      href: "tel:+919158857575",
    },
  ];

  const inputClasses =
    "w-full bg-[#0A0A0A] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300 text-sm";

  return (
    <section className="container mx-auto px-4 max-w-6xl py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Contact Info Cards (Left Column) */}
        <div className="lg:col-span-1 flex flex-col justify-between space-y-6 lg:space-y-0 lg:h-full gap-6">
          {contactInfo.map((info, idx) => (
            <motion.a
              key={idx}
              href={info.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex-1 flex flex-col items-center justify-center p-8 rounded-[30px] bg-gradient-to-r from-[#2B547E] via-[#1A2530] to-[#0A0A0A] border border-white/5 shadow-2xl relative overflow-hidden group"
            >
              {/* Inner Glow Effect */}
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-5">
                  <info.icon className="w-full h-full text-white stroke-[1px]" />
                </div>
                <h3 className="text-white text-lg font-bold mb-2">{info.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed max-w-[220px]">
                  {info.content}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Form Container (Right Column - Spans 2) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="lg:col-span-2 bg-[#0F0F0F] border border-[#333]/50 rounded-[30px] p-8 lg:p-12 shadow-2xl relative"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[#111] rounded-[30px] -z-10" />
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Get in Touch — Unifiro Labs</h2>
            <p className="text-sm text-gray-400">Fill out the form below to connect with our strategic growth & engineering team.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white ml-1">First Name *</label>
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="John"
                  className={inputClasses}
                />
                {errors.firstName && <p className="text-xs text-red-400 font-medium pl-1">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white ml-1">Last Name *</label>
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Doe"
                  className={inputClasses}
                />
                {errors.lastName && <p className="text-xs text-red-400 font-medium pl-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white ml-1">Business Email *</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="john@company.com"
                  className={inputClasses}
                />
                {errors.email && <p className="text-xs text-red-400 font-medium pl-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white ml-1">Company Name *</label>
                <input
                  {...register("company")}
                  type="text"
                  placeholder="Your Company Name"
                  className={inputClasses}
                />
                {errors.company && <p className="text-xs text-red-400 font-medium pl-1">{errors.company.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white ml-1">Phone Number (Optional)</label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="+91 98765-43210"
                className={inputClasses}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white ml-1">How can we help? *</label>
              <textarea
                {...register("message")}
                rows={4}
                placeholder="Tell us about your project, technology challenges, or business objectives..."
                className={`${inputClasses} resize-none`}
              />
              {errors.message && <p className="text-xs text-red-400 font-medium pl-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:brightness-110 text-white text-base font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 disabled:opacity-60"
            >
              {isSubmitting ? "Sending Message..." : "Submit Inquiry"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
