import { connectToDatabase } from '@/lib/mongodb';
import { Update } from '@/models/Update';

/**
 * scripts/seed.ts
 *
 * Seed script for Phase 7 that creates 3 clearly fake posts titled "[SAMPLE] ..."
 * for local testing only (antigravity-prompt (1).md Phase 7).
 */

const samplePosts = [
  {
    title: '[SAMPLE] How to Prepare Your Home for Post-Hospital Recovery',
    slug: 'sample-preparing-home-for-post-hospital-recovery',
    previousSlugs: [],
    excerpt:
      'Essential tips on room setup, hygiene precautions, and caregiver coordination before your family member arrives home from the hospital in Bengaluru.',
    content: `## Planning Ahead for Hospital Discharge

Bringing a loved one home from the hospital requires thoughtful preparation. Taking steps beforehand ensures a smooth and stress-free transition.

### 1. Preparing the Patient Room
- Choose a ground-floor room if stairs are difficult to navigate.
- Ensure clear walking pathways to prevent trips and falls.
- Position the bed with accessible space on both sides for nurses or attendants.

### 2. Clinical Supplies Checklist
- Maintain a dedicated tray with doctor-prescribed medications.
- Keep sterile wound dressings, gloves, and hand sanitizer readily accessible.
- Set up medical equipment (such as Fowler beds or oxygen concentrators) prior to patient arrival.

### 3. Clear Communication
Establish a daily vitals log sheet so attending caregivers and visiting nurses can note blood pressure, pulse, temperature, and dietary intake.
`,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      publicId: 'sample-post-1',
      alt: '[SAMPLE] Preparing home for patient care',
    },
    seo: {
      title: '[SAMPLE] How to Prepare Your Home for Recovery | PH Home Nursing',
      description: 'Practical checklist for post-hospital recovery at home in Bengaluru.',
    },
    status: 'published' as const,
    publishedAt: new Date('2026-10-15T10:00:00.000Z'),
  },
  {
    title: '[SAMPLE] Understanding the Difference Between a Nurse and an Attendant',
    slug: 'sample-difference-between-nurse-and-attendant',
    previousSlugs: [],
    excerpt:
      'A practical guide to help families choose the right level of care: clinical nursing versus daily physical assistance.',
    content: `## Choosing the Right Caregiver for Your Family

Families frequently ask whether their patient needs a registered nurse or a trained bedside attendant. Here is how to decide based on clinical requirements.

### Clinical Nurses (GNM / B.Sc)
- Administer IV infusions, injections, and complex medications.
- Perform sterile wound dressing, bedsore management, and surgical site care.
- Monitor tracheostomies, catheter care, and Ryle's tube feeding.

### Bedside Attendants & Caretakers
- Assist with sponge baths, oral hygiene, and diaper changes.
- Support safe transfers between bed and wheelchair.
- Aid with timely feeding and companionship.

Choosing the right caregiver ensures appropriate clinical safety and cost-effective care.
`,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
      publicId: 'sample-post-2',
      alt: '[SAMPLE] Nurse and attendant guidance',
    },
    seo: {
      title: '[SAMPLE] Difference Between Nurse and Attendant | PH Home Nursing',
      description: 'Guide for families choosing between clinical nursing and bedside care.',
    },
    status: 'published' as const,
    publishedAt: new Date('2026-10-20T08:30:00.000Z'),
  },
  {
    title: '[SAMPLE] Supporting an Aging Parent with Dementia at Home',
    slug: 'sample-supporting-aging-parent-with-dementia',
    previousSlugs: [],
    excerpt:
      'Why keeping routines consistent and environments familiar reduces anxiety and promotes safety for individuals living with memory loss.',
    content: `## Compassionate Care for Dementia and Alzheimer's

Caring for an aging parent experiencing memory loss or cognitive decline requires patience, empathy, and structured daily routines.

### Key Strategies for Families
1. **Maintain Predictable Routines:** Keep meal times, wake-up hours, and gentle walks on a consistent schedule.
2. **Minimize Sensory Overload:** Avoid loud televisions or chaotic visitors in the patient's immediate space.
3. **Gentle Reassurance:** Validate their emotions rather than arguing over forgotten facts or misplaced items.
4. **Safety Precautions:** Install grab bars in bathrooms, ensure anti-skid mats, and keep night lights on.

Our specialized dementia caretakers provide patient, attentive companionship designed to keep seniors calm and safe.
`,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      publicId: 'sample-post-3',
      alt: '[SAMPLE] Compassionate dementia care',
    },
    seo: {
      title: '[SAMPLE] Supporting Parents with Dementia | PH Home Nursing',
      description: 'Helpful tips for caring for elderly parents with memory loss at home.',
    },
    status: 'published' as const,
    publishedAt: new Date('2026-10-25T14:00:00.000Z'),
  },
];

export async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is required to run the seed script.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await connectToDatabase();

  console.log('Seeding sample updates...');
  for (const post of samplePosts) {
    await Update.findOneAndUpdate(
      { slug: post.slug },
      { $set: post },
      { upsert: true, new: true }
    );
    console.log(`✓ Seeded post: ${post.title}`);
  }

  console.log('Seeding completed successfully!');
}

if (process.argv[1]?.includes('seed')) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

