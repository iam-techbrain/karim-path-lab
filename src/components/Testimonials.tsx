"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, MessageSquarePlus, CheckCircle2, Send, X, ThumbsUp } from "lucide-react";
import { INITIAL_REVIEWS, LAB_CONTACT } from "@/data/testsData";
import { ReviewItem } from "@/types/booking";

export default function Testimonials() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [comment, setComment] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch reviews from Neon DB on mount
  React.useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => {
        console.warn("Could not load reviews from Neon DB:", err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setErrorMsg("Please enter your name and feedback comment.");
      return;
    }

    const locString = location.trim() ? `${location.trim()}, Patna` : "Patna, Bihar";

    const localRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      location: locString,
      rating: rating,
      comment: comment.trim(),
      date: "Just now",
      verified: true,
    };

    setReviews((prev) => [localRev, ...prev]);
    setSubmittedSuccess(true);
    setErrorMsg("");

    // Persist to Neon DB
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          location: locString,
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) => [data.review, ...prev.filter((r) => r.id !== localRev.id)]);
      }
    } catch (err) {
      console.warn("Could not save review to Neon DB:", err);
    }

    setTimeout(() => {
      setName("");
      setLocation("");
      setComment("");
      setRating(5);
      setSubmittedSuccess(false);
      setIsFormOpen(false);
    }, 1800);
  };

  const handleWhatsAppFeedback = () => {
    if (!comment.trim()) {
      setErrorMsg("Please write your feedback first.");
      return;
    }
    const starsText = "★".repeat(rating);
    const msg = `*Patient Feedback for Karim Path Lab*
⭐ Rating: ${starsText} (${rating}/5)
👤 Name: ${name || "Patna Patient"}
📍 Area: ${location || "Patna"}
💬 Feedback: ${comment}`;

    const waUrl = `https://wa.me/${LAB_CONTACT.phoneRaw}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <p className="font-mono text-xs text-emerald-700 uppercase font-bold tracking-wider">
            PATNA PATIENTS
          </p>
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
            Trusted by 2,500+ Families
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
            Real feedback from patients across Patna who used our doorstep pathology service.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn-primary text-white text-xs font-bold rounded-xl px-5 py-3 flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-md shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>{isFormOpen ? "Close Feedback Form" : "Write a Review / Feedback"}</span>
        </button>
      </div>

      {/* Interactive Review / Rating Form (Accordion Modal) */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-10"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <span>Share Your Experience</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded font-bold">
                      Patna Patient Feedback
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Help other families in Patna know about our punctuality, gentle sample collection &amp; report speed.
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-display font-bold text-base text-emerald-950">
                    Thank You for Your Valuable Review!
                  </p>
                  <p className="text-xs text-emerald-800 font-medium">
                    Your feedback has been posted and will help families make confident healthcare decisions.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Your Rating *
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= (hoverRating || rating);
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                isFilled
                                  ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                                  : "text-slate-300"
                              }`}
                            />
                          </button>
                        );
                      })}
                      <span className="text-xs font-bold text-slate-700 ml-2">
                        {rating === 5 && "Excellent (5/5)"}
                        {rating === 4 && "Very Good (4/5)"}
                        {rating === 3 && "Good (3/5)"}
                        {rating === 2 && "Fair (2/5)"}
                        {rating === 1 && "Poor (1/5)"}
                      </span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="revName"
                        className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                      >
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="revName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Amit Kumar"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium placeholder-slate-400"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="revLocation"
                        className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                      >
                        Patna Locality / Area
                      </label>
                      <input
                        type="text"
                        id="revLocation"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Rajendra Nagar, Kankarbagh, Boring Road"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="revComment"
                      className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
                    >
                      Your Feedback / Review *
                    </label>
                    <textarea
                      id="revComment"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about the technician's punctuality, painless blood collection, or fast WhatsApp report delivery..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium resize-none placeholder-slate-400"
                      required
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-rose-500 font-bold">{errorMsg}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="btn-primary text-white font-display font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Post Review</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppFeedback}
                      className="btn-secondary text-slate-700 font-display font-semibold text-xs px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Also Send Directly on WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="glass-card rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic font-medium">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">{rev.name}</span>
              <span className="text-slate-400 font-semibold">{rev.location}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
