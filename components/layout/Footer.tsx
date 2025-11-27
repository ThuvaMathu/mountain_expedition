import { getContactDetails } from "@/services/get-contact";
import { FooterClient } from "./Footer-client";

const hideFooterRoutes = ["/admin"];

export async function Footer() {
  const contactDetails = await getContactDetails();

  return (
    <FooterClient
      contactDetails={contactDetails}
      hideRoutes={hideFooterRoutes}
    />
  );
}
