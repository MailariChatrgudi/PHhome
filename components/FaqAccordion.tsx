import type { FaqItem } from '@/content/faq';
import type { ServiceFaq } from '@/content/services';

interface FaqAccordionProps {
  items: (FaqItem | ServiceFaq)[];
  grouped?: boolean;
}

/**
 * FaqAccordion — spec: design.md §5
 * Native <details> and <summary> accordions with a plus/minus indicator in --plum.
 * Works 100% without client-side JavaScript.
 */
export default function FaqAccordion({ items, grouped = false }: FaqAccordionProps) {
  if (grouped) {
    // Group items by category (if FaqItem)
    const groups: Record<string, (FaqItem | ServiceFaq)[]> = {};
    for (const item of items) {
      const cat = 'category' in item && item.category ? item.category : 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    }

    return (
      <div className="space-y-12">
        {Object.entries(groups).map(([category, catItems]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[var(--ink)] pb-2 border-b border-[var(--line)]">
              {category}
            </h2>
            <div className="space-y-3">
              {catItems.map((item, idx) => (
                <FaqCard key={item.question || idx} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <FaqCard key={item.question || idx} item={item} />
      ))}
    </div>
  );
}

function FaqCard({ item }: { item: FaqItem | ServiceFaq }) {
  return (
    <details className="group bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] overflow-hidden transition-all duration-200 open:border-[var(--plum-ring)]/40 open:shadow-sm">
      <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer select-none list-none font-medium text-[var(--ink)] text-base sm:text-lg hover:text-[var(--plum)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:ring-inset">
        <span className="pr-4 leading-snug">{item.question}</span>
        <span
          className="text-2xl font-light text-[var(--plum)] transition-transform duration-200 group-open:rotate-45 shrink-0"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div className="px-5 sm:px-6 pb-6 pt-1 text-[var(--ink-muted)] text-[15px] sm:text-base leading-relaxed border-t border-[var(--line)]/40">
        <p>{item.answer}</p>
      </div>
    </details>
  );
}
