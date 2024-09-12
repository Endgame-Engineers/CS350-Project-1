<template>
  <div class="container">
    <video ref="video" width="300" height="50" autoplay></video>
    <label for="camera-select">Select Camera:</label>
    <select id="camera-select" v-model="selectedDeviceId" @change="startScanner">
      <option v-for="device in videoInputDevices" :key="device.deviceId" :value="device.deviceId">
        {{ device.label || `Camera ${device.deviceId}` }}
      </option>
    </select>
    <div class="search-bar">
      <input type="text" v-model="searchBar" placeholder="Search">
      <button @click="showScanner" class="camera-btn">
        <font-awesome-icon :icon="['fas', 'barcode']" />
      </button>
    </div>
<<<<<<<< HEAD:frontend/src/views/search.vue
    <div class="button-container">
      <button @click="clearSearchBar">Clear</button>
      <button @click="search">Search</button>
    </div>
    <div v-if="foodData">
      <h2>{{ foodData?.foodname }}</h2>
      <p>Protein per serving: {{ foodData?.protein_per_serv }}g</p>
      <p>Carbs per serving: {{ foodData?.carb_per_serv }}g</p>
      <p>Fat per serving: {{ foodData?.fat_per_serv }}g</p>
      <p>Grams per serving: {{ foodData?.grams_per_serv }}g</p>
      <p>Calories per serving: {{ foodData?.calories_per_serv }} kcal</p>
      <img v-if="foodData?.image" :src="foodData?.image" alt="Food Image" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

interface FoodItem {
  id: number;
  foodname: string;
  barcode: string;
  protein_per_serv: number;
  carb_per_serv: number;
  fat_per_serv: number;
  grams_per_serv: number;
  calories_per_serv: number;
}

export default defineComponent({
  name: 'App',
  data() {
    return {
      searchBar: '',
      barcode: '',
      codeReader: new BrowserMultiFormatReader(),
      videoInputDevices: [] as MediaDeviceInfo[],
      selectedDeviceId: '',
      deviceIndex: 1,
      foodData: null as FoodItem | null,
      foodList: [] as FoodItem[],
      error: '',
    };
  },
  methods: {
    async listVideoInputDevices() {
      try {
        // Request user media permission
        await navigator.mediaDevices.getUserMedia({ video: true });

        // List video input devices
        const devices = await this.codeReader.listVideoInputDevices();
        this.videoInputDevices = devices;
        if (devices.length > 0) {
          this.selectedDeviceId = devices[0].deviceId;
          this.codeReader.reset();
========
    <footer class="footer bg-light mt-auto py-3">
      <router-link to="/">
        <button class="btn btn-secondary">Home</button>
      </router-link>
      <router-link to="/Diary">
        <button class="btn btn-secondary">Diary</button>
      </router-link>
      <router-link to="/History">
        <button class="btn btn-secondary">History</button>
      </router-link>
      <router-link to="/Search">
        <button class="btn btn-secondary">Barcode Scan</button>
      </router-link>
    </footer>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  interface FoodItem {
    id: number;
    foodname: string;
    barcode: string;
    protein_per_serv: number;
    carb_per_serv: number;
    fat_per_serv: number;
    grams_per_serv: number;
    calories_per_serv: number;
  }
  
  export default defineComponent({
    name: 'App',
    data() {
      return{
        searchBar: '',
        foodData: null as FoodItem | null,
        foodList: [] as FoodItem[],
      };
    },
    methods: {
      async search(){
        try {
          const resp = await fetch(`https://carbio.fit/api/food-items/${this.searchBar}`);
          
          if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
          }
  
          const data = await resp.json();
          this.foodData = data;
        } catch (error) {
          console.error('Error fetching the API:', error);
          this.foodData = null;
>>>>>>>> aa0140f (Renamed vue files and added Login.vue):frontend/src/views/Search.vue
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        this.error = "Could not access camera. Please check permissions.";
      }
    },
    startScanner(): void {
      if (this.selectedDeviceId) {
        const videoElement = this.$refs.video as HTMLVideoElement;
        this.codeReader.reset();

        this.codeReader.decodeFromVideoDevice(this.selectedDeviceId, videoElement, (result: Result | null, error: any) => {
          if (result) {
            this.barcode = result.getText();
            this.searchBar = this.barcode;
            this.search();   
          } else if (error) {
            console.error("Error scanning barcode:", error);
          }
        });
      }
    },
    async search() {
      try {
        const resp = await fetch(`/api/food-items/${this.searchBar}`);

        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const data = await resp.json();
        this.foodData = data;
      } catch (error) {
        console.error('Error fetching the API:', error);
        this.foodData = null;
      }
    },
    clearSearchBar() {
      this.searchBar = '';
      this.foodData = null;
    },
  },
  components: {
  },
  mounted() {
    this.listVideoInputDevices().then(() => {
      console.log("Available video devices:", this.videoInputDevices);
    });
  }
});
</script>