// OWNER-REVIEW: Verify all service copy, procedures, and inclusions before production launch.
/**
 * content/services.ts
 *
 * All service page data. Slugs drive generateStaticParams in app/(site)/services/[slug]/page.tsx.
 * Copy text is marked OWNER-REVIEW — the owner must verify every claim before launch.
 * Follows strict 'no invented content' rule (build-prompt §3): no fake certifications,
 * no invented statistics, no medical advice.
 */

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  name: string;
  image?: string; // photo path for service cards
  accent?: 'blue' | 'plum' | 'amber' | 'green'; // Phase 4 group accent colour
  shortDescription: string; // ~1 line, used in cards
  metaTitle: string; // ≤60 chars
  metaDescription: string; // ≤160 chars
  keyword: string; // Primary keyword theme
  categoryTag: string; // Badge chip on cards
  intro: string; // 2–3 sentences for the page intro
  included: string[]; // what's included checklist
  whoItSuits: string; // detailed paragraph
  howItWorks: string; // detailed step-by-step paragraph
  whatToPrepare: string; // practical preparation instructions
  equipmentNote?: string; // guidance on equipment rental/setup if relevant
  faqs: ServiceFaq[];
  relatedSlugs: string[]; // 2 related service slugs
}

export const services: Service[] = [
  // ── 1. Home Nursing ────────────────────────────────────────────────────────
  {
    slug: 'home-nursing',
    accent: 'blue',
    name: 'Home Nursing',
    shortDescription: 'Skilled nursing care delivered by qualified nurses in the comfort of your home.',
    metaTitle: 'Home Nursing Services in Bengaluru',
    metaDescription:
      'Trained home nurses in Bengaluru for wound care, IV therapy, medication management, injections, and post-operative recovery. Call PH Home Nursing Services.',
    keyword: 'home nurse at home Bengaluru',
    categoryTag: 'Skilled Medical Care',
    intro:
      'Our home nursing service brings professional nursing care directly to your doorstep across Bengaluru. When a loved one requires clinical attention after a hospital discharge or during ongoing illness, staying at home reduces stress and lowers the risk of hospital-acquired infections. Our trained nurses deliver gentle, dependable care under your treating doctor’s instructions.',
    included: [
      'Wound dressing, surgical suture care, and bedsore management', // OWNER-CONFIRM
      'Prescribed medication administration and injection support', // OWNER-CONFIRM
      'Intravenous (IV) fluid therapy and cannula management', // OWNER-CONFIRM
      'Urinary catheter insertion, replacement, and hygiene care', // OWNER-CONFIRM
      'Regular vital signs monitoring: blood pressure, pulse, temperature, and blood sugar', // OWNER-CONFIRM
      'Tracheostomy and nebulisation support where indicated', // OWNER-CONFIRM
      'Care log maintenance and regular condition updates for the family and doctor', // OWNER-CONFIRM
    ],
    whoItSuits:
      'This service is suited for patients recovering from surgery, individuals managing chronic conditions like diabetes or cardiac recovery, and bedbound patients requiring routine clinical procedures. It is especially helpful for families who want to avoid frequent, exhausting trips to hospitals or clinics for routine procedures such as daily dressings, injections, or fluid administration. Whether care is required for a single morning visit, several hours a day, or continuous daily shifts, home nursing bridges the gap between hospital care and independent recovery.',
    howItWorks:
      'Getting started begins with a phone conversation or enquiry form where you share the patient’s condition and medical requirements. We review the prescription and doctor’s discharge summary to understand the exact clinical needs. Based on this, we schedule a suitable nurse for single visits, half-day shifts, or full-day care. On arrival, the nurse reviews current orders, carries out the required medical procedures with sterile equipment, documents vital statistics, and explains observations clearly to the primary family caregiver.',
    whatToPrepare:
      'Please keep the patient’s recent discharge summary, current doctor prescriptions, and any specific medication supplies readily available. A clean, well-lighted space near the patient’s bed with access to running water and clean towels helps our nurse set up sterile supplies quickly. If you have existing monitoring devices like a glucometer or digital BP monitor, having them on hand is also recommended.',
    equipmentNote:
      'If your patient requires specialised equipment such as an IV stand, hospital bed, suction unit, or oxygen concentrator, let us know during booking so we can guide you on rental and setup arrangements.',
    faqs: [
      {
        question: 'Are your home nurses formally trained and qualified?',
        answer:
          'Our nurses possess nursing qualifications (GNM or B.Sc Nursing) and clinical training. They follow standard hygiene, safety, and patient care protocols. Specific staff qualifications can be shared upon request.', // OWNER-CONFIRM
      },
      {
        question: 'What parts of Bengaluru do you provide home nursing in?',
        answer:
          'We serve locations across Bengaluru including North, South, East, and West zones. Contact us with your area name and pincode to confirm nurse availability for your required shift timings.', // OWNER-CONFIRM
      },
      {
        question: 'Can I request a nurse for just one visit, such as an injection or dressing?',
        answer:
          'Yes. We arrange single-procedure visits for wound dressings, catheter changes, and injection administration, as well as recurring daily or weekly nursing visits depending on your doctor’s orders.', // OWNER-CONFIRM
      },
      {
        question: 'Does the nurse coordinate with our treating doctor?',
        answer:
          'Our nurses strictly follow the treatment plan prescribed by your doctor. The nurse maintains a daily record of vital signs, fluid intake, and medication charts that your family can readily share with the treating physician.', // OWNER-CONFIRM
      },
    ],
    relatedSlugs: ['elderly-care', 'post-hospital-care'],
  },

  // ── 2. Elderly Care ────────────────────────────────────────────────────────
  {
    slug: 'elderly-care',
    accent: 'plum',
    name: 'Elderly Care',
    shortDescription: 'Compassionate daily assistance, mobility support, and companionship for older adults.',
    metaTitle: 'Elderly Care at Home in Bengaluru',
    metaDescription:
      'Compassionate elderly care at home in Bengaluru. Daily personal assistance, mobility support, medication reminders, and companionship for senior citizens.',
    keyword: 'elderly care at home Bengaluru',
    categoryTag: 'Senior Support',
    intro:
      'Our elderly care service offers compassionate, respectful assistance to help older adults live safely and comfortably in their familiar home environment. Many seniors wish to stay in their own homes but need steady, gentle help with day-to-day activities. Our caregivers offer physical support, attentive supervision, and genuine companionship, giving families complete peace of mind throughout the day.',
    included: [
      'Assistance with personal grooming, bathing, oral hygiene, and dressing', // OWNER-CONFIRM
      'Safe transfer assistance: bed to chair, walking support, and fall prevention', // OWNER-CONFIRM
      'Timely medication reminders as per the doctor’s schedule', // OWNER-CONFIRM
      'Meal assistance, feeding support, and hydration monitoring', // OWNER-CONFIRM
      'Light mobility exercises and gentle walking accompaniment', // OWNER-CONFIRM
      'Friendly companionship, conversation, and reading assistance', // OWNER-CONFIRM
      'Daily communication with family members regarding appetite and mood', // OWNER-CONFIRM
    ],
    whoItSuits:
      'Elderly care is ideal for aging parents living on their own, seniors with age-related frailty or limited mobility, and older adults whose family members work during the day. It is equally suited for seniors coping with arthritis, mild forgetfulness, or general weakness following an illness. By having a reliable caregiver present, families reduce the risk of accidental falls while ensuring that meals, medications, and personal hygiene routines are maintained with dignity.',
    howItWorks:
      'We start by discussing your loved one’s personal routine, personality, mobility level, and any particular medical conditions. We then match a kind, patient caregiver who understands their language and cultural preferences. The caregiver arrives according to your chosen schedule—whether day shifts, night shifts, or round-the-clock living support. They build a trusting bond with your elder, respecting their independence while providing watchful care.',
    whatToPrepare:
      'Share details of your parent’s typical daily timetable, meal preferences, dietary restrictions, and scheduled medicine times. Ensure walking areas are clear of loose rugs or obstacles to facilitate safe movement. Having mobility aids such as a walker or walking stick accessible in their room is also beneficial.',
    equipmentNote:
      'For seniors with reduced mobility, we can provide guidance on helpful home aids such as commode chairs, anti-decubitus air mattresses, and support bars for bathrooms.',
    faqs: [
      {
        question: 'Can the caregiver prepare meals for my elderly parents?',
        answer:
          'Caregivers assist with heating, serving, and feeding meals according to the elder’s dietary routine. They can also assist with simple nutritional preparations like porridge or soups as agreed with the family.', // OWNER-CONFIRM
      },
      {
        question: 'Can we request a female or male caregiver based on preference?',
        answer:
          'Yes, we accommodate gender preferences whenever possible to ensure your parent feels completely comfortable with their personal hygiene and care routine.', // OWNER-CONFIRM
      },
      {
        question: 'What happens if our assigned caregiver is unwell or needs leave?',
        answer:
          'We coordinate a replacement caregiver whenever feasible so that your family’s daily care schedule experiences minimal disruption. We communicate any schedule updates in advance.', // OWNER-CONFIRM
      },
      {
        question: 'Do you offer round-the-clock or overnight elderly care?',
        answer:
          'Yes, we provide both 12-hour day/night shifts and 24-hour live-in care arrangements. Please contact us to discuss the best schedule for your family.', // OWNER-CONFIRM
      },
    ],
    relatedSlugs: ['live-in-caretaker', 'dementia-care'],
  },

  // ── 3. Post-Hospital Care ──────────────────────────────────────────────────
  {
    slug: 'post-hospital-care',
    accent: 'blue',
    name: 'Post-Hospital Care',
    shortDescription: 'Structured recovery support and clinical monitoring after surgery or hospital discharge.',
    metaTitle: 'Post-Hospital Care at Home in Bengaluru',
    metaDescription:
      'Structured post-surgical recovery care at home in Bengaluru. Wound dressings, medication monitoring, and recovery support from PH Home Nursing Services.',
    keyword: 'post operative care at home Bengaluru',
    categoryTag: 'Recovery & Post-Op',
    intro:
      'Returning home after surgery or a hospital admission is an important milestone, but the first two to three weeks of recovery are critical. Our post-hospital care service provides dedicated nursing and recovery assistance tailored specifically to your doctor’s discharge instructions. We help patients regain strength safely while preventing surgical complications, infections, and avoidable readmissions.',
    included: [
      'Surgical wound assessment, sterile dressings, and suture/staple observation', // OWNER-CONFIRM
      'Discharge medication schedule tracking and administration', // OWNER-CONFIRM
      'Monitoring for signs of post-operative infection, fever, or swelling', // OWNER-CONFIRM
      'Assistance with gentle post-operative mobilising and deep breathing routines', // OWNER-CONFIRM
      'Drain care, catheter monitoring, and output fluid recording', // OWNER-CONFIRM
      'Pain management monitoring and comfort positioning', // OWNER-CONFIRM
      'Coordination support for follow-up doctor appointments and lab sample collection', // OWNER-CONFIRM
    ],
    whoItSuits:
      'This service is designed for patients discharged following orthopaedic surgeries (such as total knee or hip replacements), cardiac procedures, abdominal surgeries, neurological events like stroke, or prolonged medical hospitalisations. It is equally valuable for families who feel anxious about managing complex wound dressings, surgical drains, or multi-drug timetables without professional healthcare guidance at home.',
    howItWorks:
      'Before or immediately upon discharge, you share the hospital discharge summary and prescription with our coordinator. We develop a clear, personalized recovery plan reflecting your surgeon’s guidelines. We assign a skilled nurse or experienced attendant who visits daily or stays on continuous duty. During every shift, the caregiver follows clinical hygiene protocols, records vital signs, monitors wound healing, and helps the patient safely transition back to daily life.',
    whatToPrepare:
      'Please have the complete hospital discharge folder ready, including the discharge summary, medication list, follow-up consultation dates, and emergency doctor contact numbers. Ensure that prescribed medications, dressing kits, and antiseptic solutions purchased from the hospital pharmacy are accessible.',
    equipmentNote:
      'Many post-surgical patients benefit from temporary equipment like medical beds with side rails, walker frames, commode chairs, or DVT pump sleeves. We can assist your family with renting or acquiring these items.',
    faqs: [
      {
        question: 'When should we book post-hospital care?',
        answer:
          'We recommend contacting us 24 to 48 hours before the expected discharge date. This allows adequate time to review discharge notes and assign the right nurse before the patient arrives home.', // OWNER-CONFIRM
      },
      {
        question: 'How long does post-hospital care usually last?',
        answer:
          'Duration depends on the nature of the surgery and the doctor’s recommendations. Many families book our team for 7 to 21 days until surgical sutures are removed and the patient regains stable mobility.', // OWNER-CONFIRM
      },
      {
        question: 'Can your team help with physiotherapy exercises?',
        answer:
          'Our caregivers assist patients with doctor-prescribed mobility routines and walking practice. For formal rehabilitation, we can coordinate with your qualified physiotherapist.', // OWNER-CONFIRM
      },
      {
        question: 'What if surgical complications or sudden fever arise?',
        answer:
          'Our nurses immediately report any abnormal signs—such as wound discharge, sudden fever, or high blood pressure—to the family and advise contacting the treating hospital or emergency services right away.', // OWNER-CONFIRM
      },
    ],
    relatedSlugs: ['home-nursing', 'bedside-attendants'],
  },

  // ── 4. Dementia Care ───────────────────────────────────────────────────────
  {
    slug: 'dementia-care',
    accent: 'plum',
    name: 'Dementia Care',
    shortDescription: 'Specialised, patient support for individuals living with dementia or Alzheimer’s disease.',
    metaTitle: 'Dementia Care at Home in Bengaluru',
    metaDescription:
      'Compassionate dementia and Alzheimer’s care at home in Bengaluru. Patient, trained caregivers who maintain calm routines and ensure patient safety.',
    keyword: 'dementia care at home Bengaluru',
    categoryTag: 'Memory Care',
    intro:
      'Caring for someone with dementia or Alzheimer’s disease requires extraordinary patience, deep empathy, and a calm, familiar environment. Unfamiliar surroundings can cause confusion and disorientation for individuals with memory loss. Our specialised dementia care service supports patients at home with structured routines, dignified assistance, and continuous safety supervision.',
    included: [
      'Constant watchful supervision to prevent wandering and domestic accidents', // OWNER-CONFIRM
      'Assistance with bathing, dressing, grooming, and toilet hygiene with gentleness', // OWNER-CONFIRM
      'Structured daily routine maintenance for meals, quiet time, and sleep schedules', // OWNER-CONFIRM
      'Patient de-escalation and soothing communication during periods of sundowning or confusion', // OWNER-CONFIRM
      'Engaging mental stimulation: photo viewing, storytelling, music, and simple crafts', // OWNER-CONFIRM
      'Supervised medication administration according to the neurologist’s prescription', // OWNER-CONFIRM
      'Ongoing emotional support and regular updates for family caregivers', // OWNER-CONFIRM
    ],
    whoItSuits:
      'This care is tailored for seniors diagnosed with Alzheimer’s disease, vascular dementia, Lewy body dementia, or frontotemporal memory conditions. It is especially beneficial for families facing caregiver burnout, anxiety about nighttime wandering, or behavioural changes such as agitation and confusion. Our presence allows family members to spend meaningful, loving time with their elder while professional caregivers handle the demanding daily physical supervision.',
    howItWorks:
      'We conduct a comprehensive intake discussion regarding the patient’s diagnosis, stage of dementia, communication habits, familiar routines, and known triggers for agitation. We then match a caregiver experienced in memory care who brings an empathetic, respectful demeanor. The caregiver focuses on establishing a predictable, reassuring day-to-day routine that reduces anxiety, maintains hygiene, and protects the elder’s physical safety.',
    whatToPrepare:
      'Share details about the patient’s past interests, favourite music, familiar family nicknames, and preferred foods. It is also helpful to secure household hazards, such as locking away medications, securing balconies or exterior gates, and ensuring adequate nighttime lighting in hallways and bathrooms to prevent confusion.',
    equipmentNote:
      'Bed alarms, sensor mats, and door safety chimes can be recommended to alert caregivers when the patient gets out of bed at night, minimizing fall and wandering risks.',
    faqs: [
      {
        question: 'How do your caregivers handle agitation or stubbornness?',
        answer:
          'Our caregivers are trained in dementia communication techniques: speaking calmly, validating feelings rather than arguing, using gentle redirection, and avoiding overwhelming multi-step instructions.', // OWNER-CONFIRM
      },
      {
        question: 'Do you offer 24-hour live-in care for advanced dementia stages?',
        answer:
          'Yes. Round-the-clock live-in care is frequently chosen by families caring for advanced dementia patients to ensure someone is constantly awake or immediately accessible during the night.', // OWNER-CONFIRM
      },
      {
        question: 'Can the same caregiver be assigned consistently?',
        answer:
          'Consistency is critical for dementia patients. We make every effort to maintain the same primary caregiver so that the patient does not experience the stress of adapting to new faces.', // OWNER-CONFIRM
      },
      {
        question: 'Will the caregiver take the patient for walks outside?',
        answer:
          'Yes, if the family approves and the patient’s physical condition permits, the caregiver can accompany the patient for calm, supervised walks within the residential compound or garden.', // OWNER-CONFIRM
      },
    ],
    relatedSlugs: ['elderly-care', 'live-in-caretaker'],
  },

  // ── 5. Bedside Attendants ──────────────────────────────────────────────────
  {
    slug: 'bedside-attendants',
    accent: 'plum',
    name: 'Bedside Attendants',
    shortDescription: 'Dedicated patient attendants for continuous hands-on assistance at home or in hospital.',
    metaTitle: 'Bedside Attendants in Bengaluru | Patient Care',
    metaDescription:
      'Trained bedside attendants in Bengaluru for home and hospital assistance. Continuous physical care, mobility, feeding, and personal hygiene support.',
    keyword: 'patient attendant Bengaluru',
    categoryTag: 'Hands-on Assistance',
    intro:
      'When an illness or injury leaves a patient bedridden or unable to manage basic physical needs independently, a dedicated bedside attendant provides steady, hands-on care. Working in private homes as well as hospital wards across Bengaluru, our attendants assist with personal hygiene, feeding, position changes, and basic comfort throughout the day and night.',
    included: [
      'Complete sponge baths, oral hygiene, hair care, and skin barrier application', // OWNER-CONFIRM
      'Assistance with bedpan, urinal, and adult diaper changes with strict hygiene', // OWNER-CONFIRM
      'Regular two-hour turning and repositioning to prevent painful pressure ulcers (bedsores)', // OWNER-CONFIRM
      'Assisting with feeding, fluid intake, and tracking daily hydration', // OWNER-CONFIRM
      'Supporting transfers between bed, wheelchair, and commode', // OWNER-CONFIRM
      'Monitoring patient alertness and promptly notifying family or nurses of changes', // OWNER-CONFIRM
      'Maintaining a tidy, clean, and comfortable immediate bedside environment', // OWNER-CONFIRM
    ],
    whoItSuits:
      'Bedside attendants are ideal for patients who do not require intensive clinical medical procedures but need continuous physical assistance. This includes patients recovering from major fractures, paralytic conditions, stroke, terminal illnesses, or those who are temporarily bedridden in hospital wards where family members cannot stay overnight due to work or care commitments.',
    howItWorks:
      'Tell us the patient’s location (home address or hospital name and ward), their mobility condition, and whether you require 12-hour or 24-hour shift coverage. We assign a trained, physically capable attendant who arrives promptly, introduces themselves, and assumes responsibility for daily hygiene, repositioning, and feeding routines under family guidance.',
    whatToPrepare:
      'For home care, please prepare basic care supplies including adult diapers, wet wipes, barrier creams, clean bed linens, and a waterproof mattress protector. For hospital duty, confirm with the hospital ward sister or administration that private bedside attendants are permitted.',
    equipmentNote:
      'We can assist families with recommendations for air mattresses (bubble or tube type), hospital backrests, commode chairs, and suction equipment if the patient has difficulty clearing oral secretions.',
    faqs: [
      {
        question: 'What is the difference between a nurse and a bedside attendant?',
        answer:
          'A nurse performs clinical medical tasks such as IV lines, injections, wound dressings, and catheter insertions. A bedside attendant focuses on essential physical care: bathing, diaper changes, feeding, repositioning, and comfort.', // OWNER-CONFIRM
      },
      {
        question: 'Can the bedside attendant stay overnight at the hospital?',
        answer:
          'Yes, provided the hospital ward permits private patient attendants. Our attendants are accustomed to overnight hospital duties and keep a watchful eye while you rest.', // OWNER-CONFIRM
      },
      {
        question: 'Are your attendants trained to move heavy or immobile patients?',
        answer:
          'Our attendants are trained in proper body mechanics and safe lifting techniques to turn, reposition, and transfer patients comfortably without causing strain or injury.', // OWNER-CONFIRM
      },
      {
        question: 'Can we book an attendant for a week while family is travelling?',
        answer:
          'Yes, we provide flexible arrangements ranging from short-term emergency respite (several days) to long-term ongoing monthly assignments.', // OWNER-CONFIRM
      },
    ],
    relatedSlugs: ['home-nursing', 'post-hospital-care'],
  },

  // ── 6. Mother and Baby Care ────────────────────────────────────────────────
  {
    slug: 'mother-and-baby-care',
    accent: 'amber',
    name: 'Mother and Baby Care',
    shortDescription: 'Supportive postnatal care and newborn assistance in the comfort of your home.',
    metaTitle: 'Mother and Baby Care at Home in Bengaluru',
    metaDescription:
      'Caring postnatal support for mothers and newborns in Bengaluru. Bathing, lactation guidance, recovery assistance, and newborn hygiene support.',
    keyword: 'postnatal care at home Bengaluru',
    categoryTag: 'Maternal & Newborn',
    intro:
      'The initial weeks following childbirth are filled with profound joy, but they also bring physical exhaustion and emotional vulnerability. Our mother and baby care service provides tender, supportive assistance to new mothers as they heal from delivery, while ensuring the newborn receives attentive, hygienic care in the comfort of your home.',
    included: [
      'Traditional, gentle newborn massage and warm water bathing techniques', // OWNER-CONFIRM
      'Careful umbilical cord stump hygiene and diaper rash prevention', // OWNER-CONFIRM
      'Postnatal recovery support for the mother, including rest assistance and nutritional hydration', // OWNER-CONFIRM
      'Support with breastfeeding positioning, latching comfort, and burping routines', // OWNER-CONFIRM
      'Nighttime soothing and diaper changing so the mother can get restorative sleep', // OWNER-CONFIRM
      'Sterilising feeding bottles, breast pump accessories, and baby feeding items', // OWNER-CONFIRM
      'Monitoring mother’s episiotomy or C-section incision for proper healing', // OWNER-CONFIRM
    ],
    whoItSuits:
      'This service is designed for first-time parents navigating newborn routines, mothers recovering from caesarean sections (C-sections) who face painful movement restrictions, and nuclear families in Bengaluru without extended family nearby to assist. Having an experienced, calm caregiver takes away the anxiety of bathing a tiny infant and ensures the mother has the rest necessary to recover fully.',
    howItWorks:
      'You can reserve care in advance of your expected delivery date or contact us right after hospital discharge. We assign a nurturing, experienced baby-care specialist (often known locally as a Jhai or postnatal caregiver) who understands newborn handling, postpartum recovery, and hygienic nursery practices. Care can be arranged for daytime assistance or 24-hour live-in support.',
    whatToPrepare:
      'Please have baby clothing, soft washcloths, gentle baby soap, coconut or baby massage oil, sterile cotton, diapers, and feeding accessories ready. For the mother, keep any obstetrician-prescribed vitamins, pain medications, and maternity pads easily accessible.',
    equipmentNote:
      'We can provide guidance on useful postnatal accessories such as electric breast pumps, bottle sterilizers, and ergonomic feeding pillows.',
    faqs: [
      {
        question: 'Can your caregiver assist after a caesarean delivery?',
        answer:
          'Yes. Post-C-section recovery requires careful handling because lifting and bending are restricted. Our caregivers assist the mother with getting in and out of bed, handing her the baby for feeding, and managing baby care tasks.', // OWNER-CONFIRM
      },
      {
        question: 'How early should we book mother and baby care?',
        answer:
          'We recommend booking 2 to 4 weeks before your expected due date to guarantee caregiver availability. If delivery happens earlier or later than expected, we adjust dates accordingly.', // OWNER-CONFIRM
      },
      {
        question: 'Does the caregiver do household cooking or cleaning?',
        answer:
          'Our mother and baby caregivers focus strictly on mother recovery and infant care, including sterilising baby utensils and baby laundry. General domestic housekeeping is not included.', // OWNER-CONFIRM
      },
      {
        question: 'How many hours a day does the caregiver stay?',
        answer:
          'We offer flexible schedules: typically 8-hour to 12-hour day shifts, overnight shifts to help with nighttime feeds, or 24-hour live-in care for the first month.', // OWNER-CONFIRM
      },
    ],
    relatedSlugs: ['home-nursing', 'bedside-attendants'],
  },

  // ── 7. Hospital Special Nursing ────────────────────────────────────────────
  {
    slug: 'hospital-nursing',
    accent: 'blue',
    name: 'Hospital Special Nursing',
    shortDescription: 'Dedicated private nurses to provide one-on-one clinical monitoring in hospital wards.',
    metaTitle: 'Hospital Special Nursing in Bengaluru',
    metaDescription:
      'Private special nurses for hospital patients in Bengaluru. Dedicated one-on-one bedside clinical attention supplementing hospital ward staff.',
    keyword: 'hospital special nurse Bengaluru',
    categoryTag: 'Clinical In-Hospital',
    intro:
      'While hospitals provide clinical coverage across entire wards, nursing ratios often mean staff must attend to dozens of patients simultaneously. When a patient is critically ill, transitioning out of an ICU, or experiencing severe post-surgical pain, having a dedicated private nurse at their bedside provides continuous, uninterrupted clinical observation and reassurance.',
    included: [
      'Continuous, dedicated one-on-one nursing observation at the hospital bedside', // OWNER-CONFIRM
      'Monitoring vital signs and alerting hospital duty doctors immediately upon changes', // OWNER-CONFIRM
      'Assisting with IV infusion flow rates, Ryle’s tube feeds, and urinary bag drainage', // OWNER-CONFIRM
      'Ensuring strict patient positioning, safety rails, and fall prevention in hospital beds', // OWNER-CONFIRM
      'Comfort measures: mouth care, skin protection, and gentle repositioning', // OWNER-CONFIRM
      'Assisting the patient during doctor rounds and diagnostic transport within the hospital', // OWNER-CONFIRM
      'Providing peace of mind for family members who are unable to be physically present', // OWNER-CONFIRM
    ],
    whoItSuits:
      'This service is intended for high-dependency patients who have been transferred from ICU to step-down wards, patients with respiratory distress, cardiac monitoring needs, post-neurosurgical recovery, or frail patients prone to confusion and pulling out tubes. It is also an invaluable resource for families whose jobs or family commitments prevent them from remaining at the patient’s hospital bedside 24 hours a day.',
    howItWorks:
      'Contact our coordinator with the hospital name, ward number, and patient condition. Before placing a special nurse, we confirm that the hospital policy permits private bedside nursing personnel. We assign an experienced clinical nurse who arrives at the start of the agreed shift (typically 12-hour day or night shifts), introduces themselves to the floor nursing station, and provides vigilant bedside care while respecting hospital clinical protocols.',
    whatToPrepare:
      'Please obtain permission from the hospital floor administration or treating doctor for a private special nurse. Provide our nurse with the patient’s admission pass, visitor badge, and details of primary family contacts to call in case of any update.',
    equipmentNote:
      'Our nurses work with the hospital’s installed medical equipment (monitors, oxygen flowmeters, infusion pumps) in full compliance with hospital biomedical safety protocols.',
    faqs: [
      {
        question: 'Do all hospitals in Bengaluru allow private special nurses?',
        answer:
          'Many private and trust hospitals permit private bedside nurses, particularly in private rooms and step-down wards. However, hospital ICU policies vary. We recommend confirming with your ward administration.', // OWNER-CONFIRM
      },
      {
        question: 'Does your special nurse administer medications in the hospital?',
        answer:
          'In hospital settings, formal medication administration is typically managed by the hospital’s own nursing staff. Our nurse assists, monitors flow rates, and alerts the hospital staff when doses or IV replacements are due.', // OWNER-CONFIRM
      },
      {
        question: 'Can the nurse accompany the patient for scans and tests?',
        answer:
          'Yes. Our nurse accompanies the patient on hospital stretcher or wheelchair transfers to radiology, pathology, or dialysis units, maintaining observation throughout.', // OWNER-CONFIRM
      },
      {
        question: 'Can we transition the same nurse to our home after discharge?',
        answer:
          'Yes, this is very common. Having the same nurse transition with the patient from hospital to home creates continuous, seamless care that comforts the patient.', // OWNER-CONFIRM
      },
    ],
    relatedSlugs: ['home-nursing', 'bedside-attendants'],
  },

  // ── 8. Live-in Caretaker ───────────────────────────────────────────────────
  {
    slug: 'live-in-caretaker',
    accent: 'plum',
    name: 'Live-in Caretaker',
    shortDescription: 'Full-time, round-the-clock caregivers residing in your home for continuous support.',
    metaTitle: 'Live-in Caretaker in Bengaluru | 24/7 Home Care',
    metaDescription:
      'Round-the-clock live-in caretakers in Bengaluru for elderly, post-operative, or bedridden patients. Dedicated full-time care in your home.',
    keyword: 'live-in caretaker Bengaluru',
    categoryTag: '24/7 Continuous Care',
    intro:
      'For families requiring continuous, round-the-clock supervision and assistance, a live-in caretaker offers the most dependable and comprehensive care solution. Residing directly in your home, the caretaker provides ongoing support throughout the day and stays alert to nighttime needs, ensuring your loved one is never left unattended or vulnerable.',
    included: [
      'Round-the-clock presence and immediate assistance both day and night', // OWNER-CONFIRM
      'Complete assistance with all activities of daily living: bathing, grooming, and dressing', // OWNER-CONFIRM
      'Medication management and timely reminders throughout the day', // OWNER-CONFIRM
      'Meal preparation support, dietary assistance, and feeding help', // OWNER-CONFIRM
      'Nighttime assistance with bathroom visits, diaper changes, and repositioning', // OWNER-CONFIRM
      'Mobility encouragement, fall prevention, and gentle indoor walking support', // OWNER-CONFIRM
      'Dedicated companionship and prompt emergency alerts to family members', // OWNER-CONFIRM
    ],
    whoItSuits:
      'Live-in care is ideally suited for bedbound seniors, patients with moderate to severe dementia, individuals living with advanced Parkinson’s disease, or patients recovering from severe strokes. It is also the preferred option for aging parents whose children reside abroad or in different cities, providing families with continuous reassurance that an attentive, trustworthy professional is always on site.',
    howItWorks:
      'We begin with an in-depth consultation regarding the patient’s medical diagnosis, daily routine, personality, language preference, and household setup. We select a vetted, experienced live-in caretaker who relocates to your residence. The caretaker is allocated a private room or comfortable sleeping quarters and integrates into the family routine, delivering structured daytime care and nighttime emergency support.',
    whatToPrepare:
      'Families should provide the live-in caregiver with clean, private sleeping accommodation, access to bathroom facilities, and meals. A clear briefing on house rules, emergency medical contacts, hospital preferences, and daily medication schedules should be prepared prior to the caregiver’s arrival.',
    equipmentNote:
      'For long-term bedbound patients, we encourage equipping the home with a hospital-grade adjustable bed, anti-bedsore ripple mattress, and an emergency bedside call bell.',
    faqs: [
      {
        question: 'How do rest periods work for a 24-hour live-in caregiver?',
        answer:
          'While the caretaker resides at the home 24 hours a day, they require regular sleep (approx. 7–8 hours at night) and reasonable personal break periods during the day to remain alert and healthy.', // OWNER-CONFIRM
      },
      {
        question: 'What happens when the live-in caretaker takes days off?',
        answer:
          'We plan scheduled relief coverage in advance so that your family has a qualified substitute caretaker whenever the primary caregiver takes periodic leave.', // OWNER-CONFIRM
      },
      {
        question: 'Are background checks conducted on live-in caregivers?',
        answer:
          'Yes, our caretakers undergo address verification, reference checks, and identity validation before placement in any household.', // OWNER-CONFIRM
      },
      {
        question: 'What if our family and the caretaker are not compatible?',
        answer:
          'Personal compatibility is vital in a live-in arrangement. If either the patient or family feels the match is not working, we coordinate a replacement caregiver promptly.', // OWNER-CONFIRM
      },
    ],
    relatedSlugs: ['elderly-care', 'dementia-care'],
  },

  // ── 9. Patient Transport ───────────────────────────────────────────────────
  {
    slug: 'patient-transport',
    accent: 'green',
    name: 'Patient Transport',
    shortDescription: 'Assisted, safe non-emergency transport for hospital appointments and discharges.',
    metaTitle: 'Patient Transport Services in Bengaluru',
    metaDescription:
      'Safe, assisted non-emergency patient transport in Bengaluru. Wheelchair and stretcher transfers for doctor appointments, hospital discharge, and diagnostics.',
    keyword: 'patient transport Bengaluru',
    categoryTag: 'Assisted Transfers',
    intro:
      'Transporting a frail, post-operative, or wheelchair-bound patient to hospital appointments or back home after discharge can be an overwhelming challenge in standard city vehicles. Our non-emergency patient transport service provides comfortable, assisted transfers equipped with trained attendants, wheelchairs, or stretchers to guarantee safe and dignified transit across Bengaluru.',
    included: [
      'Safe, respectful bed-to-vehicle and vehicle-to-hospital transfers', // OWNER-CONFIRM
      'Vehicles equipped for wheelchair or stretcher-bound patients', // OWNER-CONFIRM
      'Accompaniment by a trained physical attendant throughout the journey', // OWNER-CONFIRM
      'Assistance with staircases and building access using specialized transit equipment', // OWNER-CONFIRM
      'Oxygen support cylinder available during transit upon advance request', // OWNER-CONFIRM
      'Waiting assistance at hospital outpatient clinics or diagnostic centres', // OWNER-CONFIRM
      'Safe return journey and repositioning into the patient’s home bed', // OWNER-CONFIRM
    ],
    whoItSuits:
      'This service is designed for elderly individuals with severe mobility limitations, patients with pelvic or spinal fractures, bedridden patients requiring routine dialysis or chemotherapy sessions, and post-operative patients being discharged who cannot sit upright in regular cars. It relieves family members from the heavy physical strain and risk of lifting patients into personal cars or auto-rickshaws.',
    howItWorks:
      'Book your transfer in advance by calling or messaging our dispatch desk with the pickup address, destination clinic/hospital, appointment time, and patient mobility status (whether walking with support, wheelchair-bound, or requiring a full flat stretcher). Our team arrives on schedule, assists the patient safely into the vehicle, attends to their comfort during transit, and assists them to the clinic reception or ward.',
    whatToPrepare:
      'Please have all medical appointment files, doctor receipts, identification cards, and personal warm clothing ready before vehicle arrival. Notify us in advance if your residence lacks elevator access so we can dispatch appropriate transfer personnel or chair equipment.',
    equipmentNote:
      'If continuous medical oxygen or IV maintenance is required during travel, notify us when booking so a nurse-accompanied medical transfer can be scheduled.',
    faqs: [
      {
        question: 'Is this an emergency 108 ambulance service?',
        answer:
          'No. Our service is designed for planned, non-emergency medical transfers and hospital appointments. In life-threatening emergencies, please immediately dial 108 or your nearest hospital casualty.', // OWNER-CONFIRM
      },
      {
        question: 'Can a family member travel along in the vehicle?',
        answer:
          'Yes, our patient transport vehicles accommodate family members to accompany the patient throughout the journey comfortably.', // OWNER-CONFIRM
      },
      {
        question: 'Can you arrange transport for regular dialysis or radiation therapy?',
        answer:
          'Yes, we provide scheduled recurring transfer packages for patients requiring multiple weekly trips to hospitals or dialysis centres across Bengaluru.', // OWNER-CONFIRM
      },
      {
        question: 'How much notice is required to book a transfer?',
        answer:
          'We recommend booking at least 12 to 24 hours in advance to secure preferred timing, especially during morning peak hospital admission hours.', // OWNER-CONFIRM
      },
    ],
    relatedSlugs: ['bedside-attendants', 'home-nursing'],
  },
];

/** Quick lookup by slug */
export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** All slugs — used in generateStaticParams */
export const servicesSlugs = services.map((s) => s.slug);
