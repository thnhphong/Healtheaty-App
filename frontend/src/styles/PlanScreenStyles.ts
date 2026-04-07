import Colors from '../constants/Colors';
import { StyleSheet } from 'react-native';
import { width } from '../screens/PlanScreen';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.grayGhost,
  },
  gradientContainer: {
    flex: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.slate800,
  },
  skipText: {
    fontSize: 14,
    color: Colors.slate500,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: Colors.emerald,
  },
  stepInactive: {
    backgroundColor: Colors.slate200,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepTextActive: {
    color: 'white',
  },
  stepTextInactive: {
    color: Colors.slate500,
  },
  stepLine: {
    width: 48,
    height: 2,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: Colors.emerald,
  },
  stepLineInactive: {
    backgroundColor: Colors.slate200,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.slate800,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.slate500,
  },
  goalsList: {
    flex: 1,
    marginBottom: 20,
  },
  goalItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.slate200,
    marginBottom: 12,
  },
  goalItemSelected: {
    borderColor: Colors.emerald,
    backgroundColor: Colors.backgroundEmerald,
  },
  goalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  goalText: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.slate800,
    marginBottom: 4,
  },
  goalDesc: {
    fontSize: 14,
    color: Colors.slate500,
  },
  foodGrid: {
    flex: 1,
    marginBottom: 20,
  },
  foodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  foodItem: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100, // ensures nice consistent size
    flex: 1,
    marginHorizontal: 4,
    elevation: 2, // Android shadow
    shadowColor: Colors.black, // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  foodItemSelected: {
    backgroundColor: '#D1FAE5',
    borderColor: Colors.emerald,
  },
  foodIcon: {
    fontSize: 28, marginBottom: 8
  },
  foodName: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14, color: Colors.slate800
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextButtonActive: {
    backgroundColor: Colors.slate800,
  },
  nextButtonInactive: {
    backgroundColor: Colors.slate200,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextActive: {
    color: 'white',
  },
  nextButtonTextInactive: {
    color: Colors.slate500,
  },
  restartButton: {
    backgroundColor: Colors.emerald,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileGreeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.slate800,
  },
  profileSubtitle: {
    fontSize: 14,
    color: Colors.slate500,
  },
  nutritionSection: {
    marginBottom: 24,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  nutritionCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.slate800,
  },
  mealsSection: {
    marginBottom: 20,
  },
  mealCard: {
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.slate800,
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: Colors.slate500,
  },
  mealStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mealStat: {
    fontSize: 14,
    color: Colors.slate500,
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealTypeTag: {
    backgroundColor: Colors.slate100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealTypeText: {
    fontSize: 12,
    color: Colors.slate500,
    textTransform: 'capitalize',
  },
  addToPlanText: {
    fontSize: 14,
    color: Colors.emerald,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 80,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },

});
