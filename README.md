# 🍎 Healtheaty App

**Healtheaty** is a cross-platform mobile app built using **React Native + Expo** that helps users track their daily calorie intake and nutritional breakdown. The app allows users to register/login, upload meal photos, detect food automatically, estimate portion sizes, and view personalized health statistics including BMR and TDEE.

## 📱 Built With

* **Expo (React Native)**
* **Firebase Authentication**
* **Firebase Data Connect (custom `getUserByEmail`)**
* **Cloudinary** for image storage
* **Roboflow** for food detection
* **Spoonacular API** for nutrition analysis

---

## 🚀 How to Run This App Locally

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/Healtheaty-App.git
   cd Healtheaty-App
   ```

2. **Install Dependencies**
   Make sure you have `pnpm` or `npm`:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root folder with:

   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   CLOUDINARY_URL=your_cloudinary_url
   SPOONACULAR_API_KEY=your_spoonacular_key
   ```

4. **Connect to Firebase and Generate SDKs**
   
   Note: Make sure to install the Firebase SDK:
   ```bash
   npm install firebase
   ```
   Yes, you can access my Firestore database **if i give you access in the Firebase Console** (e.g., as project viewers or editors).
   But firstly, just make on your local (Firebase Console -> Make a project -> Firestore Database for storing), images will be stored in Cloudinary(Google).
   After that, they must set up Firebase and Data Connect locally:

   ```bash
   npm install -g firebase-tools @firebase/data-connect-cli
   firebase login
   data-connect login
   data-connect init
   data-connect generate
   ```

   This will generate the `dataconnected/` and `dataconnected-generated/` folders for accessing Firestore and user data.

6. **Start the App**

   ```bash
   npm expo start
   ```

7. **Run on Emulator or Device**

   * iOS: Press `i` in terminal to launch iOS Simulator.
   * Android: Press `a` to launch Android emulator.
   * Scan the QR code with the Expo Go app on your physical device.

---

## ✅ Features Implemented

### 🔐 Authentication

* Firebase Authentication for Sign Up, Sign In
* Firebase Data Connect for fetching user info

### 🖼️ Profile

* Edit profile information
* Upload avatar using ImagePicker
* Store profile images in Cloudinary

### 🍱 Home Screen

* Detect food using Roboflow
* Upload meal images
* Estimate calories based on portion and food type

### 📊 Statistics

* Calculate and display:

  * BMR (Basal Metabolic Rate)
  * TDEE (Total Daily Energy Expenditure)
  * Consumed calories
* Visualized using circular progress

### 📁 File Handling

* Custom utility: `uploadImageToCloudinary.ts` & `calculateCalories.ts`
* Local image preview before upload

---

## 🛠️ In Progress / Coming Soon

* Portion size estimation based on bowl/pot dimensions
* Advanced meal recognition (multi-food detection)
* Nutrition history
* Daily/weekly charts
* In-app reminders and goals

---

## 📂 Folder Structure (Partial)

```
Healtheaty-App/
├── backend/
│   ├── config/
│   ├── models/
│   ├── services/
├── dataconnected/             { connect Firebase to generate this folder }
├── dataconnected-generated/   { connect Firebase to generate this folder }
├── frontend/
│   ├── components/
│   ├── constants/
│   ├── images/
│   ├── screens/
│   ├── styles/
│   ├── types/
│   └── utils/
├── dev.sh
├── .zshrc
└── .env (not committed)
```

---

## 🧠 Author

Developed with ❤️ by **Lloyd To**
