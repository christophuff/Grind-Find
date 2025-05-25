# **GrindFind**

## **Project Overview**

**GrindFind** is a platform designed for skateboarders to find, upload, and share street spots. It allows users to create profiles and contribute their own spots for others to enjoy. This MVP aims to provide basic functionality to allow users to interact with the platform and contribute content.

## **MVP Goals**

### **Core Features:**

1. **User Authentication:**
   - Implement user authentication using Firebase (or another method).
   - Allow users to login and be created as a skater in the database. 

2. **Street Spot Create Read Update and Delete:**
   - Users can upload street spots, including information such as:
     - Spot name
     - Address
     - Description
     - Images (multiple image upload functionality)
   - Images are uploaded to Firebase Storage, and URLs are saved in the database.

3. **Spot Image Carousel:**
   - On the spot detail page, users can view a carousel of images uploaded for the spot.
   - Users can click on thumbnail images to update the carousel image.

4. **Responsive Design:**
   - Ensure that the site is mobile-friendly and adjusts its layout according to the screen size (images, spot details, and carousels should all be responsive).

5. **Basic User Interface:**
   - A simple and intuitive UI for users to interact with, including forms for uploading spots, viewing spot details, and navigating between pages.
   - Basic components like buttons, forms, image previews, and carousels are styled and functional.

---

## **Future Stretch Goals (Post-MVP):**

1. **Geolocation Integration:**
   - Use a geolocation API to show spots on a map.
   - Enable users to search for nearby spots based on their location.

2. **Spot Search and Display:**
   - Allow users to search for street spots by location.
   - Display a list of spots with thumbnails and basic details.
   - Users can click on a spot to view detailed information, including images.

3. **User Ratings:**
   - Allow users to rate spot.
   - Implement a 5-star rating system or a thumbs-up/thumbs-down system.

4. **Profile Management:**
   - Users can view and edit their profile information.
   - Users can see the spots they have uploaded.

5. **Social Features:**
   - Allow users to follow other users and view their uploaded spots.
   - Implement a feed to show recently uploaded spots by users you follow.

6. **Spot Categories or Tags:**
   - Add the ability for users to categorize spots by type (e.g., street, park, bowl) or add custom tags.
   - Enable filtering by category or tag.

---

## **Technologies Used**

- **Frontend**:
  - React
  - Next.js
  - React Slick (for the carousel)
  - Firebase (for authentication, data storage, and image uploads)

- **Backend** (if applicable):
  - Firebase Realtime Database (or Firestore)
  - Firebase Storage (for image storage)

---

## **Installation Instructions**

### **1. Clone the Repository:**
 - bash
 --git clone https://github.com/christophuff/grind-find.git

### **2. Dependencies:**
 - npm install 
 - npm run prepare

### **3. Set Up Firebase:**

**Go to Firebase Console.**

**Create a new Firebase project.**

**Set up Firebase Authentication, Firestore (or Realtime Database), and Firebase Storage.**

**Add your Firebase credentials to the .env.local file:**

 - NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
 - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
 - NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
 - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
 - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
 - NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

 ### **4. Start the Development Server:**
 - npm run dev
