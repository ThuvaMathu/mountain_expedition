import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import { getContactDetails } from "@/services/get-contact";
import { emergency_contact, emergency_contact_email } from "../config";

// Register fonts (optional - using default fonts)
Font.register({
  family: "Helvetica",
  fonts: [{ src: "Helvetica" }, { src: "Helvetica-Bold", fontWeight: "bold" }],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 30,
    borderBottom: 3,
    borderBottomColor: "#0d9488",
    paddingBottom: 15,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d9488",
    marginBottom: 4,
  },
  invoiceTitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: "35%",
    fontSize: 10,
    color: "#6b7280",
  },
  value: {
    width: "65%",
    fontSize: 10,
    color: "#111827",
    fontWeight: "bold",
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottom: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableCell: {
    fontSize: 10,
    color: "#374151",
  },
  col1: {
    width: "50%",
  },
  col2: {
    width: "20%",
    textAlign: "right",
  },
  col3: {
    width: "30%",
    textAlign: "right",
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: 2,
    borderTopColor: "#0d9488",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  totalLabel: {
    width: 120,
    fontSize: 10,
    color: "#6b7280",
    textAlign: "right",
    paddingRight: 20,
  },
  totalValue: {
    width: 100,
    fontSize: 10,
    color: "#111827",
    textAlign: "right",
    fontWeight: "bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#ecfdf5",
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  grandTotalLabel: {
    width: 120,
    fontSize: 12,
    color: "#065f46",
    textAlign: "right",
    paddingRight: 20,
    fontWeight: "bold",
  },
  grandTotalValue: {
    width: 100,
    fontSize: 14,
    color: "#065f46",
    textAlign: "right",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 3,
  },
  statusBadge: {
    position: "absolute",
    top: 40,
    right: 40,
    backgroundColor: "#d1fae5",
    padding: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: "#065f46",
    fontWeight: "bold",
  },
  participantItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  participantName: {
    fontSize: 10,
    color: "#111827",
    fontWeight: "bold",
    marginBottom: 3,
  },
  participantDetails: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 2,
  },
});

interface InvoiceModernProps {
  booking: TBooking;
}

export const InvoiceModern: React.FC<InvoiceModernProps> = ({ booking }) => {
  const contactDetails = {
    email: emergency_contact_email,
    phone: emergency_contact,
  };
  const formatCurrency = (amount: number, currency: string) => {
    const normalized = currency?.trim().toUpperCase();
    const safeCurrency = normalized === "USD" ? "USD" : "INR";

    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: safeCurrency,
    }).format(amount);

    // Replace ₹ with Rs. (since ₹ may not render correctly in react-pdf)
    return safeCurrency === "INR" ? formatted.replace("₹", "Rs.") : formatted;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const serviceFee = booking.amount * 0.05; // Assuming 5% service fee
  const baseAmount = booking.amount - serviceFee;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>Tamil Adventure Treckking Club</Text>
          <Text style={styles.invoiceTitle}>BOOKING INVOICE</Text>
        </View>

        {/* Invoice Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Number:</Text>
            <Text style={styles.value}>{booking.bookingId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Issue Date:</Text>
            <Text style={styles.value}>
              {formatDate(booking.createdAt || new Date().toISOString())}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>
              {booking.paymentMethod === "razorpay_demo"
                ? "Demo Payment"
                : "Razorpay"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment ID:</Text>
            <Text style={styles.value}>{booking.razorpayPaymentId}</Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {booking.customerInfo.organizer.name}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{booking.userEmail}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>
              {booking.customerInfo.organizer.phone}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Country:</Text>
            <Text style={styles.value}>
              {booking.customerInfo.organizer.country}
            </Text>
          </View>
        </View>

        {/* Expedition Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expedition Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Mountain:</Text>
            <Text style={styles.value}>{booking.mountainName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Departure Date:</Text>
            <Text style={styles.value}>{booking.slotDetails?.date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Time:</Text>
            <Text style={styles.value}>
              {booking.slotDetails?.time || "N/A"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Participants:</Text>
            <Text style={styles.value}>{booking.participants}</Text>
          </View>
        </View>

        {/* Participants List */}
        {booking.customerInfo.members.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Participants ({booking.participants})
            </Text>
            {/* Organizer */}
            <View style={styles.participantItem}>
              <Text style={styles.participantName}>
                {booking.customerInfo.organizer.name} (Organizer)
              </Text>
              <Text style={styles.participantDetails}>
                Email: {booking.customerInfo.organizer.email}
              </Text>
              <Text style={styles.participantDetails}>
                Phone: {booking.customerInfo.organizer.phone}
              </Text>
              {booking.customerInfo.organizer.passport && (
                <Text style={styles.participantDetails}>
                  Passport: {booking.customerInfo.organizer.passport}
                </Text>
              )}
            </View>

            {/* Members */}
            {booking.customerInfo.members.map((member, index) => (
              <View key={index} style={styles.participantItem}>
                <Text style={styles.participantName}>
                  {member.name} (Member {index + 1})
                </Text>
                <Text style={styles.participantDetails}>
                  Email: {member.email}
                </Text>
                <Text style={styles.participantDetails}>
                  Phone: {member.phone}
                </Text>
                {member.passport && (
                  <Text style={styles.participantDetails}>
                    Passport: {member.passport}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Pricing Table */}
        <View style={styles.table}>
          <Text style={styles.sectionTitle}>Pricing Breakdown</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Quantity</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Amount</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col1]}>
              {booking.mountainName} - Base Price
            </Text>
            <Text style={[styles.tableCell, styles.col2]}>
              {booking.participants}
            </Text>
            <Text style={[styles.tableCell, styles.col3]}>
              {formatCurrency(baseAmount, booking.currency)}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col1]}>Service Fee</Text>
            <Text style={[styles.tableCell, styles.col2]}>1</Text>
            <Text style={[styles.tableCell, styles.col3]}>
              {formatCurrency(serviceFee, booking.currency)}
            </Text>
          </View>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(baseAmount, booking.currency)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Service Fee:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(serviceFee, booking.currency)}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total Paid:</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(booking.amount, booking.currency)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing Tamil Adventure Treckking Club!
          </Text>
          <Text style={styles.footerText}>
            For inquiries: {contactDetails.email} | {contactDetails.phone}
          </Text>
          <Text style={styles.footerText}>
            This is a computer-generated invoice and does not require a
            signature.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
