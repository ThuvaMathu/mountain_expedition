# Razorpay Security Implementation Documentation

## Table of Contents
1. [Overview](#overview)
2. [Security Architecture](#security-architecture)
3. [Authentication & Authorization](#authentication--authorization)
4. [Payment Flow Security](#payment-flow-security)
5. [Data Validation](#data-validation)
6. [Rate Limiting & DDoS Protection](#rate-limiting--ddos-protection)
7. [Server-Side Price Verification](#server-side-price-verification)
8. [Signature Verification](#signature-verification)
9. [Webhook Security](#webhook-security)
10. [Environment Configuration](#environment-configuration)
11. [Slot Availability Protection](#slot-availability-protection)
12. [Audit Trail & Logging](#audit-trail--logging)
13. [Security Best Practices Implemented](#security-best-practices-implemented)

---

## Overview

This document details the comprehensive security measures implemented in the Razorpay payment integration for the Mountain Expedition booking system. The implementation follows industry best practices and includes multiple layers of security to prevent fraud, data manipulation, and abuse.

**Integration Type**: Server-side integration with client-side checkout UI
**Payment Gateway**: Razorpay
**Backend**: Next.js API Routes + Firebase Firestore
**Authentication**: Firebase Authentication with JWT tokens

---

## Security Architecture

### Multi-Layer Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                          │
│  - Firebase Auth Token                                       │
│  - HTTPS Only                                                │
│  - Razorpay SDK (loaded from official CDN)                  │
└───────────────────┬─────────────────────────────────────────┘
                    │ (Encrypted HTTPS)
┌───────────────────▼─────────────────────────────────────────┐
│              API Route: /api/razorpay/create-order          │
│  ✓ IP Rate Limiting (20 req/min)                           │
│  ✓ User Rate Limiting (5 req/5min)                         │
│  ✓ Firebase Auth Verification                               │
│  ✓ Input Validation                                         │
│  ✓ Server-Side Price Calculation                           │
│  ✓ Slot Availability Validation                            │
│  ✓ Request Metadata Capture (IP, User-Agent)               │
└───────────────────┬─────────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────┐
│                  Firestore Database                          │
│  - Order saved BEFORE payment (pending status)              │
│  - Contains trusted server-calculated data                  │
│  - Includes audit metadata                                  │
└───────────────────┬─────────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────┐
│                   Razorpay Gateway                           │
│  - Order created with verified amount                       │
│  - Customer completes payment                               │
└───────────────────┬─────────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────┐
│         API Route: /api/razorpay/verify-payment             │
│  ✓ Signature Verification (HMAC SHA256)                     │
│  ✓ Order ID Cross-Reference with Firestore                 │
│  ✓ Use Firestore data (not client data)                    │
│  ✓ Atomic Slot Capacity Update (Firestore Transaction)     │
│  ✓ Prevent Double-Booking                                  │
└───────────────────┬─────────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────┐
│          Webhook: /api/razorpay/webhook                     │
│  ✓ Webhook Signature Verification                          │
│  ✓ Idempotency Check (prevent duplicate processing)        │
│  ✓ Server-to-Server notification handling                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentication & Authorization

### 1. Firebase Authentication Integration

**Implementation**: [`lib/auth-utils.ts`](lib/auth-utils.ts)

#### Token Extraction and Verification

```typescript
// Extract Firebase ID token from Authorization header
function extractAuthToken(request: NextRequest): string | null
```

**Security Features**:
- Requires `Bearer` token format
- Validates token format before processing
- Returns `null` for invalid/missing tokens

#### Server-Side Token Verification

```typescript
async function verifyAuthToken(token: string): Promise<DecodedIdToken | null>
```

**Security Features**:
- Uses Firebase Admin SDK for verification
- Validates token signature and expiration
- Returns decoded token with user ID (UID)
- Fails securely with `null` on errors

#### User Authentication in Order Creation

**Location**: [`app/api/razorpay/create-order/route.ts:46-52`](app/api/razorpay/create-order/route.ts#L46-L52)

```typescript
// STEP 2: Verify authentication
const userId = await getUserIdFromRequest(request);
if (!userId) {
  return NextResponse.json(
    { error: "Unauthorized. Please log in." },
    { status: 401 }
  );
}
```

**Protection Against**:
- ✅ Unauthenticated payment attempts
- ✅ Anonymous order creation
- ✅ Session hijacking (tokens expire)
- ✅ Token tampering (cryptographic verification)

---

## Payment Flow Security

### 1. Order Creation Flow

**Endpoint**: `POST /api/razorpay/create-order`
**File**: [`app/api/razorpay/create-order/route.ts`](app/api/razorpay/create-order/route.ts)

#### Step-by-Step Security Checks

**Step 1: IP-Based Rate Limiting** (Lines 31-43)
```typescript
const clientIp = getClientIp(request);
const ipRateLimit = checkIpRateLimit(clientIp);
if (!ipRateLimit.allowed) {
  return NextResponse.json({
    error: "Too many requests. Please try again later.",
    retryAfter: Math.ceil((ipRateLimit.resetTime - Date.now()) / 1000)
  }, { status: 429 });
}
```

**Step 2: User Authentication** (Lines 45-53)
```typescript
const userId = await getUserIdFromRequest(request);
if (!userId) {
  return NextResponse.json(
    { error: "Unauthorized. Please log in." },
    { status: 401 }
  );
}
```

**Step 3: User-Based Rate Limiting** (Lines 55-69)
```typescript
const userRateLimit = checkOrderCreationRateLimit(userId);
if (!userRateLimit.allowed) {
  return NextResponse.json({
    error: "You're creating orders too quickly. Please wait a moment.",
    retryAfter: Math.ceil((userRateLimit.resetTime - Date.now()) / 1000)
  }, { status: 429 });
}
```

**Step 4: Input Validation** (Lines 71-82)
```typescript
const inputValidation = validateOrderRequest(body);
if (!inputValidation.isValid) {
  return NextResponse.json(
    { error: inputValidation.error },
    { status: 400 }
  );
}
```

**Step 5: Server-Side Price Verification** (Lines 115-137)
```typescript
const validation = await validatePaymentAmount({
  mountainId,
  type: type || "trekking",
  slotId: date,
  participants,
  currency,
  clientAmount: amount,
});

if (!validation.isValid) {
  return NextResponse.json({
    error: validation.error || "Invalid payment amount",
    expectedAmount: validation.expectedAmount,
  }, { status: 400 });
}
```

**Step 6: Slot Availability Validation** (Lines 139-166)
```typescript
const validation = await validateSlotAvailability({
  productId: mountainId,
  productType: type || "trekking",
  slotId: slotDetails?.id,
  date: slotDetails?.originalDate || slotDetails?.date || date,
  participants
});

if (!validation.available) {
  return NextResponse.json({
    error: "SLOT_UNAVAILABLE",
    message: validation.message || "This slot is no longer available",
    availableSpots: validation.availableSpots
  }, { status: 400 });
}
```

**Step 7: Save Order to Firestore** (Lines 175-199)
```typescript
const orderData = {
  bookingId,
  userId, // Store authenticated user ID
  booking: { id: mountainId, type: type || "trekking" },
  userEmail,
  mountainName,
  slotDetails: slotDetails || { date },
  participants,
  customerInfo: cusInfo,
  amount,
  currency: currency.toUpperCase(),
  status: "pending",
  paymentMethod: "razorpay",
  razorpayOrderId: "",
  razorpayPaymentId: "",
  metadata, // Store IP, user agent, timestamp
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};

const orderDocRef = await addDoc(collection(db, "orders"), orderData);
```

**Step 8: Create Razorpay Order** (Lines 201-216)
```typescript
const order = await razorpay.orders.create({
  amount: amountInSmallestUnit,
  currency: currency.toUpperCase(),
  receipt: bookingId,
  notes: {
    orderId: orderDocRef.id,
    mountainId,
    mountainName,
    date,
    participants: participants.toString(),
    name: cusInfo.organizer.name,
    email: cusInfo.organizer.email,
    phone: cusInfo.organizer.phone,
  },
});
```

### 2. Payment Verification Flow

**Endpoint**: `POST /api/razorpay/verify-payment`
**File**: [`app/api/razorpay/verify-payment/route.ts`](app/api/razorpay/verify-payment/route.ts)

#### Critical Security Steps

**Step 1: Signature Verification** (Lines 43-55)
```typescript
const body_string = razorpay_order_id + "|" + razorpay_payment_id;
const expected_signature = crypto
  .createHmac("sha256", razorpayKeySecret)
  .update(body_string.toString())
  .digest("hex");

if (expected_signature !== razorpay_signature) {
  return NextResponse.json(
    { error: "Payment verification failed" },
    { status: 400 }
  );
}
```

**Step 2: Fetch Trusted Order Data** (Lines 59-73)
```typescript
// Fetch order from Firestore to get the trusted data
// This prevents client-side data manipulation
const orderDocRef = doc(db, "orders", firestoreOrderId);
const orderDoc = await getDoc(orderDocRef);

if (!orderDoc.exists()) {
  return NextResponse.json(
    { error: "Order not found" },
    { status: 404 }
  );
}

const orderData = orderDoc.data();
```

**Step 3: Cross-Verify Razorpay Order ID** (Lines 75-82)
```typescript
// Verify that the Razorpay order ID matches
if (orderData.razorpayOrderId !== razorpay_order_id) {
  console.error("❌ Razorpay order ID mismatch");
  return NextResponse.json(
    { error: "Order verification failed" },
    { status: 400 }
  );
}
```

**Step 4: Use Server Data (NOT Client Data)** (Lines 132-152)
```typescript
// Create booking object using data from Firestore order (trusted source)
const booking: TBooking = {
  id: "",
  bookingId,
  booking: orderData.booking,
  userEmail: orderData.userEmail,
  mountainName: orderData.mountainName,
  slotDetails: orderData.slotDetails,
  participants: orderData.participants,
  customerInfo: orderData.customerInfo,
  amount: orderData.amount, // Use trusted amount from Firestore
  baseAmount: breakdown.baseAmount,
  serviceFee: breakdown.serviceFee,
  currency: orderData.currency,
  status: "confirmed",
  paymentMethod: "razorpay",
  razorpayOrderId: razorpay_order_id,
  razorpayPaymentId: razorpay_payment_id,
  // ... other fields
};
```

---

## Data Validation

### Input Validation Framework

**Implementation**: [`lib/validation-utils.ts`](lib/validation-utils.ts)

#### 1. Email Validation
```typescript
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

#### 2. Phone Number Validation
```typescript
function isValidPhone(phone: string): boolean {
  return isValidPhoneNumber(phone); // Uses libphonenumber-js
}
```
**Security**: Uses international phone validation library for accuracy

#### 3. Currency Validation
```typescript
function isValidCurrency(currency: string): boolean {
  const validCurrencies = ["USD", "INR"];
  return validCurrencies.includes(currency.toUpperCase());
}
```
**Protection**: Prevents injection of unsupported currencies

#### 4. Number Validation
```typescript
function isPositiveNumber(value: unknown): boolean {
  return typeof value === "number" && value > 0 && !isNaN(value);
}

function isPositiveInteger(value: unknown): boolean {
  return typeof value === "number" &&
         Number.isInteger(value) &&
         value > 0 &&
         value < Number.MAX_SAFE_INTEGER;
}
```

#### 5. Participant Information Validation
```typescript
function validateParticipantInfo(participantsInfo: unknown): {
  isValid: boolean;
  error?: string;
}
```

**Validates**:
- ✅ Organizer name (non-empty string)
- ✅ Organizer email (valid format)
- ✅ Organizer phone (international format)
- ✅ Member names (if provided)
- ✅ Member emails (if provided, valid format)
- ✅ Member phones (if provided, valid format)

#### 6. Complete Order Request Validation
```typescript
function validateOrderRequest(body: unknown): {
  isValid: boolean;
  error?: string;
}
```

**Validates**:
- ✅ Amount is positive number
- ✅ Currency is valid (USD/INR)
- ✅ Mountain ID exists
- ✅ Mountain name exists
- ✅ Date is provided
- ✅ Participants is positive integer
- ✅ Participants ≤ 50 (reasonable limit)
- ✅ Amount ≤ 10,000,000 (max limit)
- ✅ Participant info is complete and valid
- ✅ User email is valid

---

## Rate Limiting & DDoS Protection

### Rate Limiting Implementation

**File**: [`lib/rate-limit.ts`](lib/rate-limit.ts)

#### 1. Core Rate Limiting Function

```typescript
function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}
```

**Features**:
- In-memory store with automatic cleanup
- Returns remaining requests and reset time
- Sliding window approach

#### 2. IP-Based Rate Limiting

```typescript
function checkIpRateLimit(ipAddress: string) {
  return checkRateLimit(`ip:${ipAddress}`, 20, 60 * 1000);
}
```

**Limits**: 20 requests per minute per IP address

**Protection Against**:
- ✅ DDoS attacks
- ✅ Automated bot attacks
- ✅ Scraping attempts

#### 3. User-Based Order Creation Rate Limiting

```typescript
function checkOrderCreationRateLimit(userId: string) {
  return checkRateLimit(`order:${userId}`, 5, 5 * 60 * 1000);
}
```

**Limits**: 5 order creation requests per 5 minutes per user

**Protection Against**:
- ✅ Rapid-fire order creation abuse
- ✅ Payment testing attacks
- ✅ Resource exhaustion

#### 4. Payment Verification Rate Limiting

```typescript
function checkPaymentVerificationRateLimit(orderId: string) {
  return checkRateLimit(`verify:${orderId}`, 3, 60 * 1000);
}
```

**Limits**: 3 verification attempts per minute per order

**Protection Against**:
- ✅ Payment verification replay attacks
- ✅ Brute force signature attempts

#### 5. Automatic Cleanup

```typescript
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000); // Cleanup every 10 minutes
```

**Benefits**:
- Prevents memory leaks
- Removes expired entries automatically

### IP Address Extraction

**File**: [`lib/auth-utils.ts:56-76`](lib/auth-utils.ts#L56-L76)

```typescript
function getClientIp(request: NextRequest): string {
  // Check various headers that might contain the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) return realIp;
  if (cfConnectingIp) return cfConnectingIp;

  return "unknown";
}
```

**Supports**:
- ✅ Direct connections
- ✅ Proxy servers (x-forwarded-for)
- ✅ Load balancers (x-real-ip)
- ✅ Cloudflare (cf-connecting-ip)

---

## Server-Side Price Verification

### Price Calculation Security

**File**: [`lib/pricing-utils.ts`](lib/pricing-utils.ts)

#### Critical Security Principle

**"Never Trust Client Data"** - All prices are calculated server-side from database sources.

#### 1. Fetch Mountain Details from Database

```typescript
async function getMountainDetails(
  mountainId: string,
  type: string
): Promise<TMountainType | null> {
  const dbName = type === "trekking" ? "mountains" : "tourist-packages";
  const q = query(collection(db, dbName), where("id", "==", mountainId));
  const snap = await getDocs(q);

  return snap.empty ? null : snap.docs[0].data();
}
```

#### 2. Get Slot Details with Availability Check

```typescript
function getSlotDetails(
  mountain: TMountainType,
  slotId: string
): TSlotDetails | null
```

**Verifies**:
- ✅ Slot exists
- ✅ Slot is part of valid mountain/package
- ✅ Returns slot pricing multiplier

#### 3. Calculate Expected Amount

```typescript
async function calculateExpectedAmount(params: {
  mountainId: string;
  type: string;
  slotId: string;
  participants: number;
  currency: string;
}): Promise<{
  isValid: boolean;
  expectedAmount: number;
  breakdown: { basePrice: number; total: number };
  error?: string;
}>
```

**Calculation Steps**:

1. Fetch mountain/package from database
2. Verify slot exists and has availability
3. Get base price for currency (priceUSD or priceINR)
4. Apply slot price multiplier
5. Calculate total: `unitPrice × participants`
6. Return expected amount

**Protection Against**:
- ✅ Client-side price manipulation
- ✅ Currency mismatch attacks
- ✅ Invalid slot pricing
- ✅ Overbooking attempts

#### 4. Validate Client Amount vs Server Calculation

```typescript
async function validatePaymentAmount(params: {
  mountainId: string;
  type: string;
  slotId: string;
  participants: number;
  currency: string;
  clientAmount: number;
}): Promise<{ isValid: boolean; error?: string; expectedAmount?: number }>
```

**Validation Logic**:

```typescript
const calculation = await calculateExpectedAmount(params);

// Allow small rounding differences (up to 0.01)
const difference = Math.abs(calculation.expectedAmount - params.clientAmount);

if (difference > 0.01) {
  return {
    isValid: false,
    error: `Amount mismatch. Expected ${calculation.expectedAmount}, got ${params.clientAmount}`,
    expectedAmount: calculation.expectedAmount,
  };
}
```

**Security Level**: ⭐⭐⭐⭐⭐ (Critical)

**Used In**: Order creation (Lines 115-137 of `create-order/route.ts`)

---

## Signature Verification

### HMAC SHA256 Signature Verification

#### 1. Payment Verification Signature

**Location**: [`app/api/razorpay/verify-payment/route.ts:43-55`](app/api/razorpay/verify-payment/route.ts#L43-L55)

```typescript
const body_string = razorpay_order_id + "|" + razorpay_payment_id;
const expected_signature = crypto
  .createHmac("sha256", razorpayKeySecret)
  .update(body_string.toString())
  .digest("hex");

if (expected_signature !== razorpay_signature) {
  return NextResponse.json(
    { error: "Payment verification failed" },
    { status: 400 }
  );
}
```

**Algorithm**: HMAC-SHA256
**Secret Key**: `RAZORPAY_KEY_SECRET` (environment variable)
**Data**: `razorpay_order_id|razorpay_payment_id`

**Protection Against**:
- ✅ Man-in-the-middle attacks
- ✅ Payment data tampering
- ✅ Replay attacks with modified data
- ✅ Fake payment confirmations

#### 2. Webhook Signature Verification

**Location**: [`app/api/razorpay/webhook/route.ts:44-67`](app/api/razorpay/webhook/route.ts#L44-L67)

```typescript
// Get the raw body for signature verification
const body = await request.text();
const signature = request.headers.get("x-razorpay-signature");

if (!signature) {
  return NextResponse.json(
    { error: "Missing signature" },
    { status: 400 }
  );
}

// Verify webhook signature
const expectedSignature = crypto
  .createHmac("sha256", razorpayWebhookSecret)
  .update(body)
  .digest("hex");

if (expectedSignature !== signature) {
  return NextResponse.json(
    { error: "Invalid signature" },
    { status: 400 }
  );
}
```

**Algorithm**: HMAC-SHA256
**Secret Key**: `RAZORPAY_WEBHOOK_SECRET` (environment variable)
**Data**: Raw webhook request body

**Protection Against**:
- ✅ Unauthorized webhook calls
- ✅ Webhook payload tampering
- ✅ Malicious third-party notifications
- ✅ Spoofed payment confirmations

**Security Level**: ⭐⭐⭐⭐⭐ (Critical)

---

## Webhook Security

### Webhook Implementation

**Endpoint**: `POST /api/razorpay/webhook`
**File**: [`app/api/razorpay/webhook/route.ts`](app/api/razorpay/webhook/route.ts)

#### Security Features

**1. Signature Verification** (Lines 44-67)
- Verifies webhook authenticity using HMAC SHA256
- Rejects requests with missing or invalid signatures

**2. Event Type Handling** (Lines 80-96)
```typescript
switch (event) {
  case "payment.captured":
    await handlePaymentCaptured(paymentEntity);
    break;

  case "payment.failed":
    await handlePaymentFailed(paymentEntity);
    break;

  case "order.paid":
    console.log("✅ Order fully paid:", orderEntity?.id);
    break;

  default:
    console.log("ℹ️ Unhandled webhook event:", event);
}
```

**3. Idempotency Protection** (Lines 139-150)
```typescript
// Check if booking already exists (idempotency)
const bookingsRef = collection(db!, "bookings");
const bookingQuery = query(
  bookingsRef,
  where("razorpayOrderId", "==", razorpayOrderId)
);
const bookingSnapshot = await getDocs(bookingQuery);

if (!bookingSnapshot.empty) {
  console.log("ℹ️ Booking already exists for this payment");
  return; // Prevent duplicate booking creation
}
```

**Protection Against**:
- ✅ Duplicate webhook processing
- ✅ Double-booking
- ✅ Multiple charge confirmations

**4. Error Handling** (Lines 99-105)
```typescript
catch (error) {
  console.error("❌ Webhook processing error:", error);
  return NextResponse.json(
    { error: "Webhook processing failed" },
    { status: 500 }
  );
}
```

**Benefits**:
- Fails safely without exposing internal errors
- Logs errors for debugging
- Returns generic error messages

#### Payment Captured Handler

**Function**: `handlePaymentCaptured(paymentEntity)`
**Lines**: 112-243

**Security Steps**:
1. Extract payment and order IDs
2. Find order in Firestore by Razorpay order ID
3. Check for existing booking (idempotency)
4. Create booking using server data (not webhook data)
5. Update order status
6. Send confirmation email

#### Payment Failed Handler

**Function**: `handlePaymentFailed(paymentEntity)`
**Lines**: 250-288

**Actions**:
1. Extract order ID and error details
2. Find order in Firestore
3. Update order status to "failed"
4. Store failure reason for debugging

---

## Environment Configuration

### Environment Variables

**File**: [`.env.example`](.env.example)

#### 1. Razorpay API Keys

```bash
# Public key (exposed to client)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_test_key_id

# Secret key (server-side only, NEVER expose to client)
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Environment mode
IS_RAZORPAY_LIVE=false  # false for test mode, true for production
```

**Security Measures**:
- ✅ Secret key never sent to client
- ✅ Separate test and live keys
- ✅ Keys stored in environment variables (not code)
- ✅ `.env.local` in `.gitignore`

#### 2. Webhook Secret

```bash
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**Setup Instructions**:
1. Create webhook in Razorpay Dashboard → Settings → Webhooks
2. URL: `https://yourdomain.com/api/razorpay/webhook`
3. Events: `payment.captured`, `payment.failed`, `order.paid`
4. Copy the generated secret to environment variables

#### 3. Firebase Configuration

```bash
# Client-side config (public)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Server-side admin SDK (CRITICAL - NEVER expose to client)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
```

**Security**:
- ✅ Service account key is server-side only
- ✅ Admin SDK uses separate credentials from client SDK
- ✅ Private key never exposed to browser

---

## Slot Availability Protection

### Atomic Slot Updates

**File**: [`lib/slot-validation.ts`](lib/slot-validation.ts)

#### 1. Pre-Payment Validation

**Function**: `validateSlotAvailability(params)`

```typescript
export async function validateSlotAvailability(
  params: SlotValidationParams
): Promise<SlotValidationResult>
```

**Performed BEFORE payment** (in `create-order/route.ts:139-166`)

**Checks**:
- ✅ Slot exists
- ✅ Date is valid
- ✅ Sufficient capacity available
- ✅ Real-time availability check

**Example**:
```typescript
const availableSpots = slot.maxParticipants - slot.bookedParticipants;

if (availableSpots < participants) {
  return {
    available: false,
    availableSpots,
    message: `Only ${availableSpots} spot(s) remaining. You requested ${participants}.`,
  };
}
```

#### 2. Post-Payment Atomic Update

**Location**: [`app/api/razorpay/verify-payment/route.ts:194-294`](app/api/razorpay/verify-payment/route.ts#L194-L294)

**Uses Firestore Transaction** (atomic operation):

```typescript
await adminDb.runTransaction(async (transaction) => {
  const doc = await transaction.get(docRef);

  // Get current slot data
  const slot = availableDates[dateIndex].slots[slotIndex];
  const newBookedCount = slot.bookedParticipants + orderData.participants;

  // Double-check capacity (safety check)
  if (newBookedCount > slot.maxParticipants) {
    throw new Error("Overbooking prevented - slot is now full");
  }

  // Update the bookedParticipants atomically
  availableDates[dateIndex].slots[slotIndex].bookedParticipants = newBookedCount;

  // Update the document
  transaction.update(docRef, {
    availableDates,
    lastUpdated: new Date().toISOString()
  });
});
```

**Protection Against**:
- ✅ Double-booking (race conditions)
- ✅ Overbooking beyond capacity
- ✅ Concurrent payment processing
- ✅ Data inconsistency

**Failure Handling** (Lines 268-294):
```typescript
catch (slotError: any) {
  // Log error but don't fail the payment
  console.error("❌ [SLOT REDUCTION] Failed to update slot:", {
    error: slotError.message,
    bookingId: bookingId,
    productId: orderData.booking.id,
    slotId: orderData.slotDetails?.id
  });

  // Log to a failure collection for manual review
  await adminDb.collection("slot-update-failures").add({
    bookingId, productId, slotId, participants,
    error: slotError.message,
    timestamp: new Date().toISOString()
  });
}
```

**Safety Measures**:
- ✅ Payment is already confirmed (money received)
- ✅ Booking is already created
- ✅ Failure is logged for manual intervention
- ✅ Admin can review and fix slot count manually

---

## Audit Trail & Logging

### Request Metadata Capture

**File**: [`lib/auth-utils.ts:89-95`](lib/auth-utils.ts#L89-L95)

```typescript
function createRequestMetadata(request: NextRequest) {
  return {
    ipAddress: getClientIp(request),
    userAgent: getUserAgent(request),
    timestamp: new Date().toISOString(),
  };
}
```

**Stored in Firestore** (Lines 172-195 of `create-order/route.ts`):

```typescript
const orderData = {
  bookingId,
  userId,
  // ... booking details ...
  metadata: {
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 ...",
    timestamp: "2025-01-15T10:30:00.000Z"
  },
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};
```

**Audit Benefits**:
- ✅ Fraud detection (multiple orders from same IP)
- ✅ Suspicious activity tracking
- ✅ Geographic analysis
- ✅ Device fingerprinting
- ✅ Legal compliance (transaction records)

### Comprehensive Logging

#### Order Creation Logs

```typescript
console.log("✅ User authenticated:", userId);
console.log(`✅ Rate limit check passed (${userRateLimit.remaining} remaining)`);
console.log("✅ Input validation passed");
console.log("✅ Amount validated:", amount);
console.log("✅ [CREATE ORDER] Slot validated, proceeding with order creation");
console.log("💾 Saving order to Firestore before payment...");
console.log("✅ Order saved with ID:", orderDocRef.id);
console.log("✅ Order updated with Razorpay order ID:", order.id);
```

#### Payment Verification Logs

```typescript
console.log("💳 Processing Razorpay payment verification");
console.log("📋 Firestore Order ID:", firestoreOrderId);
console.log("✅ Razorpay signature verified");
console.log("✅ Order fetched from Firestore");
console.log("✅ [SLOT REDUCTION] Slot updated successfully:", details);
console.log("✅ Order status updated to confirmed");
```

#### Error Logs

```typescript
console.error("❌ Input validation failed:", inputValidation.error);
console.error("❌ Amount validation failed:", validation.error);
console.error("❌ [CREATE ORDER] Slot validation failed:", validation.message);
console.error("❌ [SLOT REDUCTION] Failed to update slot:", slotError.message);
```

**Log Categories**:
- ✅ Authentication events
- ✅ Rate limiting violations
- ✅ Validation failures
- ✅ Payment verification
- ✅ Database operations
- ✅ Error conditions

---

## Security Best Practices Implemented

### ✅ 1. Defense in Depth (Multiple Security Layers)

| Layer | Protection |
|-------|------------|
| Network | HTTPS only, rate limiting |
| Authentication | Firebase Auth with JWT tokens |
| Authorization | User ID verification on every request |
| Input Validation | Comprehensive validation of all inputs |
| Business Logic | Server-side price calculation, slot validation |
| Data Integrity | Signature verification, atomic transactions |
| Audit | Request metadata, comprehensive logging |

### ✅ 2. Principle of Least Privilege

- Client only receives public Razorpay key
- Secret keys never exposed to browser
- Admin SDK credentials server-side only
- Firebase security rules restrict data access

### ✅ 3. Never Trust Client Data

- **Prices**: Calculated server-side from database
- **Availability**: Verified server-side before payment
- **User Info**: Verified via Firebase Auth token
- **Booking Details**: Stored in Firestore before payment, used as source of truth

### ✅ 4. Secure by Default

- Environment variables for sensitive data
- `.env.local` in `.gitignore`
- Separate test and production configurations
- Explicit error messages (no stack traces to client)

### ✅ 5. Idempotency

- Webhook processing checks for duplicate bookings
- Payment verification uses order IDs to prevent double processing
- Atomic transactions prevent race conditions

### ✅ 6. Fail-Safe Design

- Payment failures logged but don't crash system
- Slot update failures logged for manual review
- Email failures don't block booking confirmation
- Generic error messages to client, detailed logs server-side

### ✅ 7. Data Integrity

- HMAC SHA256 signature verification
- Firestore transactions for atomic updates
- Server-calculated amounts compared with client amounts
- Order ID cross-referencing between systems

### ✅ 8. Monitoring & Observability

- Comprehensive console logging
- Error tracking with context
- Slot update failure collection
- Metadata capture for audit trail

### ✅ 9. Rate Limiting (Anti-DDoS)

| Limit Type | Rate | Purpose |
|------------|------|---------|
| IP-based | 20 req/min | Prevent DDoS |
| User-based | 5 orders/5min | Prevent abuse |
| Verification | 3 attempts/min | Prevent replay attacks |

### ✅ 10. Separation of Concerns

- Authentication logic in `auth-utils.ts`
- Validation logic in `validation-utils.ts`
- Rate limiting in `rate-limit.ts`
- Pricing logic in `pricing-utils.ts`
- Slot validation in `slot-validation.ts`

---

## Security Testing Checklist

### Payment Flow Testing

- [ ] Order creation requires authentication
- [ ] Order creation respects rate limits
- [ ] Invalid amounts are rejected
- [ ] Slot availability is validated
- [ ] Payment signature verification works
- [ ] Invalid signatures are rejected
- [ ] Server data is used (not client data)
- [ ] Slot capacity is updated atomically
- [ ] Duplicate webhooks don't create duplicate bookings

### Attack Vector Testing

- [ ] Unauthenticated requests are rejected (401)
- [ ] Rate limit violations return 429
- [ ] Price manipulation is detected and rejected
- [ ] Invalid currency is rejected
- [ ] Oversized participant count is rejected (max 50)
- [ ] Excessive amount is rejected (max 10M)
- [ ] Invalid email/phone formats are rejected
- [ ] Tampered signatures fail verification
- [ ] Spoofed webhook calls are rejected
- [ ] Concurrent bookings don't cause double-booking

### Configuration Testing

- [ ] Secret keys are in environment variables
- [ ] `.env.local` is in `.gitignore`
- [ ] Test and production keys are separate
- [ ] Webhook secret is configured correctly
- [ ] Firebase Admin SDK credentials are secure

---

## Compliance & Standards

### PCI DSS Compliance

**Status**: ✅ Compliant (Payment Gateway Model)

**Rationale**:
- No credit card data handled directly
- Razorpay handles all card data (PCI DSS Level 1 certified)
- Only order IDs and payment confirmations stored
- No CVV, card numbers, or expiry dates in our system

### GDPR Compliance Considerations

**Data Collection**:
- User email (consent required)
- User name (consent required)
- IP address (logged for fraud prevention)
- User agent (logged for fraud prevention)

**Data Retention**:
- Order records retained indefinitely for financial/legal compliance
- Metadata retained for fraud analysis
- No unnecessary personal data collected

**User Rights**:
- Right to access (provide order history)
- Right to deletion (implement data deletion for cancelled bookings)
- Right to rectification (allow profile updates)

### OWASP Top 10 Protection

| Vulnerability | Protection Implemented |
|---------------|------------------------|
| **A01: Broken Access Control** | Firebase Auth, user ID verification |
| **A02: Cryptographic Failures** | HTTPS, HMAC SHA256 signatures, environment variables |
| **A03: Injection** | Input validation, parameterized queries (Firestore) |
| **A04: Insecure Design** | Multi-layer security, fail-safe defaults |
| **A05: Security Misconfiguration** | Environment-based config, no default credentials |
| **A06: Vulnerable Components** | Regular dependency updates, security audits |
| **A07: Authentication Failures** | Firebase Auth, rate limiting, session management |
| **A08: Data Integrity Failures** | Signature verification, atomic transactions |
| **A09: Logging Failures** | Comprehensive logging, error tracking |
| **A10: SSRF** | No user-controlled URLs, strict input validation |

---

## Production Deployment Checklist

### Pre-Production

- [ ] Replace test Razorpay keys with live keys
- [ ] Set `IS_RAZORPAY_LIVE=true`
- [ ] Configure production webhook URL in Razorpay Dashboard
- [ ] Verify webhook secret is configured
- [ ] Ensure Firebase production credentials are set
- [ ] Test all payment flows in staging environment
- [ ] Verify rate limiting thresholds are appropriate
- [ ] Review all console.log statements (consider log levels)
- [ ] Set up error monitoring (e.g., Sentry)

### Post-Production

- [ ] Monitor webhook deliveries in Razorpay Dashboard
- [ ] Check for failed slot updates in `slot-update-failures` collection
- [ ] Verify payment confirmations are sent
- [ ] Monitor rate limiting logs for abuse
- [ ] Review audit logs for suspicious activity
- [ ] Test backup payment verification via webhook
- [ ] Verify PDF generation and storage
- [ ] Check email delivery success rate

---

## Future Security Enhancements

### Recommended Improvements

1. **Redis-Based Rate Limiting**
   - Current: In-memory (resets on server restart)
   - Recommended: Redis for distributed rate limiting
   - Benefit: Works across multiple server instances

2. **Advanced Fraud Detection**
   - Implement velocity checks (e.g., 3+ failed payments in 1 hour)
   - Geographic anomaly detection (e.g., bookings from different countries in short time)
   - Device fingerprinting for repeat offenders

3. **Enhanced Monitoring**
   - Set up alerts for rate limit violations
   - Monitor for unusual payment patterns
   - Track slot update failure rates
   - Dashboard for security metrics

4. **Additional Authentication**
   - Implement email verification requirement
   - Add phone number verification for high-value bookings
   - Consider 2FA for admin operations

5. **Data Encryption**
   - Encrypt sensitive customer data at rest (Firestore encryption is default)
   - Implement field-level encryption for PII

6. **Compliance**
   - Implement GDPR data export functionality
   - Add data deletion workflow
   - Create privacy policy and terms of service
   - Implement cookie consent banner

---

## Contact & Support

For security concerns or to report vulnerabilities:

**Email**: [Your Security Email]
**Responsible Disclosure**: Please allow 90 days for fixes before public disclosure

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-15 | Initial security documentation |

---

## License

This security documentation is proprietary and confidential.

**© 2025 Mountain Expedition. All Rights Reserved.**
