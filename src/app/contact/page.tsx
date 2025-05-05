import { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export const metadata: Metadata = {
  title: "Contact Me | Rith's Portfolio",
  description:
    "Connect with me for development opportunities, project collaborations, or professional inquiries",
};

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
        Get In Touch
      </h1>

      <div className="mb-8 space-y-4">
        <p className="text-muted-foreground text-lg">
          I&apos;m always interested in new opportunities, challenging projects,
          and connecting with fellow professionals.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="border-border/50 bg-card rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-medium">Development Opportunities</h3>
            <p className="text-muted-foreground text-sm">
              Looking for a skilled developer with management experience?
              Let&apos;s discuss how I can contribute to your team.
            </p>
          </div>

          <div className="border-border/50 bg-card rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-medium">Project Collaboration</h3>
            <p className="text-muted-foreground text-sm">
              Have an interesting project in mind? I&apos;m open to
              collaborations that leverage my technical and leadership skills.
            </p>
          </div>

          <div className="border-border/50 bg-card rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-medium">Professional Networking</h3>
            <p className="text-muted-foreground text-sm">
              Connect with me on social media to stay updated on my latest
              projects and professional journey.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ContactForm />
        <ContactInfo />
      </div>
    </main>
  );
}
