<template>
<!-- Пока View называется Orders... по логике больше подходит Deals (дела... сделки...), а внутри разделяется на 1. order, 2. supply, 3. personal -->

  <div class="orders">
    <Navigation :title="title" class="fixed z-10 bg-white"/>  

    <!-- Добавление нового заказа -->
    <router-link 
      class="fixed bottom-5 right-5 w-14 h-14 bg-blue rounded-full flex items-center justify-center"
      :to="{ name: 'Create' }"
    >
      <img src="../assets/images/common/icon-plus.svg" alt="">
    </router-link>

    <!-- Временно создание поместим сюда -->
    <!-- <router-link class="cursor-pointer" :to="{ name: 'Create' }">Создать заказ</router-link> -->

    <!-- Когда Data загружена -->
    <div v-if="dataLoaded" class="container pt-20 px-4">
      
      <!-- No Data -->
      <div v-if="data.length === 0" class="w-full flex flex-col items-center">
        <h1 class="text-2xl">Looks empty here...</h1>
        <router-link 
          class="mt-6 py-2 px-6 rounded-sm text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green" 
          :to="{ name: 'Create' }"
        >
          Create Workout
        </router-link>
      </div>

      <!-- Data -->
      <div 
        v-else 
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <router-link 
          class="flex flex-col items-center bg-light-grey p-8 shadow-md cursor-pointer"
          :to="{ name: 'View-Workout', params: { workoutId: workout.id } }"
          v-for="(workout, index) in data"
          :key="index"
        >
          <!-- Cardio Img -->
          <img 
            v-if="workout.workoutType === 'cardio'"
            src="@/assets/images/running-light-green.png" 
            class="h-24 w-auto" 
            alt=""
          />

          <!-- Strength Training -->
          <img 
            v-else
            src="@/assets/images/dumbbell-light-green.png" 
            class="h-24 w-auto" 
            alt=""
          />

          <p 
            class="mt-6 py-1 px-3 text-xs text-white bg-at-light-green shadow-md rounded-lg"
          >
            {{ workout.workoutType }}
          </p>

          <h1 class="mt-8 mb-2 text-center text-xl text-at-light-green">
            {{ workout.workoutName }}
          </h1>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'

import { ref } from 'vue';
import { supabase } from '../supabase/init';
import { useRouter } from 'vue-router';

export default {
  name: "Orders",
  components: {
    Navigation
  },
  setup() {
    // Create data / vars
    const data = ref([]);
    const dataLoaded = ref(null);

    // Get data
    const getData = async () => {
      try {
        const { data: workouts, error } = await supabase.from('workouts').select('*');
        if(error) throw error;
        data.value = workouts;
        dataLoaded.value = true;
      } catch (error) {
        console.warn(error.message);
      }
    }

    // Run data function
    getData();


    const router = useRouter();
    const title = router.currentRoute._value.meta.translation;
    // console.log(router)

    return {
      data, dataLoaded, title
    };
  },
};
</script>

<style scoped>
  .orders {
    height: 100vh;
  }
</style>
