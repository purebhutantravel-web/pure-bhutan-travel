"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function cleanText(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

export async function submitContactInquiry(formData: FormData) {
  const supabase = await createClient();

  const full_name = cleanText(formData.get("full_name"));
  const email = cleanText(formData.get("email"));
  const phone = cleanText(formData.get("phone"));
  const subject = cleanText(formData.get("subject"));
  const message = cleanText(formData.get("message"));

  if (!full_name || !email || !message) {
    redirect("/contact?status=missing");
  }

  const { error } = await supabase.from("contact_inquiries").insert({
    full_name,
    email,
    phone,
    subject,
    message,
    status: "new",
  });

  if (error) {
    console.error("Contact inquiry error:", error.message);
    redirect("/contact?status=error");
  }

  redirect("/contact?status=success");
}

export async function submitBookingRequest(formData: FormData) {
  const supabase = await createClient();

  const package_id = cleanText(formData.get("package_id")) || null;
  const package_title = cleanText(formData.get("package_title"));
  const redirect_slug = cleanText(formData.get("redirect_slug"));

  const full_name = cleanText(formData.get("full_name"));
  const email = cleanText(formData.get("email"));
  const phone = cleanText(formData.get("phone"));
  const country = cleanText(formData.get("country"));
  const travel_date = cleanText(formData.get("travel_date")) || null;
  const travelersText = cleanText(formData.get("number_of_travelers"));
  const message = cleanText(formData.get("message"));

  const number_of_travelers = travelersText ? Number(travelersText) : null;

  const redirectPath = redirect_slug
    ? `/packages/${redirect_slug}`
    : "/packages";

  if (!full_name || !email) {
    redirect(`${redirectPath}?booking=missing`);
  }

  if (
    number_of_travelers !== null &&
    (!Number.isFinite(number_of_travelers) || number_of_travelers <= 0)
  ) {
    redirect(`${redirectPath}?booking=invalid-travelers`);
  }

  const { error } = await supabase.from("booking_requests").insert({
    package_id,
    package_title,
    full_name,
    email,
    phone,
    country,
    travel_date,
    number_of_travelers,
    message,
    status: "pending",
  });

  if (error) {
    console.error("Booking request error:", error.message);
    redirect(`${redirectPath}?booking=error`);
  }

  redirect(`${redirectPath}?booking=success`);
}