export interface FoodItem {
  foodname: string;
  barcode: string;
  protein_per_serv: number;
  carb_per_serv: number;
  fat_per_serv: number;
  calories_per_serv: number;
  image: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Water';

export interface MealLog {
  mealtype: MealType;
  dateadded?: Date;
  barcode: string;
  servingconsumed: number;
}

export interface ErrorMessage {
  message: string;
  type: string;
}

export interface SearchResult {
  products: FoodItem[];
  page: number;
  page_count: number;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  uuid: string;
  lastlogin: Date;
  providername: string;
  providerid: string;
  profilepic: string;
  profilecreated: boolean;
}

export interface UserStat {
  userid?: number;
  height: number | null;
  weight: number | null;
  goal: number;
  caloriegoal: number | null;
  activitylevel: number
  proteinpercentage: number;
  fatpercentage: number;
  carbpercentage: number;
  proteingrams: number;
  fatgrams: number;
  carbgrams: number;
  sex: number;
  dateofbirth: Date;
  updatedon: Date;
}

export interface ExtendedMealLog extends MealLog {
  id: number;
  foodItem?: FoodItem;
}

export interface ActivityLog {
  id?: number;
  dateadded: Date;
  userid: number;
  activityid: number;
  durationminutes: number;
  activity?: Activity;
  caloriesburned?: number;
}

export interface Activity {
  id?: number;
  activity: string;
  MET: number;
  description: string;
}