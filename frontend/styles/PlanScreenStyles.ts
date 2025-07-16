import { StyleSheet } from 'react-native';
import { width } from '../screens/PlanScreen';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    shadowColor: '#000',
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
    color: '#1F2937',
  },
  skipText: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#10B981',
  },
  stepInactive: {
    backgroundColor: '#E5E7EB',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepTextActive: {
    color: 'white',
  },
  stepTextInactive: {
    color: '#6B7280',
  },
  stepLine: {
    width: 48,
    height: 2,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#10B981',
  },
  stepLineInactive: {
    backgroundColor: '#E5E7EB',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  goalsList: {
    flex: 1,
    marginBottom: 20,
  },
  goalItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  goalItemSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
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
    color: '#1F2937',
    marginBottom: 4,
  },
  goalDesc: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100, // ensures nice consistent size
    flex: 1,
    marginHorizontal: 4,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  foodItemSelected: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  foodIcon: {
    fontSize: 28, marginBottom: 8
  },
  foodName: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14, color: '#374151'
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextButtonActive: {
    backgroundColor: '#1F2937',
  },
  nextButtonInactive: {
    backgroundColor: '#E5E7EB',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextActive: {
    color: 'white',
  },
  nextButtonTextInactive: {
    color: '#9CA3AF',
  },
  restartButton: {
    backgroundColor: '#10B981',
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
    backgroundColor: '#F3F4F6',
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
    color: '#1F2937',
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    color: '#1F2937',
  },
  mealsSection: {
    marginBottom: 20,
  },
  mealCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#1F2937',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  mealStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mealStat: {
    fontSize: 14,
    color: '#6B7280',
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealTypeTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealTypeText: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  addToPlanText: {
    fontSize: 14,
    color: '#10B981',
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
