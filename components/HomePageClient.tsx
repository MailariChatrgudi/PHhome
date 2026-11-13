'use client';

import { useState, useEffect, useCallback } from 'react';
import EnquiryModal from '@/components/EnquiryModal';
import MobileActionBar from '@/components/MobileActionBar';

const SESSION_KEY = 'enquiry_modal_shown';
const DELAY_MS = 7000; // 7 seconds after mount

/**
 * HomePageClient — thin client shell for the home page.
 * Owns the EnquiryModal open/close state and the auto-open timer.
 * Server-rendered content is passed as children; only the modal itself is client-interactive.
 */
export default function HomePageClient({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  // Auto-open once per session after DELAY_MS
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // sessionStorage blocked (private browsing edge case) — skip auto-open
      return;
    }

    const timer = setTimeout(() => {
      setModalOpen(true);
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* noop */ }
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Expose openModal via a named global for the hero button */}
      <EnquiryModalTrigger openModal={openModal} />
      {children}
      <EnquiryModal isOpen={modalOpen} onClose={closeModal} />
      {/* Sticky bottom bar — mobile only, fades in after hero scroll */}
      <MobileActionBar />
    </>
  );
}

/**
 * EnquiryModalTrigger — registers a global handler so the HeroCarousel's
 * "Send a request" button can open the modal without prop-drilling through
 * server component boundaries.
 */
function EnquiryModalTrigger({ openModal }: { openModal: () => void }) {
  useEffect(() => {
    (window as typeof window & { __openEnquiryModal?: () => void }).__openEnquiryModal = openModal;
    return () => {
      delete (window as typeof window & { __openEnquiryModal?: () => void }).__openEnquiryModal;
    };
  }, [openModal]);
  return null;
}
