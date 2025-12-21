# Tamil Adventures - Negative Test Cases & AI Resolution Prompts

## USER-FACING APPLICATION

### Navigation & UI Issues

**1. Swipe Dots Navigation (Home Page)**
- **Issue:** Dots have no click function, only swipe works
- **AI Prompt:** "Add click functionality to the carousel navigation dots on the home page hero section. Each dot should navigate to its corresponding slide when clicked. Ensure proper active state styling for the current slide indicator."

**2. Scroll Down Overlay Issue**
- **Issue:** Scroll down button overlaps with swipe dots, shows pointer on hover but no click function
- **AI Prompt:** "Fix the z-index layering issue where the scroll down button overlaps with carousel navigation dots. Add proper click functionality to the scroll down button to smoothly scroll to the next section. Ensure hover states work correctly without visual conflicts."

### Currency & Pricing Issues

**3. Mountain Cards - INR Symbol Display**
- **Issue:** Shows $ symbol instead of ₹ when currency is set to INR
- **AI Prompt:** "Update the currency display logic in MountainCard component to show ₹ symbol for INR and $ for USD. Check the currency-selector utility and ensure proper symbol mapping is applied across all price displays."

**4. Mountain Cards - Rating Display**
- **Issue:** Rating given but displays "0 reviews"
- **AI Prompt:** "Fix the review count display on mountain cards. Ensure the reviews array length is correctly calculated and displayed. If there are reviews in Firebase, verify the data fetching logic and update the UI to show accurate review counts."

**5. Mountains - Unavailable Treks Shown**
- **Issue:** All treks display View Details button even when unavailable
- **AI Prompt:** "Add availability status field to mountain data schema. Update MountainCard component to check availability status and either disable the 'View Details' button or show 'Currently Unavailable' badge for unavailable treks."

**6. About Page - Gallery Redirect Issue**
- **Issue:** After clicking other buttons (Support, View Summit Timeline), View Gallery button doesn't allow return to About page
- **AI Prompt:** "Fix navigation state management in About page. When View All Images button is clicked after other interactions, ensure proper routing that allows users to navigate back to the About page using browser back button or navigation."

**7. Mountains - Price Range Filter (INR)**
- **Issue:** Range not found for INR, filter doesn't work properly
- **AI Prompt:** "Add INR price ranges to the price filter component in Mountains page. Update the filter logic to handle currency conversion and apply proper min/max filtering based on selected currency. Test with both USD and INR values."

**8. Mountains - Season Filter Non-functional**
- **Issue:** Season filter doesn't affect search results
- **AI Prompt:** "Implement proper filtering logic for season filter in Mountains page. Add season field to mountain data model if missing. Update the filter handler to correctly filter mountains based on selected seasons (Winter, Spring, Summer, Monsoon, Autumn)."

**9. Mountains - Currency Symbol on Details Page**
- **Issue:** Shows $ instead of ₹ for INR in navbar currency selector
- **AI Prompt:** "Fix currency symbol display in mountain details page. Use the currency-store utility to get current currency and apply correct symbol (₹ for INR, $ for USD) consistently across all price elements."

**10. Ooty Mountain - Incorrect Details**
- **Issue:** Mount Everest details shown instead of Ooty Mountain details
- **AI Prompt:** "Update the mountain details data for Ooty. Verify the Firebase document ID matches correctly in the mountain details page query. Replace Mount Everest content with accurate Ooty mountain information including elevation, difficulty, duration, and itinerary."

**11. Mountains - Download Brochure (No Functionality)**
- **Issue:** Download brochure button has no functionality
- **AI Prompt:** "Implement PDF brochure download functionality. Create a brochure template with mountain details, itinerary, pricing, and terms. Use the existing PDF generation utility or add a pre-generated brochure file to Firebase Storage. Trigger download on button click."

**12. Mountains - Contact Expert (No Functionality)**
- **Issue:** Contact expert button has no functionality
- **AI Prompt:** "Add functionality to Contact Expert button. Either open a modal with contact form pre-filled with mountain name, or navigate to contact page with mountain context. Use existing contact form component and pass mountain details as query parameters."

### Tourist Packages Issues

**13. All Packages - Currency Symbol Display**
- **Issue:** Currency value changed but displays $ instead of ₹
- **AI Prompt:** "Fix currency symbol in tourist packages listing page. Update the TouristPackageManagement component to use currency-selector utility and display correct symbol based on selected currency. Apply fix to all price display elements."

**14. All Packages - Contact Our Experts (No Functionality)**
- **Issue:** Contact Our Experts button has no functionality
- **AI Prompt:** "Implement Contact Our Experts functionality in tourist packages. Add modal or redirect to contact page with package context. Pre-fill package name and type in contact form for user convenience."

**15. All Packages - Custom Package Request**
- **Issue:** No functionality, text appears only on hover
- **AI Prompt:** "Fix Custom Package Request button. Add proper click handler to open contact form or modal for custom package inquiries. Ensure button text is always visible, not just on hover. Add form fields for custom requirements (destinations, duration, budget, group size)."

**16. Booking Page - View Complete Itinerary (No Functionality)**
- **Issue:** View Complete Itinerary button has no functionality
- **AI Prompt:** "Implement View Complete Itinerary functionality. Create a modal or expandable section showing day-by-day itinerary from package data. Use rich-text-editor display component to show formatted itinerary details with activities, accommodations, and meals."

**17. Booking Page - Total Price Symbol (All Packages)**
- **Issue:** Displays $ for INR currency
- **AI Prompt:** "Fix Total Price display in Check Availability & Book section. Use currency store to get current currency and display ₹ for INR, $ for USD. Update tourist-booking component to properly format prices with correct symbols."

**18. Domestic Packages - Currency Symbol Display**
- **Issue:** Currency value changed but displays $ instead of ₹
- **AI Prompt:** "Apply currency symbol fix to Domestic packages section. Ensure consistency with All Packages fix. Update all price elements in domestic package cards and booking pages."

**19. Domestic Packages - View Complete Itinerary (No Functionality)**
- **Issue:** Goa booking page - View Complete Itinerary has no functionality
- **AI Prompt:** "Add View Complete Itinerary functionality for domestic packages (especially Goa). Reuse the itinerary display component from All Packages section. Ensure itinerary data is available in package documents."

**20. Domestic Packages - Total Price Symbol**
- **Issue:** Displays $ for INR currency
- **AI Prompt:** "Fix Total Price symbol in domestic packages booking section. Apply same currency display logic as other package types. Ensure service fees and total calculations show correct currency symbols."

**21. International Packages - Currency Symbol Display**
- **Issue:** Currency value changed but displays $ instead of ₹
- **AI Prompt:** "Fix currency symbol in International packages section. Update all price displays to show ₹ for INR and $ for USD. Test with package listings and booking pages."

### Gallery Issues

**22. Footer Quick Links - Page Scroll Position**
- **Issue:** Gallery and Blog links work but page stays in same scroll state
- **AI Prompt:** "Add scroll-to-top functionality when navigating from footer quick links. Use Next.js router with scroll: true option or implement useEffect hook to scroll to top on route change for Gallery and Blog pages."

**23. Footer - Social Media Links**
- **Issue:** Social handles redirect to Twitter but not official accounts
- **AI Prompt:** "Update social media links in Footer component. Replace generic Twitter links with official Tamil Adventure Trekking Club social media handles. Verify Instagram, Facebook, LinkedIn, and YouTube links point to correct accounts."

**24. Footer - Legal Pages 404**
- **Issue:** Privacy Policy, Terms of Service, Cookie Policy show 404
- **AI Prompt:** "Create legal policy pages or link to existing documents. Either create Next.js pages at /privacy-policy, /terms-of-service, /cookie-policy or link to PDF documents stored in Firebase Storage. Use existing legal document templates if available."

### Review System Issues

**25. Review Page - Profile Photo Optional Field**
- **Issue:** Optional functionality not working, profile photo required to submit
- **AI Prompt:** "Fix profile photo optional field validation in ReviewSubmissionForm component. Update form validation schema to make profile photo truly optional. Ensure form can submit successfully without image upload. Handle null/undefined profile photo in submission logic."

**26. Contact Page - Server Error**
- **Issue:** Send message button causes internal server error
- **AI Prompt:** "Debug and fix the contact form server endpoint. Check the email.ts utility for errors. Verify Nodemailer configuration, email templates, and Firebase Admin SDK setup. Add proper error handling and validation. Test with valid SMTP credentials."

### Responsive Design Issues

**27. Tablet View - Scroll Down Overlap**
- **Issue:** Scroll down overlaps with swipe dots and 'small groups' text
- **AI Prompt:** "Fix tablet view responsive design issues. Add media queries for tablet breakpoints (768px-1024px). Adjust z-index and positioning of scroll down button. Ensure proper spacing between hero section elements to prevent overlapping."

**28. Tablet View - Reviews Section Layout**
- **Issue:** Reviews displayed vertically instead of horizontally
- **AI Prompt:** "Update reviews section responsive layout for tablet view. Implement horizontal scrolling or carousel for reviews on tablet devices. Show 2-3 reviews at once in landscape, 1 review in portrait. Use Tailwind responsive classes (md:, lg:)."

**29. Mobile View - Scroll Down Overlap**
- **Issue:** Scroll down overlaps with swipe dots and 'small groups' text
- **AI Prompt:** "Fix mobile view (< 768px) hero section layout. Adjust element positioning, reduce button sizes if needed, and ensure proper stacking order. Test on both portrait and landscape orientations."

**30. Mobile View - Reviews Section Layout**
- **Issue:** Reviews displayed vertically, need one review visible at a time in portrait
- **AI Prompt:** "Implement mobile-optimized reviews carousel. Show one review at a time in portrait view with swipe navigation. Add pagination dots and optional prev/next buttons. Ensure smooth transitions and touch-friendly interactions."

---

## ADMIN PANEL

### Dashboard Issues

**31. Dashboard - Time Filter Non-functional**
- **Issue:** Time filter shows same bookings for all filter options
- **AI Prompt:** "Fix time filter in admin dashboard. Update BookingManagement component to properly filter bookings by date ranges (Today, This Week, This Month, This Year). Ensure Firebase query includes proper timestamp filtering using Firestore where clauses."

**32. Dashboard - Statistics INR Symbol**
- **Issue:** Statistics section uses $ symbol for INR
- **AI Prompt:** "Fix currency symbol in dashboard statistics cards. Update get-stats.ts utility to return proper currency symbols. Ensure revenue and pricing statistics show ₹ for INR values."

**33. Dashboard - Statistics Currency Calculation**
- **Issue:** INR value added with USD value without conversion
- **AI Prompt:** "Fix currency aggregation in statistics. Separate USD and INR bookings or convert all to single currency before summing. Update get-stats calculations to handle multi-currency bookings properly. Display separate totals or converted values."

### Booking Management Issues

**34. Booking List - Time Filter Non-functional**
- **Issue:** Time filter doesn't filter bookings correctly
- **AI Prompt:** "Fix time filter in BookingList component. Implement proper date range filtering for Today, Week, Month, Year options. Use Firebase Firestore timestamp queries or client-side filtering based on booking dates."

**35. Booking List - Invoice Not Updated After Edit**
- **Issue:** Invoice file doesn't reflect edited booking details
- **AI Prompt:** "Update invoice generation to reflect edited booking data. Regenerate PDF invoice when booking details are modified. Ensure bookingConfirmation.ts utility fetches latest booking data before generating invoice. Add version tracking if needed."

**36. Booking List - Slot Update After Cancellation**
- **Issue:** Cancelled bookings don't free up slots for users
- **AI Prompt:** "Implement slot release functionality when admin cancels booking. Update mountain/package availability dates in Firebase when booking is cancelled. Increment available slots for the specific date. Add transaction handling to ensure data consistency."

### Tour and Travel Management Issues

**37. Tour and Travel - Export Data Filter Non-functional**
- **Issue:** Time filter doesn't work in export data view
- **AI Prompt:** "Fix time filtering in BookingExport component. Apply same date range logic as booking list. Ensure filtered data is used for CSV export generation."

**38. Tour and Travel - Export Include Checkboxes**
- **Issue:** All details included in export regardless of checkbox selection
- **AI Prompt:** "Fix selective field export functionality in BookingExport. Update CSV generation logic to only include checked fields. Map checkbox states to corresponding data fields before generating export file."

**39. Tour and Travel - Image Upload Display Issue**
- **Issue:** Image uploaded but doesn't display
- **AI Prompt:** "Debug image upload in TouristPackageManagement component. Check Firebase Storage upload completion, verify image URL is saved to Firestore document, ensure image-uploader component returns valid URL. Add loading states and error handling. Check CORS configuration on Firebase Storage bucket."

### Mountain Management Issues

**40. Mountain - Image Upload Display Issue**
- **Issue:** Image uploaded but doesn't display
- **AI Prompt:** "Fix image upload in MountainManagement component. Verify Firebase Storage upload process, check image URL storage in Firestore, ensure proper image-loader component usage. Debug console for Firebase errors. Test with different image formats and sizes."

**41. Mountain - International/Domestic Option Not Displayed**
- **Issue:** Can be selected during package creation but not shown to users
- **AI Prompt:** "Add international/domestic indicator to user-facing mountain displays. Update MountainCard and mountain details page to show location type. Verify the field is saved in Firebase schema and properly fetched in user-side queries."

### Blog Management Issues

**42. Blog Posts - Image Upload Firebase Error**
- **Issue:** Image cannot be uploaded (Firebase error in console)
- **AI Prompt:** "Debug Firebase Storage error in BlogManagement image upload. Check Storage security rules, verify upload permissions, ensure proper authentication token. Review image-uploader component for Firebase SDK errors. Check browser console for specific error messages."

**43. Blog Posts - Date Field Limitation**
- **Issue:** Only sets today's date, not previous or future dates
- **AI Prompt:** "Fix date picker in blog post creation. Update date input to allow full date range selection. Remove restrictions on past/future dates. Ensure date value is properly stored in ISO format in Firestore."

**44. Blog Posts - Updated Content Not Displayed**
- **Issue:** Content editable but updates not shown on user side
- **AI Prompt:** "Fix blog post content synchronization. Verify Firestore update operation completes successfully. Check if user-facing blog page uses proper caching strategy. Add cache invalidation or force refresh after blog update. Debug content fetching logic on blog display page."

### Gallery Management Issues

**45. Gallery Images - Image Upload Firebase Error**
- **Issue:** Image cannot be uploaded (Firebase error in console)
- **AI Prompt:** "Fix Firebase Storage error in GalleryImageManagement. Check storage rules, authentication, and bucket configuration. Verify image-processor utility handles uploads correctly. Review Firebase console for quota limits or permission issues."

**46. Awards and Recognition - Image Upload Firebase Error**
- **Issue:** Image cannot be uploaded (Firebase error in console)
- **AI Prompt:** "Debug image upload in AwardManagement component. Apply same fixes as gallery image upload. Verify Firebase Storage path, check file size limits, ensure proper error handling. Test with various image formats."

**47. Awards and Recognition - Content Not Dynamic**
- **Issue:** Admin panel content not reflected on user side, only static data shown
- **AI Prompt:** "Make awards section fully dynamic. Update AwardManagement to save content to Firestore. Modify user-facing awards component to fetch from Firebase instead of using static data. Implement real-time updates or proper data fetching on page load."

### Statistics Management Issues

**48. Landing Statistics - Updates Not Reflected**
- **Issue:** Updated data not shown on user side, static data displayed
- **AI Prompt:** "Fix statistics update synchronization for landing page. Ensure StatsManagement saves to correct Firestore collection. Update StatsSection component to fetch live data from Firebase instead of using hardcoded values. Add loading states and error handling."

**49. Domestic Statistics - Updates Not Reflected**
- **Issue:** Updated data not shown on user side, static data displayed
- **AI Prompt:** "Implement dynamic statistics for domestic packages section. Update stats fetching logic to pull from Firestore. Replace static numbers with live data from admin-updated statistics. Use same pattern as landing page stats fix."

**50. International Statistics - Updates Not Reflected**
- **Issue:** Updated data not shown on user side, static data displayed
- **AI Prompt:** "Enable dynamic statistics for international packages. Update statistics display component to query Firebase. Remove hardcoded values and implement real-time or cached data fetching from admin-managed statistics."

### Contact Management Issues

**51. Contact Details - Updates Not Reflected**
- **Issue:** Static data displayed, updated data not shown on user side
- **AI Prompt:** "Fix contact information synchronization. Ensure ContactsManagement component saves to correct Firestore path. Update user-facing contact-info component to fetch from Firebase. Verify document structure matches between admin save and user fetch operations."

### Responsive Admin Panel Issues

**52. Admin Panel - Mobile/Tablet Media Queries**
- **Issue:** Media queries not set properly, poor UI on mobile/tablet
- **AI Prompt:** "Add comprehensive responsive design to admin panel. Create mobile-first layout for AdminDashboard, AdminSidebar, and all management components. Use Tailwind responsive classes (sm:, md:, lg:, xl:). Implement collapsible sidebar, stack cards vertically, make tables horizontally scrollable on small screens. Test on actual devices or browser dev tools."

---

## Summary

- **Total Negative Test Cases:** 52
- **User-Facing Issues:** 30
- **Admin Panel Issues:** 22

### Priority Categories:

**Critical (Blocking User Actions):**
- Currency symbol displays (affects pricing accuracy)
- Image upload failures (prevents content management)
- Server errors (contact form, bookings)
- Legal pages 404 (compliance issue)

**High (User Experience Impact):**
- Filter non-functional issues
- Content sync problems (blog, stats, contact)
- Availability slot management
- Navigation and scroll issues

**Medium (Enhancement):**
- Optional field validation
- Responsive design improvements
- Social media link corrections
- Export functionality refinements

**Low (Minor UX):**
- Page scroll position on navigation
- Review layout on mobile/tablet
- Season filter implementation
