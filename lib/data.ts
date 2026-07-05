import { createClient } from "@/lib/supabase/server";

export async function getTourPackages() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tour_packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching tour packages:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getFeaturedTourPackages() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tour_packages")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching featured tour packages:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getTourPackageBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tour_packages")
    .select(
      `
      *,
      package_itineraries (
        id,
        day_number,
        title,
        description,
        overnight,
        sort_order
      )
    `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching package:", error.message);
    return null;
  }

  if (data?.package_itineraries) {
    data.package_itineraries.sort(
      (a: { sort_order: number }, b: { sort_order: number }) =>
        a.sort_order - b.sort_order
    );
  }

  return data;
}

export async function getGalleryImages() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching gallery images:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getPartnerHotels() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("partner_hotels")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching partner hotels:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getRestaurants() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching restaurants:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getTestimonials() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_approved", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching testimonials:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getFaqs() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching FAQs:", error.message);
    return [];
  }

  return data ?? [];
}