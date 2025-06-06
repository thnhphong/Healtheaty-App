# 🍽️ Healtheaty – Smart Nutrition App for a Healthy Lifestyle

**Healtheaty** is a smart, personalized nutrition tracking app that empowers users to build and maintain a healthy lifestyle. Using AI-powered food image recognition, personalized calorie planning, and real-time smart suggestions, Healtheaty helps you make informed dietary decisions every day.

---

## 🌟 Key Features

### 1. 🧮 Meal Plan Based on Your Body and Goal
Healtheaty calculates your ideal **daily calorie target** using personal data:
- **Gender, Age, Height, Weight** → calculates **BMR (Basal Metabolic Rate)**
- **Activity Level** → calculates **TDEE (Total Daily Energy Expenditure)**
- **Goal** → Lose fat, gain muscle, or maintain weight

💡 Your plan adapts dynamically as you update your profile.

---

### 2. 📸 Upload Food Photo → Get Nutrition Breakdown
Simply **take or upload a photo of your meal**, and Healtheaty will:
- Identify the food category (e.g., Pizza, Pho, Salad)
- Estimate **calories, protein, carbs, fat**
- Score the meal using a **Nutrition Health Score** based on your goal

⚙️ Powered by a custom-trained food classification model (PyTorch) + nutrition mapping.

---

### 3. 🧠 Real-Time Smart Recommendations
Healtheaty analyzes your context and behavior to suggest healthy actions:
- ⏰ **Time-Based**: Missed breakfast? Suggest light meals for lunch.
- 🌦️ **Weather-Based**: It’s raining? Suggest warm, cozy meals to cook at home.
- 📍 **Location-Based**: At the supermarket? Recommend recipes using local ingredients.
- 🧍 **Health Profile**: Recommendations based on your diet history and fitness goal.

---

## 🚀 Tech Stack

| Area              | Technology                                                                 |
|-------------------|------------------------------------------------------------------------------|
| Frontend (Mobile) | React Native (Expo)                                                          |
| Backend API       | Python Flask                                                                 |
| Image Recognition | Roboflow (Object Detection) – identifies food items from uploaded images     |
| Nutrition Data    | Spoonacular API – fetches nutrition breakdown after food names are detected  |
| UI Design         | Figma                                                                        |


---

## 📷 Example: Nutrition Breakdown Output

| Food    | Calories | Protein | Carbs | Fat |
|---------|----------|---------|-------|-----|
| Pho     | 350 kcal | 20g     | 50g   | 5g  |
| Pizza   | 285 kcal | 12g     | 36g   | 10g |
| Salad   | 120 kcal | 3g      | 15g   | 6g  |

---

## 🛠️ How to Run

Follow these steps to get Healtheaty up and running on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Healtheaty-App.git
cd Healtheaty-App
```

### 2. Backend Setup (Python + Flask)
a. Install dependencies: 
```bash
cd backend
pip install -r requirements.txt
```
b. Connect to Roboflow model: 
- Train or upload food classification data on Roboflow
- Use their hosted API or export the model to local
  If training locally:
```bash
python train.py
```
c. Run Flask server: 
```bash
python app.py
```
The backend now accepts meal photo uploads and returns detected food + nutrition breakdown.

3. Frontend Setup (React Native + Expo)
a. Install dependencies:
```bash
cd frontend
npm install
```
b. Start Expo app: 
```bash
npx expo start
```
Use Expo Go app on your mobile device to scan the QR code and preview.

🔐 Notes
- Make sure to store Roboflow and Spoonacular API keys securely in .env or config files.
- Nutrition data may vary slightly depending on the food detected.

Use their hosted API or export the model to local
---

## 💡 Future Enhancements
- Ingredient-level detection using object detection
- Integration with wearables (e.g., Fitbit)
- Daily meal reminders and progress reports

---

**Healtheaty – Your Healthier Eating Starts Here.**
