import Colors from '../../constants/Colors';
// frontend/styles/HistoryScreenStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderExtraSoft,
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.borderLightAlt,
    borderRadius: 25,
    padding: 3,
  },
  
  viewToggleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  viewToggleButtonActive: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.text,
  },
  
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  
  filterButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  
  filterButtonTextActive: {
    color: Colors.white,
  },
  
  content: {
    flex: 1,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  
  mealListContainer: {
    paddingHorizontal: 20,
  },
  
  mealItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  mealItemContent: {
    flexDirection: 'row',
    padding: 15,
  },
  
  mealItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  
  mealItemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.borderLightAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  
  mealItemInfo: {
    flex: 1,
  },
  
  mealItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  
  mealItemBrand: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  
  mealItemServing: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  
  mealItemDate: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  
  mealItemActions: {
    alignItems: 'flex-end',
  },
  
  mealItemCalories: {
    alignItems: 'center',
    marginBottom: 10,
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
  
  mealItemButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  
  actionButton: {
    padding: 5,
  },
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 15,
    marginBottom: 5,
  },
  
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  
  // Analytics Styles
  analyticsContainer: {
    paddingHorizontal: 20,
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  chartContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  
  insightCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  
  insightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});