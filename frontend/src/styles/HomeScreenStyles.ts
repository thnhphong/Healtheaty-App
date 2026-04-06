import Colors from '../../constants/Colors';
// frontend/styles/HomeScreenStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  profileSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  calorieCard: {
    backgroundColor: Colors.warning,
    borderRadius: 20,
    padding: 18,
    margin: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calorieTextContainer: {
    flex: 1,
  },
  calorieHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  calorieCircle: {
    alignItems: 'center',
    marginBottom: 15,
  },
  calorieNumber: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: 'bold',
  },
  calorieLabel: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  calorieSubtext: {
    color: Colors.white,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
  },
  calendarContainer: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDay: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayToday: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 14,
    color: Colors.text,
  },
  calendarDayTodayText: {
    color: Colors.white,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLightAlt,
  },
  navItem: {
    padding: 10,
  },
  navItemCenter: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 15,
  },
  icon:{
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  // Meal Log Styles
  mealLogContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealLogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealLogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: Colors.text,
  },
  mealLogDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  mealItem: {
    marginBottom: 12,
  },
  mealItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.backgroundDark,
    borderRadius: 8,
  },
  mealItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  mealItemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.grayBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealItemInfo: {
    flex: 1,
  },
  mealItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  mealItemBrand: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  mealItemServing: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  mealItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  mealItemTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.borderLightAlt,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  mealItemTagText: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 2,
  },
  mealItemCalories: {
    alignItems: 'center',
  },
  mealItemCalorieNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  mealItemCalorieLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyMealLog: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyMealLogText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  emptyMealLogSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  calendarDaySelected: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDaySelectedText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});