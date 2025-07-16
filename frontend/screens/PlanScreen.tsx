// frontend/screens/PlanScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, FlatList, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { getAuth } from 'firebase/auth';
import { arrayUnion, arrayRemove, serverTimestamp, setDoc, deleteDoc, doc, getDocs, getDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../backend/config/firebase';

import { styles } from '../styles/PlanScreenStyles';

export const { width } = Dimensions.get('window');

type Step = 1 | 2 | 3;

const nutritionGoals = [
  { id: 'lose_weight',  title: 'Lose Weight',  desc: 'Reduce caloric intake', icon: '📉', calories: 1500, protein: 120, carbs: 150 },
  { id: 'gain_weight',  title: 'Gain Weight',  desc: 'Increase caloric intake', icon: '📈', calories: 2500, protein: 150, carbs: 300 },
  { id: 'maintain',     title: 'Maintain',     desc: 'Balanced nutrition', icon: '⚖️', calories: 2000, protein: 140, carbs: 220 },
  { id: 'build_muscle', title: 'Build Muscle', desc: 'High protein intake', icon: '💪', calories: 2200, protein: 180, carbs: 200 },
  { id: 'healthy_living', title: 'Healthy Living', desc: 'Overall wellness', icon: '🌱', calories: 1800, protein: 130, carbs: 180 },
];

const foodOptions = [
  { id: 'cabbage',       name: 'Cabbage',       icon: '🥬' },
  { id: 'chicken',       name: 'Chicken',       icon: '🐔' },
  { id: 'meat',          name: 'Meat',          icon: '🥩' },
  { id: 'egg',           name: 'Egg',           icon: '🥚' },
  { id: 'broccoli',      name: 'Broccoli',      icon: '🥦' },
  { id: 'corn',          name: 'Corn',          icon: '🌽' },
  { id: 'carrot',        name: 'Carrot',        icon: '🥕' },
  { id: 'sweet_potato',  name: 'Sweet Potato',  icon: '🍠' },
  { id: 'lettuce',       name: 'Lettuce',       icon: '🥬' },
  { id: 'rice',          name: 'Rice',          icon: '🍚' },
  { id: 'salmon',        name: 'Salmon',        icon: '🐟' },
  { id: 'avocado',       name: 'Avocado',       icon: '🥑' },
];

const recommendedMeals = [
  { id: 1, name: 'Grilled Chicken Bowl',   description: 'High‑protein bowl', image: '🍗', calories: 450, protein: 35, carbs: 30, ingredients: ['chicken','rice','broccoli','carrot'],   mealType: 'lunch' },
  { id: 2, name: 'Salmon Avocado Salad',  description: 'Omega‑3 rich',      image: '🥗', calories: 380, protein: 28, carbs: 12, ingredients: ['salmon','avocado','lettuce','egg'],    mealType: 'dinner' },
  { id: 3, name: 'Veggie Scramble',       description: 'Vegetarian protein', image: '🍳', calories: 320, protein: 18, carbs: 20, ingredients: ['egg','broccoli','cabbage','sweet_potato'], mealType: 'breakfast' },
  { id: 4, name: 'Beef Stir Fry',         description: 'Mixed vegetables',   image: '🥩', calories: 520, protein: 42, carbs: 35, ingredients: ['meat','broccoli','carrot','rice'],      mealType: 'dinner' },
];


const PlanScreen: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [firstName, setFirstName] = useState<string>('User');
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);

  /* -------------------------- Firestore refs ------------------------------ */
  const auth = getAuth();
  const uid  = auth.currentUser?.uid ?? '';
  const userRef     = doc(db, 'user', uid);
  const userInfoRef = doc(db, 'userInfo', uid);

  /* -------------------------- fetch first name ---------------------------- */
  useEffect(() => {
    (async () => {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const fn = snap.data().fullName as string | undefined;
        if (fn) setFirstName(fn.split(' ')[0]);
      }
    })();
  }, []);

  /* Load existing favourites */
  useEffect(() => {
    (async () => {
      if (!uid) return;
      const snap = await getDocs(collection(db, 'users', uid, 'favourites'));
      setFavouriteIds(snap.docs.map(d => d.id));
    })();
  }, [uid]);
  

  /* ----------------------------- helpers ---------------------------------- */
  const goalObj = nutritionGoals.find(g => g.id === selectedGoal);

  const toggleFood = (id: string) => {
    setSelectedFoods(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  /* toggle favourite */
  const toggleFavouriteMeal = async (meal) => {
    if (!uid) return;
    const favRef = doc(db, 'users', uid, 'favourites', meal.id.toString());
    const userInfoRef = doc(db, 'userInfo', uid);
  
    const already = favouriteIds.includes(meal.id.toString());
    try {
      if(already){
      await Promise.all([
        deleteDoc(favRef),
        updateDoc(userInfoRef, {
          favourites: arrayRemove(meal.name)
        })
      ]);

      setFavouriteIds(prev => prev.filter(id => id !== meal.id.toString()));
    }else{
      await Promise.all([
        setDoc(favRef, { addedAt: serverTimestamp(), ...meal }),
        updateDoc(userInfoRef, {
          favourites: arrayUnion(meal.name)
        })
      ]);

      setFavouriteIds(prev => [...prev, meal.name]);
    }
    }catch(e){
      console.warn('Fav error', e);
    }
  };  

  /* ----------------------- persist goal (step 1→2) ------------------------ */
  const proceedToFoodStep = async () => {
    await setDoc(
      userInfoRef,
      { goalId: selectedGoal, goalSetAt: new Date().toISOString() },
      { merge: true }
    );
    setStep(2);
  };

  /* ---------------------- persist foods (step 2→3) ------------------------ */
  const proceedToPlanStep = async () => {
    await updateDoc(userInfoRef, {
      likedFoods: selectedFoods,
      prefsUpdatedAt: new Date().toISOString(),
    });
    setStep(3);
  };

  /* ---------------------------- components -------------------------------- */

  const StepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1,2,3].map(idx => (
        <View key={idx} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            idx <= step ? styles.stepActive : styles.stepInactive
          ]}>
            <Text style={[
              styles.stepText,
              idx <= step ? styles.stepTextActive : styles.stepTextInactive
            ]}>{idx}</Text>
          </View>
          {idx < 3 && <View style={[
            styles.stepLine,
            idx < step ? styles.stepLineActive : styles.stepLineInactive
          ]}/>}
        </View>
      ))}
    </View>
  );

  /* --------- STEP 1 : goal selection --------- */
  const GoalStep = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Set Your Goal</Text>
        <TouchableOpacity><Text style={styles.skipText}>Skip</Text></TouchableOpacity>
      </View>

      <StepIndicator />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>What's your nutrition goal?</Text>
        <Text style={styles.sectionSubtitle}>Choose the goal that best fits you</Text>
      </View>

      <ScrollView style={styles.goalsList} showsVerticalScrollIndicator={false}>
        {nutritionGoals.map(goal => (
          <TouchableOpacity
            key={goal.id}
            onPress={() => setSelectedGoal(goal.id)}
            style={[
              styles.goalItem,
              selectedGoal === goal.id && styles.goalItemSelected
            ]}
          >
            <View style={styles.goalContent}>
              <View style={styles.goalLeft}>
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <View style={styles.goalText}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDesc}>{goal.desc}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        disabled={!selectedGoal}
        onPress={proceedToFoodStep}
        style={[
          styles.nextButton,
          selectedGoal ? styles.nextButtonActive : styles.nextButtonInactive
        ]}
      >
        <Text style={[
          styles.nextButtonText,
          selectedGoal ? styles.nextButtonTextActive : styles.nextButtonTextInactive
        ]}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  /* --------- STEP 2 : food preferences -------- */
  const FoodStep = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Food Preferences</Text>
        <TouchableOpacity><Text style={styles.skipText}>Skip</Text></TouchableOpacity>
      </View>

      <StepIndicator />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>What foods do you like?</Text>
        <Text style={styles.sectionSubtitle}>Select ingredients you enjoy eating</Text>
      </View>

      <FlatList
        data={foodOptions}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleFood(item.id)}
            style={[
              styles.foodItem,
              selectedFoods.includes(item.id) && styles.foodItemSelected
            ]}
          >
            <Text style={styles.foodIcon}>{item.icon}</Text>
            <Text style={styles.foodName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={proceedToPlanStep}
        style={[styles.nextButton, styles.nextButtonActive]}
      >
        <Text style={[styles.nextButtonText, styles.nextButtonTextActive]}>
          Generate Meal Plan
        </Text>
      </TouchableOpacity>
    </View>
  );

  /* --------- STEP 3 : plan display ----------- */
  const PlanStep = () => {
    if (!goalObj) return null;

    const meals = selectedFoods.length
      ? recommendedMeals.filter(m =>
          m.ingredients.some(i => selectedFoods.includes(i)))
      : recommendedMeals;

    return (
      <View style={styles.container}>
        {/* greeting */}
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={24} color="#6B7280" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileGreeting}>Hey, {firstName}</Text>
            <Text style={styles.profileSubtitle}>Your personalized meal plan</Text>
          </View>
        </View>

        {/* goals cards */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>Daily Nutrition Goals</Text>
            <View style={styles.nutritionGrid}>
              <View style={[styles.nutritionCard,{backgroundColor:'#FFF7ED'}]}>
                <Text style={[styles.nutritionLabel,{color:'#EA580C'}]}>Calories</Text>
                <Text style={styles.nutritionValue}>{goalObj.calories}</Text>
              </View>
              <View style={[styles.nutritionCard,{backgroundColor:'#F0FDF4'}]}>
                <Text style={[styles.nutritionLabel,{color:'#16A34A'}]}>Protein</Text>
                <Text style={styles.nutritionValue}>{goalObj.protein}g</Text>
              </View>
              <View style={[styles.nutritionCard,{backgroundColor:'#EFF6FF'}]}>
                <Text style={[styles.nutritionLabel,{color:'#2563EB'}]}>Carbs</Text>
                <Text style={styles.nutritionValue}>{goalObj.carbs}g</Text>
              </View>
            </View>
          </View>

          {/* meals */}
          <View style={styles.mealsSection}>
            <Text style={styles.sectionTitle}>Recommended Meals</Text>
            {meals.slice(0,3).map(meal => (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealLeft}>
                    <Text style={styles.mealIcon}>{meal.image}</Text>
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <Text style={styles.mealDescription}>{meal.description}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => toggleFavouriteMeal(meal)}>
                    <Ionicons name={favouriteIds.includes(meal.id.toString()) ? 'heart': 'heart-outline'} size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.mealStats}>
                  <Text style={styles.mealStat}>{meal.calories} cal</Text>
                  <Text style={styles.mealStat}>{meal.protein}g protein</Text>
                  <Text style={styles.mealStat}>{meal.carbs}g carbs</Text>
                </View>

                <View style={styles.mealFooter}>
                  <View style={styles.mealTypeTag}>
                    <Text style={styles.mealTypeText}>{meal.mealType}</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.addToPlanText}>Add to Plan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={() => { setSelectedFoods([]); setSelectedGoal(''); setStep(1);} }
          style={[styles.nextButton, styles.restartButton]}
        >
          <Text style={[styles.nextButtonText, styles.nextButtonTextActive]}>
            Start New Plan
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  /* --------------------------- root render ---------------------------------- */
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <LinearGradient
        colors={['#F0FDF4','#FFFFFF','#F0FDF4']} style={styles.gradientContainer}
      >
        {step === 1 && <GoalStep />}
        {step === 2 && <FoodStep />}
        {step === 3 && <PlanStep />}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default PlanScreen;
