export interface FoodItem {
  foodname: string;
  barcode: string;
  protein_per_serv: number;
  carb_per_serv: number;
  fat_per_serv: number;
  calories_per_serv: number;
  image: string;
}

export interface MealLog {
  mealtype: string;
  dateadded: string;
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
  height: number;
  weight: number;
  caloriegoal: number;
  activitylevel: number;
  age: number;
  sex: number;
  dateofbirth: Date;
  updatedon: Date;
}