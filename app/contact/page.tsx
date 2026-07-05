import { submitContactInquiry } from "@/app/actions";

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = params.status;

  return (
    <main className="public-page">
      <section className="public-hero">
        <div className="container public-hero-grid">
          <div>
            <p className="travel-kicker">Contact Us</p>
            <h1>Tell us about your Bhutan travel plan.</h1>
            <p>
              Share your travel dates, group size, interests, and any special
              requirements. We will help shape the right itinerary.
            </p>
          </div>

          <div className="public-hero-card">
            <span>Start Here</span>
            <h2>A few details are enough to begin.</h2>
            <p>
              Send us your preferred travel month, number of travelers, and what
              kind of Bhutan experience you want.
            </p>
          </div>
        </div>
      </section>

      <section className="public-section container public-contact-layout">
        <form action={submitContactInquiry} className="public-contact-form">
          {status === "success" && (
            <div className="form-message success">
              Thank you. Your inquiry has been submitted successfully.
            </div>
          )}

          {status === "missing" && (
            <div className="form-message error">
              Please fill in your full name, email address, and message.
            </div>
          )}

          {status === "error" && (
            <div className="form-message error">
              Something went wrong while submitting your inquiry. Please try
              again.
            </div>
          )}

          <label>
            Full name
            <input name="full_name" type="text" required />
          </label>

          <label>
            Email address
            <input name="email" type="email" required />
          </label>

          <label>
            Phone / WhatsApp
            <input name="phone" type="text" />
          </label>

          <label>
            Subject
            <input name="subject" type="text" />
          </label>

          <label>
            Message
            <textarea
              name="message"
              placeholder="Tell us about your travel plan..."
              required
            />
          </label>

          <button type="submit" className="travel-button primary">
            Submit Inquiry
          </button>
        </form>

        <div className="public-contact-card">
          <p className="travel-kicker">Contact Details</p>
          <h2>We will help you plan with clarity.</h2>
          <p>
            Send your travel inquiry through the form. Your message will be
            saved securely in the database and reviewed by the travel team.
          </p>

          <div>
            <h3>Email</h3>
            <p>hello@purebhutantravel.com</p>
          </div>

          <div>
            <h3>WhatsApp</h3>
            <p>+975 17 000 000</p>
          </div>

          <div>
            <h3>Location</h3>
            <p>Bhutan</p>
          </div>
        </div>
      </section>
    </main>
  );
}