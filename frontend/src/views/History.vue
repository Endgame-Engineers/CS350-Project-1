<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { FoodItem, MealLog } from '@/models/Models';
import router from '@/router';

interface ExtendedMealLog extends MealLog {
  foodItem: FoodItem;
}
interface ExtendedFoodItem extends FoodItem{
  mealType: string;
}

export default defineComponent({
  name: 'HistoryPage',
  setup() {
    const mealLogs = ref<ExtendedMealLog[]>([]);
    let newFoodItem = reactive({
      foodname: '',
      barcode: '',
      protein_per_serv: 0,
      carb_per_serv: 0,
      fat_per_serv: 0,
      calories_per_serv: 0,
      image: '',
      mealType: '',
    });
    const newMeal = reactive({
      mealtype: '',
      dateadded: '',
      barcode: '',
      servingconsumed: 1,
    });

    const routeToSearch = (mealType : string) => {
      console.log("HISTORY MEALTYPE ", mealType);
      router.push({ path: '/search', query: { mealType: mealType } });      
    }

    onMounted(async () => {
      const route = useRoute();
      const response = await axios.get('/api/user/logs?all=true');
      mealLogs.value = await Promise.all(response.data);
      console.log(mealLogs.value);

      const item = route.query.item as string;

      if(item){
        newFoodItem = JSON.parse(item);
        if(newFoodItem){
          newMeal.mealtype = newFoodItem.mealType;
          newMeal.dateadded = new Date().toISOString();
          newMeal.barcode = newFoodItem.barcode;
        }
      }
    });

    return {
      mealLogs,
      newMeal,
      routeToSearch,
    };
  }
});
</script>


<template>
  <div class="row">
    <div v-for="mealType in ['Breakfast', 'Lunch', 'Dinner']" :key="mealType" class="col-12 col-md-4 mb-3">
      <div class="position-relative p-3">
        <button @click="routeToSearch(mealType)" class="btn bg-primary position-absolute top-0 end-0 m-2 p-0"><font-awesome-icon :icon="['fas', 'circle-plus']" size="2x" /></button>
        <h2 class="text-center">{{ mealType }}</h2>
        <template v-for="item in mealLogs" :key="item.barcode + item.dateadded">
          <div v-if="item.mealtype.toLowerCase().includes(mealType.toLowerCase())" class="card mb-3">
            <div class="card-body">
              <img :src="item.foodItem.image" alt="food image" class="img-thumbnail">
              <h5 class="card-title">
                {{ item.foodItem.foodname }}
              </h5>
              <h5 class="card-title">
                {{ item.dateadded }}
              </h5>
              <p class="card-text">
                {{ item.servingconsumed }} servings of {{ item.foodItem.barcode }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>