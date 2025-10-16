import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Helvetica",
  fonts: [{ src: "Helvetica" }, { src: "Helvetica-Bold", fontWeight: "bold" }],
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },
  headerSection: {
    marginBottom: 40,
  },
  companyInfo: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 6,
  },
  companyDetails: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.4,
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: 2,
    borderBottomColor: "#1f2937",
    paddingBottom: 15,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 5,
  },
  statusBox: {
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 3,
    border: 1,
    borderColor: "#d1d5db",
  },
  statusText: {
    fontSize: 9,
    color: "#374151",
    fontWeight: "bold",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 30,
  },
  infoBlock: {
    width: "48%",
  },
  blockTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoRow: {
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 10,
    color: "#1f2937",
    marginTop: 2,
  },
  expeditionSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#f9fafb",
    border: 1,
    borderColor: "#e5e7eb",
  },
  expeditionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  expeditionRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  expeditionLabel: {
    width: "40%",
    fontSize: 9,
    color: "#6b7280",
  },
  expeditionValue: {
    width: "60%",
    fontSize: 10,
    color: "#111827",
  },
  participantsSection: {
    marginBottom: 25,
  },
  participantCard: {
    marginBottom: 10,
    padding: 10,
    border: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  participantHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  participantDetail: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 2,
  },
  table: {
    marginTop: 25,
    marginBottom: 25,
  },
  tableTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: 2,
    borderBottomColor: "#1f2937",
    paddingBottom: 8,
    marginBottom: 10,
  },
  tableHeaderText: {
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
    textAlign: "center",
  },
  col3: {
    width: "15%",
    textAlign: "right",
  },
  col4: {
    width: "15%",
    textAlign: "right",
  },
  totalsBox: {
    marginTop: 20,
    marginLeft: "auto",
    width: "45%",
    border: 2,
    borderColor: "#1f2937",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottom: 1,
    borderBottomColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 10,
    color: "#1f2937",
    fontWeight: "bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#1f2937",
  },
  grandTotalLabel: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "bold",
  },
  notesSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#fffbeb",
    border: 1,
    borderColor: "#fbbf24",
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 5,
  },
  notesText: {
    fontSize: 8,
    color: "#78350f",
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 50,
    right: 50,
    borderTop: 1,
    borderTopColor: "#d1d5db",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 2,
  },
});

interface InvoiceClassicProps {
  booking: TBooking;
}

export const InvoiceClassic: React.FC<InvoiceClassicProps> = ({ booking }) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const serviceFee = booking.amount * 0.05;
  const baseAmount = booking.amount - serviceFee;
  const pricePerPerson = baseAmount / booking.participants;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              Tamil Adventure Treckking Club
            </Text>
            <Text style={styles.companyDetails}>
              123 Mountain View Drive, Adventure City, AC 12345
            </Text>
            <Text style={styles.companyDetails}>
              Email: support@tamiladventures.com | Phone: +1 (555) 123-4567
            </Text>
            <Text style={styles.companyDetails}>
              Tax ID: SQE-2024-001 | License: EXP-LICENSE-12345
            </Text>
          </View>

          <View style={styles.invoiceHeader}>
            <View>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.invoiceNumber}>#{booking.bookingId}</Text>
              <Text style={styles.invoiceNumber}>
                Date:{" "}
                {formatDate(booking.createdAt || new Date().toISOString())}
              </Text>
            </View>
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>
                STATUS: {booking.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Bill To and Payment Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.blockTitle}>Bill To</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>
                {booking.customerInfo.organizer.name}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{booking.userEmail}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>
                {booking.customerInfo.organizer.phone}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>
                {booking.customerInfo.organizer.country}
              </Text>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.blockTitle}>Payment Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>
                {booking.paymentMethod === "razorpay_demo"
                  ? "Demo Payment"
                  : "Razorpay"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Transaction ID</Text>
              <Text style={styles.infoValue}>
                {booking.razorpayPaymentId || "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order ID</Text>
              <Text style={styles.infoValue}>
                {booking.razorpayOrderId || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Expedition Details */}
        <View style={styles.expeditionSection}>
          <Text style={styles.expeditionTitle}>Expedition Details</Text>
          <View style={styles.expeditionRow}>
            <Text style={styles.expeditionLabel}>Mountain/Package:</Text>
            <Text style={styles.expeditionValue}>{booking.mountainName}</Text>
          </View>
          <View style={styles.expeditionRow}>
            <Text style={styles.expeditionLabel}>Departure Date:</Text>
            <Text style={styles.expeditionValue}>
              {booking.slotDetails?.date}
            </Text>
          </View>
          <View style={styles.expeditionRow}>
            <Text style={styles.expeditionLabel}>Time:</Text>
            <Text style={styles.expeditionValue}>
              {booking.slotDetails?.time || "As per itinerary"}
            </Text>
          </View>
          <View style={styles.expeditionRow}>
            <Text style={styles.expeditionLabel}>Total Participants:</Text>
            <Text style={styles.expeditionValue}>{booking.participants}</Text>
          </View>
        </View>

        {/* Participants List */}
        <View style={styles.participantsSection}>
          <Text style={styles.blockTitle}>Participant Details</Text>

          {/* Organizer */}
          <View style={styles.participantCard}>
            <Text style={styles.participantHeader}>
              {booking.customerInfo.organizer.name} (Lead Organizer)
            </Text>
            <Text style={styles.participantDetail}>
              Email: {booking.customerInfo.organizer.email}
            </Text>
            <Text style={styles.participantDetail}>
              Phone: {booking.customerInfo.organizer.phone}
            </Text>
            {booking.customerInfo.organizer.passport && (
              <Text style={styles.participantDetail}>
                Passport: {booking.customerInfo.organizer.passport}
              </Text>
            )}
            {booking.customerInfo.organizer.emergencyContact && (
              <Text style={styles.participantDetail}>
                Emergency Contact:{" "}
                {booking.customerInfo.organizer.emergencyContact}
              </Text>
            )}
          </View>

          {/* Members */}
          {booking.customerInfo.members.map((member, index) => (
            <View key={index} style={styles.participantCard}>
              <Text style={styles.participantHeader}>
                {member.name} (Participant {index + 2})
              </Text>
              <Text style={styles.participantDetail}>
                Email: {member.email}
              </Text>
              <Text style={styles.participantDetail}>
                Phone: {member.phone}
              </Text>
              {member.passport && (
                <Text style={styles.participantDetail}>
                  Passport: {member.passport}
                </Text>
              )}
              {member.emergencyContact && (
                <Text style={styles.participantDetail}>
                  Emergency Contact: {member.emergencyContact}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Pricing Table */}
        <View style={styles.table}>
          <Text style={styles.tableTitle}>Invoice Summary</Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.col1]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderText, styles.col2]}>Quantity</Text>
            <Text style={[styles.tableHeaderText, styles.col3]}>
              Unit Price
            </Text>
            <Text style={[styles.tableHeaderText, styles.col4]}>Amount</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col1]}>
              {booking.mountainName} Expedition
            </Text>
            <Text style={[styles.tableCell, styles.col2]}>
              {booking.participants}
            </Text>
            <Text style={[styles.tableCell, styles.col3]}>
              {formatCurrency(pricePerPerson, booking.currency)}
            </Text>
            <Text style={[styles.tableCell, styles.col4]}>
              {formatCurrency(baseAmount, booking.currency)}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col1]}>
              Service Fee & Processing
            </Text>
            <Text style={[styles.tableCell, styles.col2]}>1</Text>
            <Text style={[styles.tableCell, styles.col3]}>
              {formatCurrency(serviceFee, booking.currency)}
            </Text>
            <Text style={[styles.tableCell, styles.col4]}>
              {formatCurrency(serviceFee, booking.currency)}
            </Text>
          </View>
        </View>

        {/* Totals Box */}
        <View style={styles.totalsBox}>
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
            <Text style={styles.grandTotalLabel}>TOTAL PAID:</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(booking.amount, booking.currency)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Important Notes:</Text>
          <Text style={styles.notesText}>
            • Payment has been received in full. This invoice serves as your
            official booking confirmation.
          </Text>
          <Text style={styles.notesText}>
            • Please ensure all participants have valid travel insurance and
            necessary permits.
          </Text>
          <Text style={styles.notesText}>
            • Refer to our cancellation policy for refund terms and conditions.
          </Text>
          <Text style={styles.notesText}>
            • For any questions, contact our support team at
            support@tamiladventures.com
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing Tamil Adventure Treckking Club for your
            adventure!
          </Text>
          <Text style={styles.footerText}>
            This is a computer-generated document and does not require a
            physical signature.
          </Text>
          <Text style={styles.footerText}>
            Page 1 of 1 | Generated on {formatDate(new Date().toISOString())}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
