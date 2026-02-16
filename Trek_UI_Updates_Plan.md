# Trek_UI_Updates_Plan.md

## 1. Logo Redesign
*   **Section**: Navbar
*   **File Path**: `components/layout/Navbar.tsx`
*   **Action Plan**:
    *   Locate the `<Link href="/">` containing the Logo `<Image />`.
    *   Increase the `width` and `height` props of the `Image` component.
    *   Adjust the container `div` styling (likely Tailwind classes) to allow the logo to be bigger (e.g., increase `h-` or `w-` classes).
    *   Ensure the logo remains responsive on mobile but visibly larger on desktop.
    *   **New Requirement**: Change the displayed text (either `alt` text or accompanying text element) to the full name: **"Tamil Adventure Trekking Club"**.
        *   If the text is part of an image, ensure the image is updated or a new text element is added next to it.
        *   If it's a separate text component, update its content.

## 2. Currency Default
*   **Section**: Global State / Store
*   **File Path**: `stores/currency-store.ts`
*   **Action Plan**:
    *   In the `useCurrencyStore` create function, locate the initial state `currency: "USD"`.
    *   Change the default value to `currency: "INR"`.
    *   Ensure `symbols` object still contains both USD and INR (it does).

## 3. Highlight Muthamilselvi Madam (Hero Section) & 7. Header/Tagline Update
*   **Section**: Hero Section (Landing Page)
*   **File Path**:
    *   `components/home/HomePageV2.tsx`
    *   `components/home/HeroAboutSection.tsx`
*   **Action Plan**:
    *   **In `HomePageV2.tsx`**:
        *   Remove the import and usage of `HeroSection`.
        *   Move `<HeroAboutSection />` to be the first component inside the `main` container, taking the place of the correct Hero.
    *   **In `HeroAboutSection.tsx`**:
        *   Update the text to the new requirement:
            *   **Main Header**: "Tamil Adventure Trekking Club – Authentic Trekking Experiences across the world."
            *   **Sub Header**: "Led by Muthamilselvi Narayanan – Fastest Indian women to complete the 7 highest peaks of the world."
        *   Style this text to be "bigger and impactful" (e.g., utilize `h1`, larger Tailwind text classes `text-5xl md:text-7xl`, bold weights).
        *   Ensure the visual hierarchy highlights Muthamilselvi as the primary focus.

## 4. Trek Difficulty & Location Columns
*   **Section**: Trek Listings (Featured Mountains)
*   **File Path**: `components/home/FeaturedMountains/MountainCard.tsx`
*   **Action Plan**:
    *   Modify the card layout to include distinct visual indicators for **Difficulty** and **Location**.
    *   **Difficulty**: Create a distinct badge or colored column/bar showing "Easy", "Medium", or "Hard". (Currently exists as a bar, will enhance to be a clear badge/column as requested).
    *   **Location**: Create a distinct badge or text indication for "Within India" vs "Outside India" (derived from the `location` string).
    *   Ensure these are visible at a glance without hovering if possible, or very prominent within the card content.

## 5. Amazon Book Link
*   **Section**: About Page / Philosophy Section
*   **File Path**: `components/about/PhilosophySection.tsx`
*   **Action Plan**:
    *   Locate the "Compact Book Feature" section.
    *   Add a prominent "Buy on Amazon" button (using `Link` and `Button` components).
    *   Link URL: `https://www.amazon.in/dp/9334236809`
    *   Style the button to be visually appealing (e.g., using Amazon colors or the site's primary brand color) and place it near the book cover or description.
    *   Check for any spelling errors in the book section and correct them if found.

## 6. Instagram Highlight (Landing Page)
*   **Section**: Instagram Section
*   **File Path**: `components/home/Instagram.tsx`
*   **Action Plan**:
    *   Enhance the existing Instagram section to be more "prominent".
    *   Add a large, centered "Follow on Instagram" Call-to-Action (CTA) button below the gallery or title.
    *   Ensure the button redirects to Muthamilselvi's Instagram profile (will use a placeholder `https://www.instagram.com/muthamilselvi_mountaineer` or similar if discovered, otherwise generic `instagram.com`).
    *   Style the section to stand out (potentially darker background or different gradient to separate it).
