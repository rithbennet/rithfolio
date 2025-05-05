import { SocialLinks } from "@/components/social-links";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

export function ContactInfo() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>

        <div className="space-y-4">
          <div className="flex items-start">
            <Phone className="text-primary mr-3 h-5 w-5" />
            <div>
              <h3 className="font-medium">Phone</h3>
              <p className="text-muted-foreground">+6012-781 8524</p>
            </div>
          </div>

          <div className="flex items-start">
            <Mail className="text-primary mr-3 h-5 w-5" />
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-muted-foreground">harith.bennett@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start">
            <MapPin className="text-primary mr-3 h-5 w-5" />
            <div>
              <h3 className="font-medium">Location</h3>
              <p className="text-muted-foreground">Kuala Lumpur, Malaysia</p>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="mb-2 font-medium">Connect with me</h3>
            <SocialLinks />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
