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
    padding: 60,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#FAFAFA",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    fontSize: 80,
    color: "#f3f4f6",
    opacity: 0.1,
    fontWeight: "bold",
  },
  header: {
    marginBottom: 50,
    textAlign: "center",
  },
  brandName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 9,
    color: "#64748b",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: "#cbd5e1",
    marginVertical: 25,
  },
  elegantDivider: {
    height: 2,
    backgroundColor: "#0f172a",
    marginVertical: 30,
    width: "30%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 35,
  },
  invoiceInfo: {
    width: "60%",
  },
  invoiceLabel: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  invoiceValue: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "bold",
  },
  statusBadge: {
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 2,
    borderLeft: 3,
    borderLeftColor: "#10b981",
  },
  statusText: {
    fontSize: 9,
    color: "#059669",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  column: {
    width: "48%",
  },
  sectionTitle: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    borderBottom: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 6,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 8,
    color: "#94a3b8",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 10,
    color: "#1e293b",
  },
  highlightBox: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 30,
    border: 1,
    borderColor: "#e2e8f0",
  },
  expeditionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 15,
    textAlign: "center",
  },
  expeditionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  expeditionItem: {
    width: "48%",
    marginBottom: 10,
  },
  expeditionItemLabel: {
    fontSize: 8,
    color: "#94a3b8",
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  expeditionItemValue: {
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
  },
  participantsGrid: {
    marginBottom: 30,
  },
  participantCard: {
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 8,
    border: 1,
    borderColor: "#f1f5f9",
  },
  participantName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 6,
  },
  participantInfo: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 2,
  },
  table: {
    marginTop: 30,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 10,
    borderBottom: 2,
    borderBottomColor: "#0f172a",
    marginBottom: 12,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottom: 1,
    borderBottomColor: "#f1f5f9",
  },
  tableCell: {
    fontSize: 10,
    color: "#475569",
  },
  col1: {
    width: "55%",
  },
  col2: {
    width: "15%",
    textAlign: "center",
  },
  col3: {
    width: "30%",
    textAlign: "right",
  },
  totalsSection: {
    marginTop: 30,
    marginLeft: "auto",
    width: "50%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottom: 1,
    borderBottomColor: "#f1f5f9",
  },
  totalLabel: {
    fontSize: 10,
    color: "#64748b",
  },
  totalValue: {
    fontSize: 10,
    color: "#1e293b",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#0f172a",
    marginTop: 10,
  },
  grandTotalLabel: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  grandTotalValue: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
  },
  appreciationBox: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#ffffff",
    border: 1,
    borderColor: "#e2e8f0",
    textAlign: "center",
  },
  appreciationText: {
    fontSize: 11,
    color: "#475569",
    lineHeight: 1.6,
    marginBottom: 8,
  },
  signature: {
    marginTop: 15,
    fontSize: 12,
    color: "#0f172a",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 60,
    right: 60,
    textAlign: "center",
    paddingTop: 15,
    borderTop: 1,
    borderTopColor: "#e2e8f0",
  },
  footerText: {
    fontSize: 7,
    color: "#94a3b8",
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  footerBold: {
    fontSize: 8,
    color: "#64748b",
    fontWeight: "bold",
  },
});

interface InvoiceElegantProps {
  booking: TBooking;
}

export const InvoiceElegant: React.FC<InvoiceElegantProps> = ({ booking }) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const serviceFee = booking.amount * 0.05;
  const baseAmount = booking.amount - serviceFee;
  const pricePerPerson = baseAmount / booking.participants;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>PAID</Text>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandName}>Tamil Adventure Treckking Club</Text>
          <Text style={styles.tagline}>Expeditions & Adventures</Text>
        </View>

        <View style={styles.elegantDivider} />

        {/* Status and Invoice Info */}
        <View style={styles.statusRow}>
          <View style={styles.invoiceInfo}>
            <View style={styles.detailRow}>
              <Text style={styles.invoiceLabel}>Invoice Number</Text>
              <Text style={styles.invoiceValue}>{booking.bookingId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.invoiceLabel}>Issue Date</Text>
              <Text style={styles.invoiceValue}>
                {formatDate(booking.createdAt || new Date().toISOString())}
              </Text>
            </View>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {booking.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Customer and Payment Info */}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Billed To</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>
                {booking.customerInfo.organizer.name}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{booking.userEmail}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>
                {booking.customerInfo.organizer.phone}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Country</Text>
              <Text style={styles.detailValue}>
                {booking.customerInfo.organizer.country}
              </Text>
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Method</Text>
              <Text style={styles.detailValue}>
                {booking.paymentMethod === "razorpay_demo"
                  ? "Demo Payment"
                  : "Razorpay"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>
                {booking.razorpayPaymentId || "N/A"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Currency</Text>
              <Text style={styles.detailValue}>{booking.currency}</Text>
            </View>
          </View>
        </View>

        {/* Expedition Highlight */}
        <View style={styles.highlightBox}>
          <Text style={styles.expeditionName}>{booking.mountainName}</Text>
          <View style={styles.expeditionGrid}>
            <View style={styles.expeditionItem}>
              <Text style={styles.expeditionItemLabel}>Departure Date</Text>
              <Text style={styles.expeditionItemValue}>
                {booking.slotDetails?.date}
              </Text>
            </View>
            <View style={styles.expeditionItem}>
              <Text style={styles.expeditionItemLabel}>Participants</Text>
              <Text style={styles.expeditionItemValue}>
                {booking.participants} Person(s)
              </Text>
            </View>
            <View style={styles.expeditionItem}>
              <Text style={styles.expeditionItemLabel}>Time</Text>
              <Text style={styles.expeditionItemValue}>
                {booking.slotDetails?.time || "As Per Itinerary"}
              </Text>
            </View>
            <View style={styles.expeditionItem}>
              <Text style={styles.expeditionItemLabel}>Package Type</Text>
              <Text style={styles.expeditionItemValue}>Premium Expedition</Text>
            </View>
          </View>
        </View>

        {/* Participants */}
        <View style={styles.participantsGrid}>
          <Text style={styles.sectionTitle}>Expedition Members</Text>

          {/* Organizer */}
          <View style={styles.participantCard}>
            <Text style={styles.participantName}>
              {booking.customerInfo.organizer.name} • Lead Organizer
            </Text>
            <Text style={styles.participantInfo}>
              {booking.customerInfo.organizer.email} •{" "}
              {booking.customerInfo.organizer.phone}
            </Text>
            {booking.customerInfo.organizer.passport && (
              <Text style={styles.participantInfo}>
                Passport: {booking.customerInfo.organizer.passport}
              </Text>
            )}
          </View>

          {/* Members */}
          {booking.customerInfo.members.map((member, index) => (
            <View key={index} style={styles.participantCard}>
              <Text style={styles.participantName}>
                {member.name} • Member {index + 1}
              </Text>
              <Text style={styles.participantInfo}>
                {member.email} • {member.phone}
              </Text>
              {member.passport && (
                <Text style={styles.participantInfo}>
                  Passport: {member.passport}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Pricing Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Amount</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col1]}>
              Expedition Package • {booking.mountainName}
            </Text>
            <Text style={[styles.tableCell, styles.col2]}>
              {booking.participants}
            </Text>
            <Text style={[styles.tableCell, styles.col3]}>
              {formatCurrency(baseAmount, booking.currency)}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col1]}>
              Service Fee & Administrative Charges
            </Text>
            <Text style={[styles.tableCell, styles.col2]}>—</Text>
            <Text style={[styles.tableCell, styles.col3]}>
              {formatCurrency(serviceFee, booking.currency)}
            </Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(baseAmount, booking.currency)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Service Fee</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(serviceFee, booking.currency)}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL PAID</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(booking.amount, booking.currency)}
            </Text>
          </View>
        </View>

        {/* Appreciation Note */}
        <View style={styles.appreciationBox}>
          <Text style={styles.appreciationText}>
            Thank you for choosing Tamil Adventure Treckking Club.
          </Text>
          <Text style={styles.appreciationText}>
            We look forward to making your mountain adventure extraordinary.
          </Text>
          <Text style={styles.signature}>
            The Tamil Adventure Treckking Club Team
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBold}>Tamil Adventure Treckking Club</Text>
          <Text style={styles.footerText}>
            123 Mountain View Drive, Adventure City, AC 12345
          </Text>
          <Text style={styles.footerText}>
            support@tamiladventures.com • +1 (555) 123-4567
          </Text>
          <Text style={styles.footerText}>
            This invoice is computer-generated and requires no signature.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
