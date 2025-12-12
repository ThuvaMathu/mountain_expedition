import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { COMPANY_INFO } from "@/seo/config";
import logoImg from "@/assets/logo.png";
// Register fonts
Font.register({
  family: "Helvetica",
  fonts: [{ src: "Helvetica" }, { src: "Helvetica-Bold", fontWeight: "bold" }],
});

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },
  // Header Section
  header: {
    backgroundColor: "#0d9488",
    padding: 30,
    color: "#FFFFFF",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 50,
    height: 50,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  mountainName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  location: {
    fontSize: 14,
    opacity: 0.9,
  },
  // Hero Image
  heroImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
  },
  // Content Section
  content: {
    padding: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0d9488",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  text: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
    marginBottom: 8,
  },
  // Info Grid
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 20,
  },
  infoCard: {
    width: "48%",
    backgroundColor: "#f0fdfa",
    padding: 12,
    borderRadius: 4,
    borderLeft: 3,
    borderLeftColor: "#0d9488",
  },
  infoLabel: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0d9488",
  },
  // Highlights
  highlightsList: {
    marginLeft: 15,
  },
  highlightItem: {
    fontSize: 10,
    color: "#374151",
    marginBottom: 6,
    lineHeight: 1.5,
  },
  bullet: {
    color: "#0d9488",
    marginRight: 5,
  },
  // Itinerary
  itineraryItem: {
    backgroundColor: "#f9fafb",
    padding: 8,
    marginBottom: 6,
    borderRadius: 4,
  },
  itineraryDay: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0d9488",
    marginBottom: 3,
  },
  itineraryDesc: {
    fontSize: 8,
    color: "#4b5563",
    lineHeight: 1.4,
  },
  // Pricing
  pricingBox: {
    backgroundColor: "#ecfdf5",
    padding: 15,
    borderRadius: 4,
    marginBottom: 15,
  },
  priceLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 5,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#065f46",
  },
  priceNote: {
    fontSize: 8,
    color: "#059669",
    marginTop: 5,
  },
  // Footer
  footer: {
    backgroundColor: "#0f172a",
    padding: 20,
    color: "#FFFFFF",
    marginTop: "auto",
  },
  footerText: {
    fontSize: 8,
    color: "#cbd5e1",
    textAlign: "center",
    marginBottom: 5,
  },
  footerContact: {
    fontSize: 9,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  // Images Gallery
  imageGallery: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 15,
  },
  galleryImage: {
    width: "32%",
    height: 80,
    objectFit: "cover",
    borderRadius: 4,
  },
});

interface BrochureTemplateProps {
  mountain: TMountainType;
}

export const BrochureTemplate: React.FC<BrochureTemplateProps> = ({
  mountain,
}) => {
  const contactDetails = {
    email: COMPANY_INFO.contact.email,
    phone: COMPANY_INFO.contact.phone,
  };

  const formatCurrency = (amount: number, currency: string = "INR") => {
    const safeCurrency =
      currency?.trim().toUpperCase() === "USD" ? "USD" : "INR";
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: safeCurrency,
    }).format(amount);
    return safeCurrency === "INR" ? formatted.replace("₹", "Rs.") : formatted;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.companyName}>
                Tamil Adventure Trekking Club Private Limited
              </Text>
            </View>
            {/* Logo - using URL from COMPANY_INFO */}
            {/* <Image style={styles.logo} src={COMPANY_INFO.logoUrl} /> */}
            <Image style={styles.logo} src={logoImg.src} />
          </View>
          <Text style={styles.mountainName}>{mountain.name}</Text>
          <Text style={styles.location}>Location: {mountain.location}</Text>
        </View>

        {/* Hero Image */}
        {mountain.imageUrl && mountain.imageUrl[0] && (
          <Image style={styles.heroImage} src={mountain.imageUrl[0]} />
        )}

        {/* Content */}
        <View style={{ padding: 20 }}>
          {/* Quick Info Grid */}
          <View style={{ ...styles.infoGrid, marginBottom: 12, gap: 10 }}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Altitude</Text>
              <Text style={styles.infoValue}>
                {mountain.altitude.toLocaleString()}m
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{mountain.duration}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Difficulty</Text>
              <Text style={styles.infoValue}>{mountain.difficulty}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Best Season</Text>
              <Text style={styles.infoValue}>{mountain.bestSeason}</Text>
            </View>
          </View>

          {/* Overview */}
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{ ...styles.sectionTitle, fontSize: 12, marginBottom: 5 }}
            >
              Overview
            </Text>
            <Text
              style={{
                ...styles.text,
                fontSize: 8,
                marginBottom: 0,
                lineHeight: 1.4,
              }}
            >
              {mountain.description}
            </Text>
          </View>

          {/* Trek Highlights */}
          {mountain.highlights && mountain.highlights.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  ...styles.sectionTitle,
                  fontSize: 12,
                  marginBottom: 5,
                }}
              >
                Trek Highlights
              </Text>
              <View style={{ marginLeft: 15 }}>
                {mountain.highlights.slice(0, 4).map((highlight, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 8,
                      color: "#374151",
                      marginBottom: 3,
                      lineHeight: 1.4,
                    }}
                  >
                    <Text style={{ color: "#0d9488", marginRight: 5 }}>•</Text>{" "}
                    {highlight}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Pricing - Keep on page 1 */}
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{ ...styles.sectionTitle, fontSize: 12, marginBottom: 5 }}
            >
              Pricing
            </Text>
            <View
              style={{
                backgroundColor: "#ecfdf5",
                padding: 10,
                borderRadius: 4,
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 8, color: "#6b7280", marginBottom: 3 }}>
                Starting from
              </Text>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#065f46" }}
              >
                {formatCurrency(mountain.priceINR, "INR")} /{" "}
                {formatCurrency(mountain.priceUSD, "USD")}
              </Text>
              <Text style={{ fontSize: 7, color: "#059669", marginTop: 3 }}>
                * Price includes all fees, GST (18%), taxes, and processing
                charges
              </Text>
            </View>
          </View>

          {/* What's Included - Compact on page 1 */}
          {mountain.included && mountain.included.length > 0 && (
            <View style={{ marginBottom: 8 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "#0d9488",
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}
              >
                What's Included
              </Text>
              <View style={{ marginLeft: 15 }}>
                {mountain.included.slice(0, 5).map((item, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 7,
                      color: "#374151",
                      marginBottom: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    <Text style={{ color: "#059669" }}>✓</Text> {item}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* What's NOT Included - on page 1 */}
          {mountain.notIncluded && mountain.notIncluded.length > 0 && (
            <View style={{ marginBottom: 8 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "#0d9488",
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}
              >
                What's Not Included
              </Text>
              <View style={{ marginLeft: 15 }}>
                {mountain.notIncluded.slice(0, 4).map((item, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 7,
                      color: "#374151",
                      marginBottom: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    <Text style={{ color: "#dc2626" }}>✗</Text> {item}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
        {/* </Page> */}

        {/* Page 2 - Itinerary & Details */}
        {/* <Page size="A4" style={styles.page}> */}
        <View style={styles.content}>
          {/* Complete Itinerary */}
          {mountain.itinerary && mountain.itinerary.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Complete Day-by-Day Itinerary
              </Text>
              {mountain.itinerary.slice(0, 8).map((day, index) => (
                <View key={index} style={styles.itineraryItem}>
                  <Text style={styles.itineraryDay}>
                    Day {day.day}: {day.title}
                  </Text>
                  <Text style={styles.itineraryDesc}>{day.description}</Text>
                </View>
              ))}
              {mountain.itinerary.length > 8 && (
                <Text
                  style={{
                    ...styles.text,
                    fontStyle: "italic",
                    marginTop: 5,
                    fontSize: 8,
                  }}
                >
                  ...and {mountain.itinerary.length - 8} more days. Contact us
                  for the complete itinerary.
                </Text>
              )}
            </View>
          )}

          {/* Important Notes */}
          <View style={styles.section}>
            <Text style={{ ...styles.sectionTitle, fontSize: 12 }}>
              Important Information
            </Text>
            <View style={styles.highlightsList}>
              <Text style={{ ...styles.highlightItem, fontSize: 8 }}>
                • Valid travel insurance required before trek
              </Text>
              <Text style={{ ...styles.highlightItem, fontSize: 8 }}>
                • Physical fitness assessment recommended
              </Text>
              <Text style={{ ...styles.highlightItem, fontSize: 8 }}>
                • Liability waiver must be signed
              </Text>
              <Text style={{ ...styles.highlightItem, fontSize: 8 }}>
                • Weather may affect itinerary
              </Text>
            </View>
          </View>

          {/* CTA Section */}
          <View
            style={{
              backgroundColor: "#0d9488",
              padding: 15,
              borderRadius: 4,
              marginTop: 15,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#FFFFFF",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Ready to Start Your Adventure?
            </Text>
            <Text
              style={{
                fontSize: 9,
                color: "#FFFFFF",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Contact our experts for personalized itineraries and group
              bookings
            </Text>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                padding: 10,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  color: "#0d9488",
                  textAlign: "center",
                  marginBottom: 3,
                }}
              >
                Email: {contactDetails.email}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  color: "#0d9488",
                  textAlign: "center",
                }}
              >
                Phone: {contactDetails.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer for Page 2 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tamil Adventure Trekking Club - Your Gateway to Mountain Adventures
          </Text>
          <Text style={styles.footerText}>
            www.tamiladventuretrekkingclub.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};
