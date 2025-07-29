// frontend/screens/PlanScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, FlatList, Dimensions, Alert
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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [existingPlan, setExistingPlan] = useState<any>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(true);
  const [showCreateNew, setShowCreateNew] = useState<boolean>(false);

  /* -------------------------- Firestore refs ------------------------------ */
  const auth = getAuth();
  const uid  = auth.currentUser?.uid ?? '';
  const userRef     = doc(db, 'user', uid);
  const userInfoRef = doc(db, 'userInfo', uid);

  /* -------------------------- fetch user data and existing plan ---------------------------- */
  useEffect(() => {
    (async () => {
      if (!uid) {
        setIsLoadingPlan(false);
        return;
      }

      try {
        // Fetch user name and existing plan
        const [userSnap, userInfoSnap] = await Promise.all([
          getDoc(userRef),
          getDoc(userInfoRef)
        ]);

        // Set first name
        if (userSnap.exists()) {
          const fn = userSnap.data().fullName as string | undefined;
          if (fn) setFirstName(fn.split(' ')[0]);
        }

        // Check for existing plan
        if (userInfoSnap.exists()) {
          const data = userInfoSnap.data();
          
          // Load favourites
          const favourites = data.favourites || [];
          const favouriteIds = recommendedMeals
            .filter(meal => favourites.includes(meal.name))
            .map(meal => meal.id.toString());
          setFavouriteIds(favouriteIds);

          // Check for existing plan
          if (data.plan && data.plan.isActive) {
            setExistingPlan(data.plan);
          }
        }
      } catch (error) {
        console.warn('Error loading user data:', error);
      } finally {
        setIsLoadingPlan(false);
      }
    })();
  }, [uid]);

  /* Delete the separate favourites loading useEffect since it's now combined above */
  

  /* ----------------------------- helpers ---------------------------------- */
  const goalObj = nutritionGoals.find(g => g.id === selectedGoal);

  const toggleFood = (id: string) => {
    setSelectedFoods(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  /* toggle favourite - save to userInfo collection */
  const toggleFavouriteMeal = async (meal) => {
    if (!uid) return;
    
    const already = favouriteIds.includes(meal.id.toString());
    
    try {
      if (already) {
        // Remove from favourites
        await updateDoc(userInfoRef, {
          favourites: arrayRemove(meal.name)
        });
        setFavouriteIds(prev => prev.filter(id => id !== meal.id.toString()));
      } else {
        // Add to favourites
        await updateDoc(userInfoRef, {
          favourites: arrayUnion(meal.name)
        });
        setFavouriteIds(prev => [...prev, meal.id.toString()]);
      }
    } catch (e) {
      console.warn('Favourite error:', e);
    }
  };  

  /* Save complete plan to database */
  const savePlanToDatabase = async () => {
    if (!uid || !goalObj) return;
    
    setIsSaving(true);
    
    try {
      const meals = selectedFoods.length
        ? recommendedMeals.filter(m =>
            m.ingredients.some(i => selectedFoods.includes(i)))
        : recommendedMeals;

      const planData = {
        goalId: selectedGoal,
        goal: goalObj,
        likedFoods: selectedFoods,
        recommendedMeals: meals.slice(0, 3),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };

      // Save plan to userInfo collection under 'plan' field
      await updateDoc(userInfoRef, {
        plan: planData,
        planCreatedAt: serverTimestamp()
      });

      Alert.alert(
        'Success!',
        'Your meal plan has been saved successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reload the plan data to show the saved plan
              setExistingPlan({
                goalId: selectedGoal,
                goal: goalObj,
                likedFoods: selectedFoods,
                recommendedMeals: meals.slice(0, 3),
                isActive: true
              });
              setShowCreateNew(false);
            }
          }
        ]
      );

    } catch (error) {
      console.error('Error saving plan:', error);
      Alert.alert('Error', 'Failed to save your plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /* Start creating a new plan */
  const startNewPlan = () => {
    setShowCreateNew(true);
    setSelectedFoods([]);
    setSelectedGoal('');
    setStep(1);
  };

  /* Delete existing plan */
  const deleteExistingPlan = async () => {
    if (!uid) return;
    
    Alert.alert(
      'Delete Plan',
      'Are you sure you want to delete your current meal plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateDoc(userInfoRef, {
                'plan.isActive': false,
                planDeletedAt: serverTimestamp()
              });
              setExistingPlan(null);
            } catch (error) {
              console.error('Error deleting plan:', error);
              Alert.alert('Error', 'Failed to delete plan. Please try again.');
            }
          }
        }
      ]
    );
  };
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

  /* --------- EXISTING PLAN DISPLAY ----------- */
  const ExistingPlanView = () => {
    if (!existingPlan) return null;

    const goalObj = nutritionGoals.find(g => g.id === existingPlan.goalId) || existingPlan.goal;
    const meals = existingPlan.recommendedMeals || [];

    return (
      <View style={styles.container}>
        {/* Header with greeting */}
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={24} color="#6B7280" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileGreeting}>Hey, {firstName}</Text>
            <Text style={styles.profileSubtitle}>Your active meal plan</Text>
          </View>
          <TouchableOpacity onPress={deleteExistingPlan} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Current Goal */}
          <View style={styles.currentGoalSection}>
            <Text style={styles.sectionTitle}>Current Goal</Text>
            <View style={styles.goalCard}>
              <Text style={styles.goalIcon}>{goalObj.icon}</Text>
              <View style={styles.goalText}>
                <Text style={styles.goalTitle}>{goalObj.title}</Text>
                <Text style={styles.goalDesc}>{goalObj.desc}</Text>
              </View>
            </View>
          </View>

          {/* Daily Nutrition Goals */}
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

          {/* Your Meal Plan */}
          <View style={styles.mealsSection}>
            <Text style={styles.sectionTitle}>Your Meal Plan</Text>
            {meals.map(meal => (
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
                    <Text style={styles.addToPlanText}>View Recipe</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Action button */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            onPress={startNewPlan}
            style={[styles.nextButton, styles.createNewButton]}
          >
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={[styles.nextButtonText, styles.nextButtonTextActive]}>
              Create New Plan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* --------- LOADING VIEW ----------- */
  const LoadingView = () => (
    <View style={styles.loadingContainer}>
      <Ionicons name="restaurant-outline" size={48} color="#10B981" />
      <Text style={styles.loadingText}>Loading your meal plan...</Text>
    </View>
  );

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

  /* --------- STEP 1 : goal selection --------- */
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

  /* --------- STEP 2 : food preferences -------- */
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
        columnWrapperStyle={[styles.row, { justifyContent: 'center' }]}
        contentContainerStyle={[styles.listContent, { alignItems: 'center' }]}
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

  /* --------- STEP 3 : plan display ----------- */
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

        {/* Action buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            onPress={savePlanToDatabase}
            disabled={isSaving}
            style={[styles.nextButton, styles.savePlanButton]}
          >
            <Ionicons name="save-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={[styles.nextButtonText, styles.nextButtonTextActive]}>
              {isSaving ? 'Saving...' : 'Save Plan'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={startNewPlan}
            style={[styles.nextButton, styles.restartButton]}
          >
            <Text style={[styles.nextButtonText, styles.nextButtonTextActive]}>
              Start New Plan
            </Text>
          </TouchableOpacity>
        </View>
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
        {isLoadingPlan ? (
          <LoadingView />
        ) : existingPlan && !showCreateNew ? (
          <ExistingPlanView />
        ) : (
          <>
            {step === 1 && <GoalStep />}
            {step === 2 && <FoodStep />}
            {step === 3 && <PlanStep />}
          </>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default PlanScreen;