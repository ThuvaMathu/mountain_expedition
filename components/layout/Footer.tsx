import { getContactDetails } from "@/services/get-contact";
import { FooterClient } from "./Footer-client";
import NewFooter from "../landing-v2/Footer";

const hideFooterRoutes = ["/admin"];

export async function Footer() {
  const contactDetails = await getContactDetails();

  return (
    <NewFooter contactDetails={contactDetails} />
  );
}
