"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

function cleanText(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function cleanNumber(value: FormDataEntryValue | null) {
  const text = cleanText(value);

  if (!text) {
    return null;
  }

  const number = Number(text);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

async function requireAdmin() {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  return currentAdmin;
}

export async function loginAdmin(formData: FormData) {
  const email = cleanText(formData.get("email"));
  const password = cleanText(formData.get("password"));

  if (!email || !password) {
    redirect("/admin/login?status=missing");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/admin/login?status=error");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login?status=error");
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?status=unauthorized");
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/admin/login?status=logged-out");
}

export async function updateContactInquiryStatus(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const status = cleanText(formData.get("status"));

  const allowedStatuses = ["new", "reviewed", "archived"];

  if (!id || !allowedStatuses.includes(status)) {
    redirect("/admin/inquiries?status=invalid");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("contact_inquiries")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Update contact inquiry status error:", error.message);
    redirect("/admin/inquiries?status=error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");

  redirect("/admin/inquiries?status=updated");
}

export async function updateBookingRequestStatus(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const status = cleanText(formData.get("status"));

  const allowedStatuses = ["pending", "reviewed", "confirmed", "cancelled"];

  if (!id || !allowedStatuses.includes(status)) {
    redirect("/admin/bookings?status=invalid");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("booking_requests")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Update booking request status error:", error.message);
    redirect("/admin/bookings?status=error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");

  redirect("/admin/bookings?status=updated");
}

export async function createTourPackage(formData: FormData) {
  await requireAdmin();

  const slug = cleanText(formData.get("slug"));
  const title = cleanText(formData.get("title"));
  const subtitle = cleanText(formData.get("subtitle"));
  const short_description = cleanText(formData.get("short_description"));
  const overview = cleanText(formData.get("overview"));
  const duration_days = cleanNumber(formData.get("duration_days"));
  const duration_nights = cleanNumber(formData.get("duration_nights"));
  const difficulty = cleanText(formData.get("difficulty"));
  const price_from_usd = cleanNumber(formData.get("price_from_usd"));
  const image_url = cleanText(formData.get("image_url"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;

  const is_featured = formData.get("is_featured") === "on";
  const is_active = formData.get("is_active") === "on";

  if (!slug || !title || !short_description) {
    redirect("/admin/packages/new?status=missing");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("tour_packages").insert({
    slug,
    title,
    subtitle,
    short_description,
    overview,
    duration_days,
    duration_nights,
    difficulty,
    price_from_usd,
    image_url: image_url || null,
    is_featured,
    is_active,
    sort_order,
  });

  if (error) {
    console.error("Create package error:", error.message);

    if (error.code === "23505") {
      redirect("/admin/packages/new?status=duplicate");
    }

    redirect("/admin/packages/new?status=error");
  }

  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath("/admin/packages");

  redirect("/admin/packages?status=created");
}

export async function updateTourPackage(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const slug = cleanText(formData.get("slug"));
  const title = cleanText(formData.get("title"));
  const subtitle = cleanText(formData.get("subtitle"));
  const short_description = cleanText(formData.get("short_description"));
  const overview = cleanText(formData.get("overview"));
  const duration_days = cleanNumber(formData.get("duration_days"));
  const duration_nights = cleanNumber(formData.get("duration_nights"));
  const difficulty = cleanText(formData.get("difficulty"));
  const price_from_usd = cleanNumber(formData.get("price_from_usd"));
  const image_url = cleanText(formData.get("image_url"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;

  const is_featured = formData.get("is_featured") === "on";
  const is_active = formData.get("is_active") === "on";

  if (!id || !slug || !title || !short_description) {
    redirect(`/admin/packages/${id}/edit?status=missing`);
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("tour_packages")
    .update({
      slug,
      title,
      subtitle,
      short_description,
      overview,
      duration_days,
      duration_nights,
      difficulty,
      price_from_usd,
      image_url: image_url || null,
      is_featured,
      is_active,
      sort_order,
    })
    .eq("id", id);

  if (error) {
    console.error("Update package error:", error.message);

    if (error.code === "23505") {
      redirect(`/admin/packages/${id}/edit?status=duplicate`);
    }

    redirect(`/admin/packages/${id}/edit?status=error`);
  }

  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath(`/packages/${slug}`);
  revalidatePath("/admin/packages");

  redirect("/admin/packages?status=updated");
}

export async function setTourPackageActive(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const is_active = cleanText(formData.get("is_active")) === "true";

  if (!id) {
    redirect("/admin/packages?status=invalid");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("tour_packages")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    console.error("Set package active error:", error.message);
    redirect("/admin/packages?status=error");
  }

  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath("/admin/packages");

  redirect("/admin/packages?status=updated");
}

export async function setTourPackageFeatured(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const is_featured = cleanText(formData.get("is_featured")) === "true";

  if (!id) {
    redirect("/admin/packages?status=invalid");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("tour_packages")
    .update({ is_featured })
    .eq("id", id);

  if (error) {
    console.error("Set package featured error:", error.message);
    redirect("/admin/packages?status=error");
  }

  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath("/admin/packages");

  redirect("/admin/packages?status=updated");
}

export async function createPackageItinerary(formData: FormData) {
  await requireAdmin();

  const package_id = cleanText(formData.get("package_id"));
  const day_number = cleanNumber(formData.get("day_number"));
  const title = cleanText(formData.get("title"));
  const description = cleanText(formData.get("description"));
  const overnight = cleanText(formData.get("overnight"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;

  if (!package_id || !day_number || !title || !description) {
    redirect(`/admin/packages/${package_id}/itinerary?status=missing`);
  }

  const supabase = await createClient();

  const { data: packageData } = await supabase
    .from("tour_packages")
    .select("slug")
    .eq("id", package_id)
    .maybeSingle();

  const { error } = await supabase.from("package_itineraries").insert({
    package_id,
    day_number,
    title,
    description,
    overnight: overnight || null,
    sort_order,
  });

  if (error) {
    console.error("Create itinerary error:", error.message);
    redirect(`/admin/packages/${package_id}/itinerary?status=error`);
  }

  revalidatePath("/admin/packages");
  revalidatePath(`/admin/packages/${package_id}/itinerary`);

  if (packageData?.slug) {
    revalidatePath(`/packages/${packageData.slug}`);
  }

  redirect(`/admin/packages/${package_id}/itinerary?status=created`);
}

export async function updatePackageItinerary(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const package_id = cleanText(formData.get("package_id"));
  const day_number = cleanNumber(formData.get("day_number"));
  const title = cleanText(formData.get("title"));
  const description = cleanText(formData.get("description"));
  const overnight = cleanText(formData.get("overnight"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;

  if (!id || !package_id || !day_number || !title || !description) {
    redirect(`/admin/packages/${package_id}/itinerary?status=missing`);
  }

  const supabase = await createClient();

  const { data: packageData } = await supabase
    .from("tour_packages")
    .select("slug")
    .eq("id", package_id)
    .maybeSingle();

  const { error } = await supabase
    .from("package_itineraries")
    .update({
      day_number,
      title,
      description,
      overnight: overnight || null,
      sort_order,
    })
    .eq("id", id)
    .eq("package_id", package_id);

  if (error) {
    console.error("Update itinerary error:", error.message);
    redirect(`/admin/packages/${package_id}/itinerary?status=error`);
  }

  revalidatePath("/admin/packages");
  revalidatePath(`/admin/packages/${package_id}/itinerary`);

  if (packageData?.slug) {
    revalidatePath(`/packages/${packageData.slug}`);
  }

  redirect(`/admin/packages/${package_id}/itinerary?status=updated`);
}

export async function deletePackageItinerary(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const package_id = cleanText(formData.get("package_id"));

  if (!id || !package_id) {
    redirect(`/admin/packages/${package_id}/itinerary?status=invalid`);
  }

  const supabase = await createClient();

  const { data: packageData } = await supabase
    .from("tour_packages")
    .select("slug")
    .eq("id", package_id)
    .maybeSingle();

  const { error } = await supabase
    .from("package_itineraries")
    .delete()
    .eq("id", id)
    .eq("package_id", package_id);

  if (error) {
    console.error("Delete itinerary error:", error.message);
    redirect(`/admin/packages/${package_id}/itinerary?status=error`);
  }

  revalidatePath("/admin/packages");
  revalidatePath(`/admin/packages/${package_id}/itinerary`);

  if (packageData?.slug) {
    revalidatePath(`/packages/${packageData.slug}`);
  }

  redirect(`/admin/packages/${package_id}/itinerary?status=deleted`);
}

export async function createPartnerHotel(formData: FormData) {
  await requireAdmin();

  const name = cleanText(formData.get("name"));
  const location = cleanText(formData.get("location"));
  const description = cleanText(formData.get("description"));
  const image_url = cleanText(formData.get("image_url"));
  const website_url = cleanText(formData.get("website_url"));
  const phone = cleanText(formData.get("phone"));
  const email = cleanText(formData.get("email"));
  const rating = cleanNumber(formData.get("rating"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;
  const is_active = formData.get("is_active") === "on";

  if (!name || !description) {
    redirect("/admin/hotels/new?status=missing");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("partner_hotels").insert({
    name,
    location,
    description,
    image_url: image_url || null,
    website_url: website_url || null,
    phone: phone || null,
    email: email || null,
    rating,
    sort_order,
    is_active,
  });

  if (error) {
    console.error("Create hotel error:", error.message);
    redirect("/admin/hotels/new?status=error");
  }

  revalidatePath("/hotels");
  revalidatePath("/admin/hotels");

  redirect("/admin/hotels?status=created");
}

export async function updatePartnerHotel(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const name = cleanText(formData.get("name"));
  const location = cleanText(formData.get("location"));
  const description = cleanText(formData.get("description"));
  const image_url = cleanText(formData.get("image_url"));
  const website_url = cleanText(formData.get("website_url"));
  const phone = cleanText(formData.get("phone"));
  const email = cleanText(formData.get("email"));
  const rating = cleanNumber(formData.get("rating"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;
  const is_active = formData.get("is_active") === "on";

  if (!id || !name || !description) {
    redirect(`/admin/hotels/${id}/edit?status=missing`);
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("partner_hotels")
    .update({
      name,
      location,
      description,
      image_url: image_url || null,
      website_url: website_url || null,
      phone: phone || null,
      email: email || null,
      rating,
      sort_order,
      is_active,
    })
    .eq("id", id);

  if (error) {
    console.error("Update hotel error:", error.message);
    redirect(`/admin/hotels/${id}/edit?status=error`);
  }

  revalidatePath("/hotels");
  revalidatePath("/admin/hotels");

  redirect("/admin/hotels?status=updated");
}

export async function setPartnerHotelActive(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const is_active = cleanText(formData.get("is_active")) === "true";

  if (!id) {
    redirect("/admin/hotels?status=invalid");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("partner_hotels")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    console.error("Set hotel active error:", error.message);
    redirect("/admin/hotels?status=error");
  }

  revalidatePath("/hotels");
  revalidatePath("/admin/hotels");

  redirect("/admin/hotels?status=updated");
}

export async function createRestaurant(formData: FormData) {
  await requireAdmin();

  const name = cleanText(formData.get("name"));
  const location = cleanText(formData.get("location"));
  const cuisine_type = cleanText(formData.get("cuisine_type"));
  const description = cleanText(formData.get("description"));
  const image_url = cleanText(formData.get("image_url"));
  const website_url = cleanText(formData.get("website_url"));
  const phone = cleanText(formData.get("phone"));
  const email = cleanText(formData.get("email"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;
  const is_active = formData.get("is_active") === "on";

  if (!name || !description) {
    redirect("/admin/restaurants/new?status=missing");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("restaurants").insert({
    name,
    location,
    cuisine_type,
    description,
    image_url: image_url || null,
    website_url: website_url || null,
    phone: phone || null,
    email: email || null,
    sort_order,
    is_active,
  });

  if (error) {
    console.error("Create restaurant error:", error.message);
    redirect("/admin/restaurants/new?status=error");
  }

  revalidatePath("/restaurants");
  revalidatePath("/admin/restaurants");

  redirect("/admin/restaurants?status=created");
}

export async function updateRestaurant(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const name = cleanText(formData.get("name"));
  const location = cleanText(formData.get("location"));
  const cuisine_type = cleanText(formData.get("cuisine_type"));
  const description = cleanText(formData.get("description"));
  const image_url = cleanText(formData.get("image_url"));
  const website_url = cleanText(formData.get("website_url"));
  const phone = cleanText(formData.get("phone"));
  const email = cleanText(formData.get("email"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;
  const is_active = formData.get("is_active") === "on";

  if (!id || !name || !description) {
    redirect(`/admin/restaurants/${id}/edit?status=missing`);
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("restaurants")
    .update({
      name,
      location,
      cuisine_type,
      description,
      image_url: image_url || null,
      website_url: website_url || null,
      phone: phone || null,
      email: email || null,
      sort_order,
      is_active,
    })
    .eq("id", id);

  if (error) {
    console.error("Update restaurant error:", error.message);
    redirect(`/admin/restaurants/${id}/edit?status=error`);
  }

  revalidatePath("/restaurants");
  revalidatePath("/admin/restaurants");

  redirect("/admin/restaurants?status=updated");
}

export async function setRestaurantActive(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const is_active = cleanText(formData.get("is_active")) === "true";

  if (!id) {
    redirect("/admin/restaurants?status=invalid");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("restaurants")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    console.error("Set restaurant active error:", error.message);
    redirect("/admin/restaurants?status=error");
  }

  revalidatePath("/restaurants");
  revalidatePath("/admin/restaurants");

  redirect("/admin/restaurants?status=updated");
}

export async function createFaq(formData: FormData) {
  await requireAdmin();

  const question = cleanText(formData.get("question"));
  const answer = cleanText(formData.get("answer"));
  const category = cleanText(formData.get("category"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;
  const is_active = formData.get("is_active") === "on";

  if (!question || !answer) {
    redirect("/admin/faqs/new?status=missing");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("faqs").insert({
    question,
    answer,
    category: category || null,
    sort_order,
    is_active,
  });

  if (error) {
    console.error("Create FAQ error:", error.message);
    redirect("/admin/faqs/new?status=error");
  }

  revalidatePath("/");
  revalidatePath("/admin/faqs");

  redirect("/admin/faqs?status=created");
}

export async function updateFaq(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const question = cleanText(formData.get("question"));
  const answer = cleanText(formData.get("answer"));
  const category = cleanText(formData.get("category"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;
  const is_active = formData.get("is_active") === "on";

  if (!id || !question || !answer) {
    redirect(`/admin/faqs/${id}/edit?status=missing`);
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("faqs")
    .update({
      question,
      answer,
      category: category || null,
      sort_order,
      is_active,
    })
    .eq("id", id);

  if (error) {
    console.error("Update FAQ error:", error.message);
    redirect(`/admin/faqs/${id}/edit?status=error`);
  }

  revalidatePath("/");
  revalidatePath("/admin/faqs");

  redirect("/admin/faqs?status=updated");
}

export async function setFaqActive(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const is_active = cleanText(formData.get("is_active")) === "true";

  if (!id) {
    redirect("/admin/faqs?status=invalid");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("faqs")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    console.error("Set FAQ active error:", error.message);
    redirect("/admin/faqs?status=error");
  }

  revalidatePath("/");
  revalidatePath("/admin/faqs");

  redirect("/admin/faqs?status=updated");
}

export async function createTestimonial(formData: FormData) {
  await requireAdmin();

  const guest_name = cleanText(formData.get("guest_name"));
  const country = cleanText(formData.get("country"));
  const message = cleanText(formData.get("message"));
  const rating = cleanNumber(formData.get("rating"));
  const image_url = cleanText(formData.get("image_url"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;

  const is_featured = formData.get("is_featured") === "on";
  const is_approved = formData.get("is_approved") === "on";

  if (!guest_name || !message) {
    redirect("/admin/testimonials/new?status=missing");
  }

  if (rating !== null && (rating < 1 || rating > 5)) {
    redirect("/admin/testimonials/new?status=invalid-rating");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("testimonials").insert({
    guest_name,
    country: country || null,
    message,
    rating,
    image_url: image_url || null,
    is_featured,
    is_approved,
    sort_order,
  });

  if (error) {
    console.error("Create testimonial error:", error.message);
    redirect("/admin/testimonials/new?status=error");
  }

  revalidatePath("/");
  revalidatePath("/admin/testimonials");

  redirect("/admin/testimonials?status=created");
}

export async function updateTestimonial(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const guest_name = cleanText(formData.get("guest_name"));
  const country = cleanText(formData.get("country"));
  const message = cleanText(formData.get("message"));
  const rating = cleanNumber(formData.get("rating"));
  const image_url = cleanText(formData.get("image_url"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;

  const is_featured = formData.get("is_featured") === "on";
  const is_approved = formData.get("is_approved") === "on";

  if (!id || !guest_name || !message) {
    redirect(`/admin/testimonials/${id}/edit?status=missing`);
  }

  if (rating !== null && (rating < 1 || rating > 5)) {
    redirect(`/admin/testimonials/${id}/edit?status=invalid-rating`);
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("testimonials")
    .update({
      guest_name,
      country: country || null,
      message,
      rating,
      image_url: image_url || null,
      is_featured,
      is_approved,
      sort_order,
    })
    .eq("id", id);

  if (error) {
    console.error("Update testimonial error:", error.message);
    redirect(`/admin/testimonials/${id}/edit?status=error`);
  }

  revalidatePath("/");
  revalidatePath("/admin/testimonials");

  redirect("/admin/testimonials?status=updated");
}

export async function setTestimonialApproved(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const is_approved = cleanText(formData.get("is_approved")) === "true";

  if (!id) {
    redirect("/admin/testimonials?status=invalid");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("testimonials")
    .update({ is_approved })
    .eq("id", id);

  if (error) {
    console.error("Set testimonial approved error:", error.message);
    redirect("/admin/testimonials?status=error");
  }

  revalidatePath("/");
  revalidatePath("/admin/testimonials");

  redirect("/admin/testimonials?status=updated");
}

export async function setTestimonialFeatured(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const is_featured = cleanText(formData.get("is_featured")) === "true";

  if (!id) {
    redirect("/admin/testimonials?status=invalid");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("testimonials")
    .update({ is_featured })
    .eq("id", id);

  if (error) {
    console.error("Set testimonial featured error:", error.message);
    redirect("/admin/testimonials?status=error");
  }

  revalidatePath("/");
  revalidatePath("/admin/testimonials");

  redirect("/admin/testimonials?status=updated");
}

export async function createGalleryImage(formData: FormData) {
  await requireAdmin();

  const title = cleanText(formData.get("title"));
  const image_url = cleanText(formData.get("image_url"));
  const alt_text = cleanText(formData.get("alt_text"));
  const category = cleanText(formData.get("category"));
  const location = cleanText(formData.get("location"));
  const description = cleanText(formData.get("description"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;
  const is_active = formData.get("is_active") === "on";

  if (!title) {
    redirect("/admin/gallery/new?status=missing");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("gallery_images").insert({
    title,
    image_url: image_url || null,
    alt_text: alt_text || null,
    category: category || null,
    location: location || null,
    description: description || null,
    sort_order,
    is_active,
  });

  if (error) {
    console.error("Create gallery item error:", error.message);
    redirect("/admin/gallery/new?status=error");
  }

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");

  redirect("/admin/gallery?status=created");
}

export async function updateGalleryImage(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const title = cleanText(formData.get("title"));
  const image_url = cleanText(formData.get("image_url"));
  const alt_text = cleanText(formData.get("alt_text"));
  const category = cleanText(formData.get("category"));
  const location = cleanText(formData.get("location"));
  const description = cleanText(formData.get("description"));
  const sort_order = cleanNumber(formData.get("sort_order")) ?? 0;
  const is_active = formData.get("is_active") === "on";

  if (!id || !title) {
    redirect(`/admin/gallery/${id}/edit?status=missing`);
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("gallery_images")
    .update({
      title,
      image_url: image_url || null,
      alt_text: alt_text || null,
      category: category || null,
      location: location || null,
      description: description || null,
      sort_order,
      is_active,
    })
    .eq("id", id);

  if (error) {
    console.error("Update gallery item error:", error.message);
    redirect(`/admin/gallery/${id}/edit?status=error`);
  }

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");

  redirect("/admin/gallery?status=updated");
}

export async function setGalleryImageActive(formData: FormData) {
  await requireAdmin();

  const id = cleanText(formData.get("id"));
  const is_active = cleanText(formData.get("is_active")) === "true";

  if (!id) {
    redirect("/admin/gallery?status=invalid");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("gallery_images")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    console.error("Set gallery item active error:", error.message);
    redirect("/admin/gallery?status=error");
  }

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");

  redirect("/admin/gallery?status=updated");
}

