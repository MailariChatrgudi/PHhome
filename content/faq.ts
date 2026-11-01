/**
 * content/faq.ts
 *
 * Site-wide FAQ items used on the /faq page and the FAQPage JSON-LD schema.
 * These are general questions about the business — not medical advice.
 * OWNER-REVIEW: Verify all answers before launch.
 */

// OWNER-REVIEW

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const faqs: FaqItem[] = [
  // ─── Services ──────────────────────────────────────────────────────────────
  {
    category: "Services",
    question: "What services does PH Home Nursing Services provide?",
    answer:
      "We provide home nursing, elderly care, post-hospital recovery support, dementia care, bedside attendants, mother and baby care, hospital special nursing, live-in caretakers, and patient transport in Bengaluru.",
  },
  {
    category: "Services",
    question: "Do you provide care outside Bengaluru?",
    answer:
      "We currently serve Bengaluru. Contact us to discuss availability in nearby areas.", // OWNER-CONFIRM
  },
  {
    category: "Services",
    question: "Can I get nursing care for a single day?",
    answer:
      "Yes, we can arrange one-time visits as well as ongoing care. Please call us to discuss your needs.", // OWNER-CONFIRM
  },

  // ─── Booking ───────────────────────────────────────────────────────────────
  {
    category: "Booking",
    question: "How do I book a caregiver?",
    answer:
      "You can call us, send a WhatsApp message, or use the request form on this website. We will contact you to discuss requirements and arrange care.",
  },
  {
    category: "Booking",
    question: "How quickly can care be arranged?",
    answer:
      "We aim to arrange care as quickly as possible. For urgent needs, please call us directly.", // OWNER-CONFIRM
  },
  {
    category: "Booking",
    question: "Can I change or cancel a booking?",
    answer:
      "Please contact us as soon as possible if you need to change or cancel. We will do our best to accommodate.", // OWNER-CONFIRM
  },

  // ─── Caregivers ────────────────────────────────────────────────────────────
  {
    category: "Caregivers",
    question: "Are your caregivers trained?",
    answer:
      "Our caregivers receive training appropriate to their role. Contact us for details about specific qualifications.", // OWNER-CONFIRM
  },
  {
    category: "Caregivers",
    question: "What if I am not happy with the assigned caregiver?",
    answer:
      "Please contact us immediately. We will work to find a more suitable match.", // OWNER-CONFIRM
  },

  // ─── Equipment ─────────────────────────────────────────────────────────────
  {
    category: "Equipment",
    question: "Do you provide medical equipment?",
    answer:
      "We primarily provide caregiving and nursing services. Please contact us to discuss whether equipment can be arranged for specific needs.", // OWNER-CONFIRM: old site mentioned equipment rental — confirm if offered
  },

  // ─── Privacy & Data ────────────────────────────────────────────────────────
  {
    category: "Privacy",
    question: "What happens to the information I submit in the enquiry form?",
    answer:
      "The details you provide are sent directly to our team by email. They are not stored on this website.",
  },
];

/** All unique categories, in display order */
export const faqCategories = [
  ...new Set(faqs.map((f) => f.category)),
];
