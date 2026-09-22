"use client";

import React, { useState, useEffect } from "react";
import TopClinicalBar from "@/components/TopClinicalBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PromoBanner from "@/components/PromoBanner";
import LabTestsGrid from "@/components/LabTestsGrid";
import PartnerNetworkSection from "@/components/PartnerNetworkSection";
import HowItWorks from "@/components/HowItWorks";
import WhatsAppFeatures from "@/components/WhatsAppFeatures";
import PhlebotomistCard from "@/components/PhlebotomistCard";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import BookingModal from "@/components/BookingModal/BookingModal";
import PageLoader from "@/components/PageLoader";

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string | undefined>(undefined);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenBooking = (testName?: string) => {
    setSelectedTest(testName);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Centered Beautiful Page Loader with Logo */}
      {isPageLoading && (
        <div className="fixed inset-0 z-50 transition-opacity duration-300">
          <PageLoader
            title="KARIM PATH LAB"
            subtitle="Doorstep Pathology & Diagnostics · Patna"
            badge="PATNA'S TRUSTED LAB"
            theme="emerald"
          />
        </div>
      )}

      {/* Top Clinical Bar */}
      <TopClinicalBar />

      {/* Main Sticky Header / Navbar */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection onOpenBooking={() => handleOpenBooking()} />
        <PromoBanner onOpenBooking={() => handleOpenBooking()} />
        <LabTestsGrid onOpenBooking={handleOpenBooking} />
        <PartnerNetworkSection onOpenBooking={handleOpenBooking} />
        <HowItWorks />
        <WhatsAppFeatures />
        <PhlebotomistCard />
        <Testimonials />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenBooking={handleOpenBooking} />

      {/* Floating Sticky Mobile Book CTA */}
      <MobileStickyBar onOpenBooking={() => handleOpenBooking()} />

      {/* Dynamic Two-Step Booking Modal & Canvas Card Generator */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        defaultTestName={selectedTest}
      />
    </div>
  );
}
