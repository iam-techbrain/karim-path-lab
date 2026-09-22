"use client";

import React, { useState } from "react";
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

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string | undefined>(undefined);

  const handleOpenBooking = (testName?: string) => {
    setSelectedTest(testName);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
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
