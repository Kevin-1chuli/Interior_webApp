"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowRight } from "lucide-react";
import { useAppUI } from "@/context/AppUIContext";
import {
  BODY, CHARCOAL, CREAM_D, DISPLAY, EASE_OUT,
  GOLD, GOLD_LIGHT, MID, SANS, WHITE,
} from "@/lib/constants";
import { ContactSection, GoldBtn, OutlineBtn, SectionHdr } from "@/components/NGBComponents";

const SERVICE_TYPES = [
  { id: "renovation", label: "Renovation", desc: "Transform your existing space" },
  { id: "furniture-upgrade", label: "Furniture Upgrade", desc: "Refresh with new pieces" },
  { id: "full-design", label: "Full Interior Design", desc: "Complete transformation" },
];

const DESIGN_STYLES = [
  { id: "modern", label: "Modern", desc: "Clean lines, minimal clutter" },
  { id: "luxury", label: "Luxury", desc: "Premium finishes, elegant" },
  { id: "minimalist", label: "Minimalist", desc: "Simple, functional beauty" },
  { id: "african-contemporary", label: "African Contemporary", desc: "Cultural + modern blend" },
  { id: "custom", label: "Custom", desc: "Your unique vision" },
];

const BUDGET_RANGES = [
  { id: "low", label: "Low Budget", desc: "UGX 1M - 3M" },
  { id: "mid", label: "Mid Range", desc: "UGX 3M - 8M" },
  { id: "premium", label: "Premium", desc: "UGX 8M+" },
];

export default function InteriorDesignContent() {
  const { navigate } = useAppUI();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    photo: null as File | null,
    service: "",
    style: "",
    budget: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  const handleSubmit = () => {
    // TODO: Send to backend/WhatsApp webhook
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const canProceed = () => {
    if (step === 1) return formData.photo !== null;
    if (step === 2) return formData.service !== "";
    if (step === 3) return formData.style !== "";
    if (step === 4) return true; // Budget is optional
    if (step === 5) return formData.phone !== "";
    return false;
  };

  if (submitted) {
    return (
      <section style={{ backgroundColor: WHITE, paddingTop: 120, paddingBottom: 120, minHeight: "80vh" }}>
        <div className="max-w-2xl mx-auto text-center" style={{ paddingInline: "clamp(1.5rem,5vw,4rem)" }}>
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: "rgba(184,147,74,0.15)" }}>
            <CheckCircle size={40} color={GOLD} />
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 600, color: CHARCOAL, marginBottom: 16 }}>
            Request Received!
          </h1>
          <p style={{ fontFamily: BODY, fontSize: "1.1rem", fontWeight: 300, lineHeight: 1.8, color: MID, marginBottom: 40 }}>
            Our design team will contact you within <strong style={{ color: GOLD }}>10–30 minutes</strong> via WhatsApp or phone to discuss your project.
          </p>
          <div className="flex gap-4 justify-center">
            <GoldBtn onClick={() => navigate("projects")}>View Our Projects</GoldBtn>
            <OutlineBtn onClick={() => { setSubmitted(false); setStep(1); setFormData({ photo: null, service: "", style: "", budget: "", phone: "" }); }} dark>
              Submit Another Request
            </OutlineBtn>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section style={{ backgroundColor: CHARCOAL, paddingTop: 100, paddingBottom: 60 }}>
        <div className="max-w-4xl mx-auto text-center" style={{ paddingInline: "clamp(1.5rem,5vw,4rem)" }}>
          <p style={{ fontFamily: SANS, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD_LIGHT, marginBottom: 12, fontWeight: 600 }}>
            INTERIOR DESIGN SERVICES
          </p>
          <h1 style={{ fontFamily: DISPLAY, fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 600, color: WHITE, lineHeight: 1.15, marginBottom: 20 }}>
            Transform Your Space with NGB
          </h1>
          <p style={{ fontFamily: BODY, fontSize: "1.1rem", fontWeight: 300, lineHeight: 1.9, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
            From concept to completion — professional interior design for homes and businesses across Kampala.
          </p>
        </div>
      </section>

      {/* Multi-Step Form */}
      <section style={{ backgroundColor: CREAM_D, paddingTop: 60, paddingBottom: 80 }}>
        <div className="max-w-3xl mx-auto" style={{ paddingInline: "clamp(1.5rem,5vw,4rem)" }}>
          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: s <= step ? GOLD : WHITE,
                      color: s <= step ? WHITE : MID,
                      fontFamily: SANS,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      border: `2px solid ${s <= step ? GOLD : "rgba(0,0,0,0.1)"}`,
                    }}
                  >
                    {s}
                  </div>
                  {s < 5 && (
                    <div
                      className="flex-1 h-1 mx-2"
                      style={{ backgroundColor: s < step ? GOLD : "rgba(0,0,0,0.1)" }}
                    />
                  )}
                </div>
              ))}
            </div>
            <p style={{ fontFamily: SANS, fontSize: "0.7rem", color: MID, textAlign: "center" }}>
              Step {step} of 5
            </p>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: DISPLAY, fontSize: "1.8rem", fontWeight: 600, color: CHARCOAL, marginBottom: 12 }}>
                  Upload Your Current Space
                </h2>
                <p style={{ fontFamily: BODY, fontSize: "0.95rem", color: MID, lineHeight: 1.7, marginBottom: 30 }}>
                  Share a photo of your room, kitchen, or office so we can understand your starting point.
                </p>
                <label
                  htmlFor="photo-upload"
                  className="block cursor-pointer"
                  style={{
                    border: `2px dashed ${formData.photo ? GOLD : "rgba(0,0,0,0.2)"}`,
                    borderRadius: 12,
                    padding: 40,
                    textAlign: "center",
                    backgroundColor: formData.photo ? "rgba(184,147,74,0.05)" : WHITE,
                    transition: `all 0.3s ${EASE_OUT}`,
                  }}
                >
                  <Upload size={40} color={formData.photo ? GOLD : MID} style={{ margin: "0 auto 16px" }} />
                  <p style={{ fontFamily: SANS, fontSize: "0.9rem", fontWeight: 600, color: CHARCOAL, marginBottom: 6 }}>
                    {formData.photo ? formData.photo.name : "Click to upload a photo"}
                  </p>
                  <p style={{ fontFamily: BODY, fontSize: "0.8rem", color: MID }}>
                    JPG, PNG or HEIC (max 10MB)
                  </p>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: DISPLAY, fontSize: "1.8rem", fontWeight: 600, color: CHARCOAL, marginBottom: 12 }}>
                  What Service Do You Need?
                </h2>
                <p style={{ fontFamily: BODY, fontSize: "0.95rem", color: MID, lineHeight: 1.7, marginBottom: 30 }}>
                  Choose the type of transformation you're looking for.
                </p>
                <div className="grid gap-4">
                  {SERVICE_TYPES.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setFormData({ ...formData, service: service.id })}
                      className="text-left p-5 rounded-xl transition-all"
                      style={{
                        border: `2px solid ${formData.service === service.id ? GOLD : "rgba(0,0,0,0.1)"}`,
                        backgroundColor: formData.service === service.id ? "rgba(184,147,74,0.05)" : WHITE,
                        transform: formData.service === service.id ? "translateY(-2px)" : "none",
                        boxShadow: formData.service === service.id ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      <h3 style={{ fontFamily: DISPLAY, fontSize: "1.1rem", fontWeight: 600, color: CHARCOAL, marginBottom: 4 }}>
                        {service.label}
                      </h3>
                      <p style={{ fontFamily: BODY, fontSize: "0.85rem", color: MID }}>{service.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: DISPLAY, fontSize: "1.8rem", fontWeight: 600, color: CHARCOAL, marginBottom: 12 }}>
                  Choose Your Design Style
                </h2>
                <p style={{ fontFamily: BODY, fontSize: "0.95rem", color: MID, lineHeight: 1.7, marginBottom: 30 }}>
                  Select a style that matches your vision.
                </p>
                <div className="grid gap-4">
                  {DESIGN_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setFormData({ ...formData, style: style.id })}
                      className="text-left p-5 rounded-xl transition-all"
                      style={{
                        border: `2px solid ${formData.style === style.id ? GOLD : "rgba(0,0,0,0.1)"}`,
                        backgroundColor: formData.style === style.id ? "rgba(184,147,74,0.05)" : WHITE,
                        transform: formData.style === style.id ? "translateY(-2px)" : "none",
                        boxShadow: formData.style === style.id ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      <h3 style={{ fontFamily: DISPLAY, fontSize: "1.1rem", fontWeight: 600, color: CHARCOAL, marginBottom: 4 }}>
                        {style.label}
                      </h3>
                      <p style={{ fontFamily: BODY, fontSize: "0.85rem", color: MID }}>{style.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 style={{ fontFamily: DISPLAY, fontSize: "1.8rem", fontWeight: 600, color: CHARCOAL, marginBottom: 12 }}>
                  What's Your Budget Range?
                </h2>
                <p style={{ fontFamily: BODY, fontSize: "0.95rem", color: MID, lineHeight: 1.7, marginBottom: 30 }}>
                  Optional — helps us tailor recommendations to your needs.
                </p>
                <div className="grid gap-4">
                  {BUDGET_RANGES.map((budget) => (
                    <button
                      key={budget.id}
                      onClick={() => setFormData({ ...formData, budget: budget.id })}
                      className="text-left p-5 rounded-xl transition-all"
                      style={{
                        border: `2px solid ${formData.budget === budget.id ? GOLD : "rgba(0,0,0,0.1)"}`,
                        backgroundColor: formData.budget === budget.id ? "rgba(184,147,74,0.05)" : WHITE,
                        transform: formData.budget === budget.id ? "translateY(-2px)" : "none",
                        boxShadow: formData.budget === budget.id ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      <h3 style={{ fontFamily: DISPLAY, fontSize: "1.1rem", fontWeight: 600, color: CHARCOAL, marginBottom: 4 }}>
                        {budget.label}
                      </h3>
                      <p style={{ fontFamily: BODY, fontSize: "0.85rem", color: MID }}>{budget.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 style={{ fontFamily: DISPLAY, fontSize: "1.8rem", fontWeight: 600, color: CHARCOAL, marginBottom: 12 }}>
                  How Can We Reach You?
                </h2>
                <p style={{ fontFamily: BODY, fontSize: "0.95rem", color: MID, lineHeight: 1.7, marginBottom: 30 }}>
                  We'll contact you via WhatsApp or phone within 10–30 minutes.
                </p>
                <input
                  type="tel"
                  placeholder="07XX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-4 rounded-xl"
                  style={{
                    fontFamily: BODY,
                    fontSize: "1rem",
                    border: `2px solid rgba(0,0,0,0.1)`,
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = GOLD)}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.1)")}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <OutlineBtn onClick={() => setStep(step - 1)} dark>
                  Back
                </OutlineBtn>
              )}
              {step < 5 ? (
                <GoldBtn onClick={() => canProceed() && setStep(step + 1)} fullW={step === 1}>
                  {step === 4 ? "Skip & Continue" : "Continue"} <ArrowRight size={16} style={{ marginLeft: 8, display: "inline" }} />
                </GoldBtn>
              ) : (
                <GoldBtn onClick={handleSubmit} fullW>
                  Submit Request
                </GoldBtn>
              )}
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
