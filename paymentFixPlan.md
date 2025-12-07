# Razorpay + Firebase Integration Security Plan

## Current Payment Flow Analysis

### Flow Diagram

```
┌─────────────┐
│   CLIENT    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. User fills form & clicks "Pay Now"
       │    - Participant details
       │    - Terms & conditions
       │
       ↓
┌──────────────────────────────────────────────┐
│ CLIENT: Validation                            │
│ - Check if user is authenticated             │
│ - Validate all required fields filled        │
│ - Verify terms & conditions checked          │
│ - Validate mountain/product data loaded      │
└──────┬───────────────────────────────────────┘
       │
       │ 2. Call createRazorpayOrder()
       ↓
┌──────────────────────────────────────────────┐
│ API: POST /api/razorpay/create-order         │
│                                               │
│ Input:                                        │
│ - amount, currency                            │
│ - mountainId, mountainName                    │
│ - date, participants                          │
│ - customerInfo (all participant data)        │
│                                               │
│ Process:                                      │
│ - Generate unique bookingId                   │
│ - Check if demo mode (IS_RAZORPAY_LIVE)      │
│                                               │
│ DEMO MODE:                                    │
│ - Return mock order with demo flag            │
│                                               │
│ LIVE MODE:                                    │
│ - Initialize Razorpay SDK                     │
│ - Convert amount to paise/cents               │
│ - Create Razorpay order with notes            │
│ - Store customer info in order.notes          │
│                                               │
│ Output:                                       │
│ - orderId, bookingId                          │
│ - amount, currency                            │
│ - key (Razorpay public key)                  │
│ - demo (boolean flag)                         │
└──────┬───────────────────────────────────────┘
       │
       │ 3. Receive order details
       ↓
┌──────────────────────────────────────────────┐
│ CLIENT: Payment Processing                    │
│                                               │
│ IF DEMO MODE:                                 │
│ - Skip Razorpay popup                         │
│ - Generate fake payment IDs (UUID)            │
│ - Directly call verify-payment API            │
│ - Redirect to confirmation page               │
│                                               │
│ IF LIVE MODE:                                 │
│ - Load Razorpay SDK (checkout.js)            │
│ - Configure Razorpay options:                 │
│   * key, amount, currency, order_id           │
│   * company name, description                 │
│   * prefill: name, email, phone               │
│   * theme color                               │
│   * handler callback                          │
│ - Open Razorpay payment popup                 │
│ - User completes payment on Razorpay          │
└──────┬───────────────────────────────────────┘
       │
       │ 4. Payment completed (handler callback)
       │    Response from Razorpay:
       │    - razorpay_order_id
       │    - razorpay_payment_id
       │    - razorpay_signature
       ↓
┌──────────────────────────────────────────────┐
│ API: POST /api/razorpay/verify-payment       │
│                                               │
│ Input:                                        │
│ - razorpay_order_id                           │
│ - razorpay_payment_id                         │
│ - razorpay_signature                          │
│ - type (trekking/tourist)                     │
│ - bookingDetails (full booking data)          │
│                                               │
│ Process:                                      │
│                                               │
│ DEMO MODE:                                    │
│ - Skip signature verification                 │
│ - Use fake payment IDs                        │
│                                               │
│ LIVE MODE:                                    │
│ - Verify Razorpay signature (HMAC SHA256)    │
│   * body = order_id + "|" + payment_id        │
│   * hash = HMAC(body, secret_key)             │
│   * compare hash with razorpay_signature      │
│ - Return 400 if verification fails            │
│                                               │
│ BOTH MODES:                                   │
│ 1. Fetch invoice template from Firebase       │
│    - Read settings/invoiceTemplate doc        │
│    - Default: "modern"                        │
│                                               │
│ 2. Create booking object:                     │
│    - bookingId, mountainId, mountainName      │
│    - slotDetails, participants, customerInfo  │
│    - amount, currency, status: "confirmed"    │
│    - paymentMethod (razorpay/razorpay_demo)   │
│    - razorpayOrderId, razorpayPaymentId       │
│    - createdAt (server timestamp)             │
│    - pdfUrl, pdfPath (empty, updated later)   │
│                                               │
│ 3. Generate PDF Invoice:                      │
│    - Use selected template type               │
│    - Pass booking data to PDF generator       │
│    - Return Buffer                            │
│                                               │
│ 4. Upload PDF to Firebase Storage:            │
│    - Path: invoices/{bookingId}.pdf           │
│    - Get signed URL (7-day expiration)        │
│    - Store url and path                       │
│                                               │
│ 5. Save booking to Firestore:                 │
│    - Add to "bookings" collection             │
│    - Update with document ID                  │
│    - Include pdfUrl and pdfPath               │
│                                               │
│ 6. Send confirmation email:                   │
│    - To: customer email                       │
│    - Attach: PDF invoice                      │
│    - Include: booking details                 │
│    - Don't fail booking if email fails        │
│                                               │
│ Output:                                       │
│ - success: true                               │
│ - bookingId, id (document ID)                 │
│ - pdfUrl                                      │
│ - demo (boolean)                              │
└──────┬───────────────────────────────────────┘
       │
       │ 5. Verification success
       ↓
┌──────────────────────────────────────────────┐
│ CLIENT: Redirect                              │
│ - Navigate to confirmation page               │
│ - Route: /booking/confirmation/{id}?type=X    │
└───────────────────────────────────────────────┘
```

---

## Security Issues Identified

### 🚨 CRITICAL ISSUES

1. **Environment Variable Bug in `create-order/route.ts`**
   - **Line 6**: Uses `RAZORPAY_KEY_ID` (undefined)
   - **Should use**: `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Impact**: Razorpay initialization may fail in production

2. **Inverted Demo Mode Logic**
   - **Line 8**: `isRazorpayConfigured = process.env.IS_RAZORPAY_LIVE === "false"`
   - **Result**: Returns `true` when in TEST mode (confusing naming)
   - **Line 37**: Demo mode activates when `isRazorpayConfigured` is `true`
   - **Impact**: Logic is backwards - confusing and error-prone

3. **No Order State Tracking Before Payment**
   - Orders are created but **NOT saved to Firebase** before payment
   - If user closes browser or payment fails, no record exists
   - Cannot track abandoned payments or retry failures
   - **Risk**: Lost orders, no audit trail

4. **Client Sends All Booking Data to Verify Endpoint**
   - **Line 253-266** in checkout page: Client sends full `bookingDetails`
   - Includes: amount, participants, customerInfo, mountainId, etc.
   - **Risk**: Client can manipulate data (pay $10, send $1000 in verify)
   - Server should fetch order details from its own database

5. **No Request Authentication**
   - API routes don't verify user authentication
   - Anyone can call `/api/razorpay/create-order` with any data
   - No rate limiting or abuse prevention
   - **Risk**: Spam orders, fake bookings, API abuse

6. **Missing Input Validation**
   - No validation of amount, currency, participants
   - No checking if slot is still available
   - No verification that user has permission to book
   - **Risk**: Invalid data in database, overbooking

7. **Sensitive Data in Client Code**
   - Full customer info (passport, medical, emergency contact) sent to client
   - Stored in browser state and localStorage (currency store)
   - **Risk**: Data exposure if XSS vulnerability exists

8. **No Webhook Support**
   - Only client-side payment confirmation
   - If user closes browser before handler callback, payment is lost
   - Razorpay webhooks provide server-to-server notification
   - **Risk**: Successful payments may not be recorded

### ⚠️ MEDIUM ISSUES

9. **Weak Error Handling**
   - Generic error messages expose internal state
   - Console.error logs may contain sensitive data
   - No structured error logging or monitoring

10. **No Idempotency Protection**
    - Verify-payment can be called multiple times with same signature
    - Could create duplicate bookings
    - **Risk**: Double-charging, duplicate records

11. **PDF Generation Blocks Response**
    - Synchronous PDF generation and email sending
    - User waits for PDF upload and email before confirmation
    - **Should be**: Background job queue

12. **Missing CORS Configuration**
    - No explicit CORS headers on API routes
    - May cause issues with mobile apps or external integrations

### 📋 BEST PRACTICE ISSUES

13. **No .env.example File**
    - Real credentials in `.env.local`
    - New developers won't know what variables are needed
    - **Risk**: Accidental credential exposure in git

14. **Service Account Key as String**
    - Firebase service account stored as JSON string in env
    - Better: Use JSON file with restricted permissions

15. **No Firestore Security Rules Mentioned**
    - Unknown if bookings collection is properly secured
    - Users might be able to read/modify others' bookings

16. **Hard-coded Company Name**
    - "Tamil Adventure Treckking Club" (typo: Treckking)
    - Should be from environment or config

---

## Proposed Security Architecture

### Enhanced Payment Flow with Security Layers

```
CLIENT                    SERVER                    FIREBASE
  │                         │                          │
  │ 1. Request order        │                          │
  │ + Auth Token ──────────→│                          │
  │                         │ Verify JWT token         │
  │                         │ Validate user            │
  │                         │                          │
  │                         │ Validate inputs:         │
  │                         │ - Slot availability      │
  │                         │ - Participant count      │
  │                         │ - Amount calculation     │
  │                         │                          │
  │                         │ Create pending order ───→│ Save order
  │                         │                          │ status: pending
  │                         │                          │
  │                         │ Generate Razorpay order  │
  │                         │                          │
  │                         │ Update order with IDs ──→│ Update order
  │                         │                          │ + razorpay_order_id
  │                         │                          │
  │←────── Order response   │                          │
  │   (orderId, bookingId)  │                          │
  │                         │                          │
  │ 2. Open Razorpay popup  │                          │
  │    [User pays]          │                          │
  │                         │                          │
  │ 3. Payment success      │                          │
  │ + Payment signature ───→│                          │
  │                         │ Fetch order from DB ────→│ Get pending order
  │                         │                          │
  │                         │ Verify signature         │
  │                         │                          │
  │                         │ Check idempotency        │
  │                         │ (prevent duplicate)      │
  │                         │                          │
  │                         │ Update order status ────→│ status: confirmed
  │                         │                          │
  │                         │ Queue PDF job ──────────→│ Add to job queue
  │                         │                          │
  │←────── Success response │                          │
  │   (bookingId only)      │                          │
  │                         │                          │
  │                         │                          │
  │         WEBHOOK         │                          │
  │         (parallel)      │                          │
  │                         │                          │
  Razorpay ────webhook────→│ Verify webhook signature │
            payment.success │ Fetch order ────────────→│
                            │ Double-check status      │
                            │ Mark as webhook-verified─→│
```

---

## Implementation Plan

### Phase 1: Fix Critical Bugs ⚡ (30 min)

**File: `app/api/razorpay/create-order/route.ts`**

1. Fix environment variable name:
   ```typescript
   // Line 6 - BEFORE:
   const razorpayKeyId = process.env.RAZORPAY_KEY_ID;

   // AFTER:
   const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
   ```

2. Fix demo mode logic naming:
   ```typescript
   // Line 8 - BEFORE:
   const isRazorpayConfigured = process.env.IS_RAZORPAY_LIVE === "false";

   // AFTER:
   const isDemoMode = process.env.IS_RAZORPAY_LIVE === "false";

   // Update all references from isRazorpayConfigured to isDemoMode
   ```

3. Fix demo mode condition:
   ```typescript
   // Line 37 - BEFORE:
   if (isRazorpayConfigured) { // Demo mode

   // AFTER:
   if (isDemoMode) { // Demo mode
   ```

**File: `app/api/razorpay/verify-payment/route.ts`**

4. Fix demo mode variable name:
   ```typescript
   // Line 21 - BEFORE:
   const isRazorpayConfigured = process.env.IS_RAZORPAY_LIVE === "false";

   // AFTER:
   const isDemoMode = process.env.IS_RAZORPAY_LIVE === "false";

   // Update line 37 and 151 accordingly
   ```

**File: `app/booking/checkout/page.tsx`**

5. Fix typo in company name:
   ```typescript
   // Line 242 - BEFORE:
   name: "Tamil Adventure Treckking Club",

   // AFTER:
   name: "Tamil Adventure Trekking Club",
   ```

---

### Phase 2: Add Order State Management 🗄️ (1 hour)

**Goal**: Save orders to Firebase BEFORE payment to track all order attempts

**New Firestore Collection Structure:**

```typescript
// Collection: orders
{
  orderId: string;              // Firestore document ID
  bookingId: string;            // Display ID (BK-XXX)
  razorpayOrderId: string;      // Razorpay order ID
  userId: string;               // Authenticated user ID
  userEmail: string;            // User email

  // Booking details
  mountainId: string;
  mountainName: string;
  type: "trekking" | "tourist";
  slotId: string;
  slotDate: string;
  participants: number;

  // Pricing (server-calculated, NOT from client)
  baseAmount: number;
  serviceFee: number;
  totalAmount: number;
  currency: "INR" | "USD";

  // Customer info
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  customerInfo: TParticipantGroup;  // Full participant data

  // Status tracking
  status: "pending" | "processing" | "confirmed" | "failed" | "expired";
  paymentMethod: "razorpay" | "razorpay_demo";

  // Payment details (filled after verification)
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  webhookVerified?: boolean;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  paidAt?: Timestamp;
  expiresAt: Timestamp;  // Auto-expire after 15 minutes

  // Audit
  ipAddress?: string;
  userAgent?: string;
}
```

**File: `app/api/razorpay/create-order/route.ts`**

Add order creation logic:

```typescript
// After generating bookingId and before Razorpay order creation:

// 1. Validate inputs
if (!amount || amount <= 0) {
  return NextResponse.json(
    { error: "Invalid amount" },
    { status: 400 }
  );
}

if (!mountainId || !date) {
  return NextResponse.json(
    { error: "Missing required fields" },
    { status: 400 }
  );
}

// 2. Calculate amount SERVER-SIDE (don't trust client)
// TODO: Fetch mountain price from Firestore
// TODO: Calculate service fee
// TODO: Validate against client amount (within tolerance)

// 3. Check slot availability
// TODO: Query Firestore to ensure slot isn't full

// 4. Create pending order in Firestore
const orderData = {
  bookingId,
  userId: cusInfo.participantsInfo.organizer.email, // TODO: Get from JWT
  userEmail: cusInfo.participantsInfo.organizer.email,
  mountainId,
  mountainName,
  type: body.type || "trekking",
  slotId: date,
  slotDate: date, // TODO: Parse actual date
  participants,
  baseAmount: amount, // TODO: Use server-calculated value
  serviceFee: 0, // TODO: Calculate
  totalAmount: amount, // TODO: Use server-calculated value
  currency: currency.toUpperCase(),
  organizerName: cusInfo.participantsInfo.organizer.name,
  organizerEmail: cusInfo.participantsInfo.organizer.email,
  organizerPhone: cusInfo.participantsInfo.organizer.phone,
  customerInfo: cusInfo,
  status: "pending",
  paymentMethod: isDemoMode ? "razorpay_demo" : "razorpay",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
};

const orderDocRef = await addDoc(collection(db, "orders"), orderData);

// 5. Create Razorpay order (or demo order)
// ... existing logic ...

// 6. Update order with Razorpay order ID
await updateDoc(orderDocRef, {
  razorpayOrderId: order.id, // or demo ID
  updatedAt: serverTimestamp(),
});

// 7. Return order details (NO customer data)
return NextResponse.json({
  orderId: orderDocRef.id, // Firestore doc ID
  bookingId,
  razorpayOrderId: order.id,
  amount: order.amount,
  currency: order.currency,
  key: razorpayKeyId,
  demo: isDemoMode,
});
```

**File: `app/api/razorpay/verify-payment/route.ts`**

Modify to fetch order from Firebase:

```typescript
// BEFORE: Accept bookingDetails from client
// AFTER: Fetch from server

const {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  orderId, // Firestore document ID (sent from client)
} = body;

// 1. Fetch order from Firestore by ID
const orderDocRef = doc(db, "orders", orderId);
const orderSnap = await getDoc(orderDocRef);

if (!orderSnap.exists()) {
  return NextResponse.json(
    { error: "Order not found" },
    { status: 404 }
  );
}

const order = orderSnap.data();

// 2. Validate order state
if (order.status === "confirmed") {
  // Idempotency: Already processed
  return NextResponse.json({
    success: true,
    bookingId: order.bookingId,
    id: orderId,
    message: "Order already confirmed",
  });
}

if (order.status === "expired") {
  return NextResponse.json(
    { error: "Order has expired" },
    { status: 400 }
  );
}

if (order.razorpayOrderId !== razorpay_order_id) {
  return NextResponse.json(
    { error: "Order ID mismatch" },
    { status: 400 }
  );
}

// 3. Verify signature (existing logic)
// ... HMAC verification ...

// 4. Mark order as processing (prevent duplicate processing)
await updateDoc(orderDocRef, {
  status: "processing",
  razorpayPaymentId,
  razorpaySignature,
  updatedAt: serverTimestamp(),
});

// 5. Create booking record (existing logic)
// Use data from ORDER, not from client

// 6. Update order to confirmed
await updateDoc(orderDocRef, {
  status: "confirmed",
  paidAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

// 7. Queue background jobs (PDF, email)
// For now, keep synchronous, but add TODO comment

return NextResponse.json({
  success: true,
  bookingId: order.bookingId,
  id: orderId,
});
```

**File: `app/booking/checkout/page.tsx`**

Update to store and pass Firestore order ID:

```typescript
// After creating order
const orderData = await createRazorpayOrder({...});

// Store order ID in state
setOrderId(orderData.orderId);

// In Razorpay handler callback
handler: async (response: any) => {
  const verifyResponse = await fetch("/api/razorpay/verify-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      orderId: orderData.orderId, // Firestore doc ID
      // NO bookingDetails - server has it
    }),
  });
  // ... rest of handler
}
```

---

### Phase 3: Add Authentication & Authorization 🔐 (1 hour)

**Goal**: Verify user identity and permissions on all API routes

**New Utility: `lib/auth-utils.ts`**

```typescript
import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function verifyAuthToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function getUserAgent(request: NextRequest): string {
  return request.headers.get("user-agent") || "unknown";
}
```

**Update: `contexts/AuthContext.tsx`**

Add method to get Firebase ID token:

```typescript
const getAuthToken = async () => {
  if (!user) return null;
  return await user.getIdToken();
};

// Add to context value
return (
  <AuthContext.Provider value={{ user, loading, getAuthToken, ... }}>
    {children}
  </AuthContext.Provider>
);
```

**Update: `app/api/razorpay/create-order/route.ts`**

Add authentication:

```typescript
import { verifyAuthToken, getClientIP, getUserAgent } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  // 1. Verify authentication
  const decodedToken = await verifyAuthToken(request);

  if (!decodedToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = decodedToken.uid;
  const userEmail = decodedToken.email;

  // 2. Get request metadata
  const ipAddress = getClientIP(request);
  const userAgent = getUserAgent(request);

  // ... rest of logic ...

  // Include in order data
  const orderData = {
    // ... existing fields ...
    userId,
    userEmail,
    ipAddress,
    userAgent,
    // ...
  };
}
```

**Update: `lib/razorpay.ts`**

Modify to include auth token:

```typescript
import { getAuth } from "firebase/auth";

export const createRazorpayOrder = async (orderData: TOrderData) => {
  // Get Firebase auth token
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();

  const response = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  return response.json();
};
```

**Update: `app/api/razorpay/verify-payment/route.ts`**

Add same authentication check.

---

### Phase 4: Server-Side Amount Validation 💰 (45 min)

**Goal**: Calculate amounts on server to prevent client manipulation

**New Utility: `lib/pricing-utils.ts`**

```typescript
import { db } from "@/lib/firebase-admin";
import { serviceFeeCal } from "@/lib/service-fee-cal";

export async function calculateOrderAmount({
  mountainId,
  type,
  participants,
  currency,
}: {
  mountainId: string;
  type: "trekking" | "tourist";
  participants: number;
  currency: "INR" | "USD";
}) {
  // 1. Fetch product from Firestore
  const collectionName = type === "trekking" ? "mountains" : "tourist-packages";
  const productDoc = await db.collection(collectionName).doc(mountainId).get();

  if (!productDoc.exists) {
    throw new Error("Product not found");
  }

  const product = productDoc.data();

  // 2. Get unit price based on currency
  let unitPrice: number;

  if (currency === "INR") {
    unitPrice = product.price?.inr || 0;
  } else if (currency === "USD") {
    unitPrice = product.price?.usd || 0;
  } else {
    throw new Error("Invalid currency");
  }

  if (unitPrice <= 0) {
    throw new Error("Invalid product price");
  }

  // 3. Calculate amounts
  const baseAmount = unitPrice * participants;
  const serviceFee = serviceFeeCal(currency, baseAmount);
  const totalAmount = baseAmount + serviceFee;

  return {
    unitPrice,
    baseAmount,
    serviceFee,
    totalAmount,
  };
}

export function validateAmountTolerance({
  serverAmount,
  clientAmount,
  tolerance = 1, // Allow 1 unit difference for rounding
}: {
  serverAmount: number;
  clientAmount: number;
  tolerance?: number;
}) {
  const difference = Math.abs(serverAmount - clientAmount);
  return difference <= tolerance;
}
```

**Update: `app/api/razorpay/create-order/route.ts`**

Add server-side calculation:

```typescript
import { calculateOrderAmount, validateAmountTolerance } from "@/lib/pricing-utils";

export async function POST(request: NextRequest) {
  // ... auth verification ...

  const body = await request.json();
  const {
    amount: clientAmount, // Rename to indicate it's from client
    currency,
    mountainId,
    participants,
    type,
    // ...
  } = body;

  // Calculate amount SERVER-SIDE
  const pricing = await calculateOrderAmount({
    mountainId,
    type,
    participants,
    currency,
  });

  // Validate client amount matches server calculation
  if (!validateAmountTolerance({
    serverAmount: pricing.totalAmount,
    clientAmount,
  })) {
    console.error("Amount mismatch:", {
      server: pricing.totalAmount,
      client: clientAmount,
    });

    return NextResponse.json(
      { error: "Invalid amount" },
      { status: 400 }
    );
  }

  // Use SERVER-CALCULATED amount for Razorpay order
  const amountInSmallestUnit = Math.round(pricing.totalAmount * 100);

  const order = await razorpay.orders.create({
    amount: amountInSmallestUnit,
    // ... rest of order
  });

  // Store pricing breakdown in order
  const orderData = {
    // ... other fields ...
    unitPrice: pricing.unitPrice,
    baseAmount: pricing.baseAmount,
    serviceFee: pricing.serviceFee,
    totalAmount: pricing.totalAmount,
    currency,
    // ...
  };
}
```

---

### Phase 5: Add Input Validation & Rate Limiting 🛡️ (30 min)

**New Utility: `lib/validation-utils.ts`**

```typescript
export function validateOrderInput({
  mountainId,
  participants,
  slotId,
  currency,
}: any) {
  const errors: string[] = [];

  if (!mountainId || typeof mountainId !== "string") {
    errors.push("Invalid mountainId");
  }

  if (!Number.isInteger(participants) || participants < 1 || participants > 50) {
    errors.push("Participants must be between 1 and 50");
  }

  if (!slotId || typeof slotId !== "string") {
    errors.push("Invalid slotId");
  }

  if (!["INR", "USD"].includes(currency)) {
    errors.push("Invalid currency");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function checkSlotAvailability({
  mountainId,
  type,
  slotId,
  requestedParticipants,
}: {
  mountainId: string;
  type: string;
  slotId: string;
  requestedParticipants: number;
}) {
  // 1. Fetch product
  const collectionName = type === "trekking" ? "mountains" : "tourist-packages";
  const productDoc = await db.collection(collectionName).doc(mountainId).get();

  if (!productDoc.exists) {
    return { available: false, reason: "Product not found" };
  }

  const product = productDoc.data();

  // 2. Find slot
  let slot: any = null;

  for (const dateObj of product.availableDates || []) {
    slot = dateObj.slots.find((s: any) => s.id === slotId);
    if (slot) break;
  }

  if (!slot) {
    return { available: false, reason: "Slot not found" };
  }

  // 3. Check capacity
  const maxCapacity = slot.maxCapacity || 0;
  const currentBookings = slot.currentBookings || 0;
  const availableSpots = maxCapacity - currentBookings;

  if (requestedParticipants > availableSpots) {
    return {
      available: false,
      reason: `Only ${availableSpots} spots available`,
    };
  }

  return { available: true, availableSpots };
}
```

**Simple Rate Limiting (in-memory)**

```typescript
// lib/rate-limit.ts
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(identifier: string, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetAt) {
    // New window
    requestCounts.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}
```

**Update: `app/api/razorpay/create-order/route.ts`**

```typescript
import { validateOrderInput, checkSlotAvailability } from "@/lib/validation-utils";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const decodedToken = await verifyAuthToken(request);
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting
  const rateLimitKey = `order:${decodedToken.uid}`;
  const rateLimit = checkRateLimit(rateLimitKey, 5, 60000); // 5 requests per minute

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json();

  // Input validation
  const validation = validateOrderInput(body);
  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.errors },
      { status: 400 }
    );
  }

  // Check slot availability
  const availability = await checkSlotAvailability({
    mountainId: body.mountainId,
    type: body.type,
    slotId: body.date,
    requestedParticipants: body.participants,
  });

  if (!availability.available) {
    return NextResponse.json(
      { error: availability.reason },
      { status: 400 }
    );
  }

  // ... rest of logic ...
}
```

---

### Phase 6: Webhook Integration 🔗 (1 hour)

**Goal**: Receive server-to-server payment notifications from Razorpay

**New File: `app/api/razorpay/webhook/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook signature
    const signature = request.headers.get("x-razorpay-signature");
    const body = await request.text();

    if (!webhookSecret) {
      console.error("Webhook secret not configured");
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Webhook signature verification failed");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // 2. Parse webhook payload
    const payload = JSON.parse(body);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    console.log("Webhook event:", event);

    // 3. Handle payment.captured event
    if (event === "payment.captured") {
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      // Find order in Firestore
      const ordersSnapshot = await db
        .collection("orders")
        .where("razorpayOrderId", "==", razorpayOrderId)
        .limit(1)
        .get();

      if (ordersSnapshot.empty) {
        console.error("Order not found for webhook:", razorpayOrderId);
        return NextResponse.json({ status: "ok" }); // Don't fail webhook
      }

      const orderDoc = ordersSnapshot.docs[0];
      const order = orderDoc.data();

      // Update order with webhook verification
      await orderDoc.ref.update({
        webhookVerified: true,
        webhookReceivedAt: Timestamp.now(),
        razorpayPaymentId,
        status: "confirmed", // Ensure confirmed
        updatedAt: Timestamp.now(),
      });

      console.log("Webhook verified for order:", order.bookingId);

      // TODO: If order was not confirmed via client, create booking here
      // This handles cases where user closed browser before client callback
    }

    // 4. Handle payment.failed event
    if (event === "payment.failed") {
      const razorpayOrderId = paymentEntity.order_id;

      const ordersSnapshot = await db
        .collection("orders")
        .where("razorpayOrderId", "==", razorpayOrderId)
        .limit(1)
        .get();

      if (!ordersSnapshot.empty) {
        const orderDoc = ordersSnapshot.docs[0];
        await orderDoc.ref.update({
          status: "failed",
          failureReason: paymentEntity.error_description,
          updatedAt: Timestamp.now(),
        });

        console.log("Payment failed for order:", orderDoc.data().bookingId);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
```

**Environment Variable:**

Add to `.env.local`:
```
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

**Razorpay Dashboard Setup:**

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
3. Enable events: `payment.captured`, `payment.failed`
4. Copy the webhook secret to `.env.local`

---

### Phase 7: Environment & Configuration 📝 (15 min)

**New File: `.env.example`**

```bash
# Environment Configuration
NEXT_PUBLIC_ENVIRONMENT=development

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
FROM_EMAIL=noreply@example.com

# Production Email
SMTP_HOST_PROD=smtp.gmail.com
SMTP_PORT_PROD=587
SMTP_USER_PROD=your_email@gmail.com
SMTP_PASS_PROD=your_app_password
FROM_EMAIL_PROD=noreply@example.com

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin (Server-side)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# Razorpay Configuration (TEST keys)
RAZORPAY_KEY_SECRET=your_test_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_test_key_id
IS_RAZORPAY_LIVE=false

# Razorpay Webhook Secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Production Razorpay (uncomment and replace when going live)
# RAZORPAY_KEY_SECRET=your_live_secret_key
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_live_key_id
# IS_RAZORPAY_LIVE=true
```

**Update `.gitignore`:**

```
# Environment files
.env.local
.env.development.local
.env.test.local
.env.production.local

# Keep example file
!.env.example
```

---

### Phase 8: Firestore Security Rules 🔒 (30 min)

**File: `firestore.rules`** (to be deployed)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check authentication
    function isSignedIn() {
      return request.auth != null;
    }

    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Helper function to check admin role
    function isAdmin() {
      return isSignedIn() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // ORDERS Collection
    match /orders/{orderId} {
      // Users can create their own orders
      allow create: if isSignedIn() &&
                       request.resource.data.userId == request.auth.uid;

      // Users can read only their own orders
      allow read: if isSignedIn() &&
                     resource.data.userId == request.auth.uid;

      // Only admins can update orders (or server via Admin SDK)
      allow update: if isAdmin();

      // No one can delete orders
      allow delete: if false;
    }

    // BOOKINGS Collection
    match /bookings/{bookingId} {
      // Only server can create bookings (via Admin SDK)
      allow create: if false;

      // Users can read only their own bookings
      allow read: if isSignedIn() &&
                     (resource.data.userEmail == request.auth.token.email ||
                      isAdmin());

      // No one can update or delete bookings
      allow update, delete: if false;
    }

    // MOUNTAINS & TOURIST PACKAGES (read-only)
    match /mountains/{mountainId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /tourist-packages/{packageId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // SETTINGS (admin only)
    match /settings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // USERS Collection
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isSignedIn();
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId);
    }
  }
}
```

**Deploy:**

```bash
firebase deploy --only firestore:rules
```

---

## Summary of Security Improvements

### ✅ What We're Fixing:

1. **Critical Bugs**:
   - ✅ Fix `RAZORPAY_KEY_ID` → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - ✅ Fix inverted demo mode logic
   - ✅ Fix typo in company name

2. **Order State Management**:
   - ✅ Save orders to Firebase BEFORE payment
   - ✅ Track order status (pending → confirmed)
   - ✅ Prevent data loss if user closes browser
   - ✅ Enable audit trail

3. **Authentication**:
   - ✅ Verify Firebase JWT on all API routes
   - ✅ Store user ID with orders
   - ✅ Capture IP address and user agent

4. **Server-Side Validation**:
   - ✅ Calculate amounts on server (prevent tampering)
   - ✅ Validate slot availability
   - ✅ Verify input constraints
   - ✅ Rate limiting (prevent abuse)

5. **Idempotency**:
   - ✅ Check order status before processing
   - ✅ Prevent duplicate bookings

6. **Webhooks**:
   - ✅ Receive server-to-server notifications
   - ✅ Handle cases where client callback fails
   - ✅ Verify webhook signatures

7. **Configuration**:
   - ✅ Create `.env.example` template
   - ✅ Document all required variables

8. **Database Security**:
   - ✅ Firestore security rules
   - ✅ Restrict read/write access

---

## Testing Plan

### Test Cases:

1. **Demo Mode**:
   - [ ] Create order in demo mode
   - [ ] Verify fake payment IDs
   - [ ] Confirm booking created
   - [ ] Receive confirmation email

2. **Live Mode** (with test keys):
   - [ ] Create order with test keys
   - [ ] Complete payment on Razorpay
   - [ ] Verify signature
   - [ ] Confirm booking created
   - [ ] Check webhook received

3. **Security Tests**:
   - [ ] Try creating order without auth token (should fail 401)
   - [ ] Try manipulating amount on client (should fail 400)
   - [ ] Try booking more participants than available (should fail 400)
   - [ ] Try processing same payment twice (should return existing booking)
   - [ ] Exceed rate limit (should fail 429)

4. **Edge Cases**:
   - [ ] User closes browser after payment (webhook should handle)
   - [ ] Payment fails on Razorpay (status should update to failed)
   - [ ] Order expires after 15 minutes
   - [ ] Slot becomes full during checkout

---

## Deployment Checklist

### Before Going Live:

- [ ] Replace test Razorpay keys with live keys
- [ ] Set `IS_RAZORPAY_LIVE=true`
- [ ] Configure webhook URL in Razorpay dashboard
- [ ] Deploy Firestore security rules
- [ ] Test with real payment (small amount)
- [ ] Set up monitoring and alerts
- [ ] Review error logs
- [ ] Backup `.env.local` securely (use secret manager)

---

## Files to Modify

### Critical Files:
1. `app/api/razorpay/create-order/route.ts` ⚡
2. `app/api/razorpay/verify-payment/route.ts` ⚡
3. `app/booking/checkout/page.tsx`

### New Files:
4. `lib/auth-utils.ts` 🆕
5. `lib/pricing-utils.ts` 🆕
6. `lib/validation-utils.ts` 🆕
7. `lib/rate-limit.ts` 🆕
8. `app/api/razorpay/webhook/route.ts` 🆕
9. `.env.example` 🆕
10. `firestore.rules` 🆕

### Configuration:
11. `.env.local` (add webhook secret)
12. `.gitignore` (ensure .env.local is ignored)

---

## Estimated Time

- **Phase 1**: Fix Critical Bugs - 30 min
- **Phase 2**: Order State Management - 1 hour
- **Phase 3**: Authentication - 1 hour
- **Phase 4**: Amount Validation - 45 min
- **Phase 5**: Input Validation & Rate Limiting - 30 min
- **Phase 6**: Webhooks - 1 hour
- **Phase 7**: Environment Setup - 15 min
- **Phase 8**: Security Rules - 30 min

**Total**: ~5.5 hours

---

## Priority Order

If time is limited, implement in this order:

1. **Phase 1** (Critical) - Fix bugs that break functionality
2. **Phase 3** (High) - Add authentication to prevent abuse
3. **Phase 4** (High) - Validate amounts server-side (prevent fraud)
4. **Phase 2** (Medium) - Order state management (improve reliability)
5. **Phase 5** (Medium) - Input validation & rate limiting
6. **Phase 6** (Medium) - Webhooks (improve reliability)
7. **Phase 7** (Low) - Environment documentation
8. **Phase 8** (Medium) - Security rules

---

## Questions for User

Before implementation, please confirm:

1. Should we implement all phases, or prioritize certain ones?
2. Do you want to keep the demo mode functionality after implementing security?
3. Should we add a background job queue for PDF generation, or keep it synchronous?
4. Do you have Firebase Admin SDK properly configured for server-side operations?
5. Are you planning to go live soon, or is this for development/testing?

Let me know if you'd like any modifications to this plan!