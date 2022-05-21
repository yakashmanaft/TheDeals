<template>
<!-- Пока View называется Orders... по логике больше подходит Deals (дела... сделки...), а внутри разделяется на 1. order, 2. supply, 3. personal -->

  <div class="orders">
    <Navigation :title="title" class="fixed z-10 bg-white"/>  

    <!-- Добавление нового заказа -->
    <router-link 
      class="fixed bottom-5 right-5 w-14 h-14 bg-blue rounded-full flex items-center justify-center"
      :to="{ name: 'CreateDeal' }"
    >
      <img src="@/assets/images/common/icon-plus.svg" alt="">
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

      <!-- Проба -->


      <div 
        v-else 
        class="grid grid-cols-1 gap-6"
      >
        <!-- Фильтры по делам -->
        <div class="flex deal-filter-wrapper">
          
            <div class="deal-filter-item">
              <input checked type="radio" name="deal-filter" id="in-process" value="deal-in-progress"> 
              <label class="flex text-sm px-2 p-1 rounded-2xl" for="in-process">
                <div class="deal-filter-item_text">В процессе</div> 
                <div class="deal-filter-item_count ml-1">2</div>
              </label>
            </div>
            <div class="deal-filter-item">
              <input type="radio" name="deal-filter" id="in-delivery" value="deal-in-delivery"> 
              <label class="flex text-sm px-2 p-1 rounded-2xl" for="in-delivery">
                <div class="deal-filter-item_text">В доставке</div> 
                <div class="deal-filter-item_count ml-1">0</div>
              </label>
            </div>
            <div class="deal-filter-item">
              <input type="radio" name="deal-filter" id="debt" value="deal-debt"> 
              <label class="flex text-sm px-2 p-1 rounded-2xl" for="debt">
                <div class="deal-filter-item_text">Долг</div> 
                <div class="deal-filter-item_count ml-1">1</div>
              </label>
            </div>
            <div class="deal-filter-item">
              <input type="radio" name="deal-filter" id="complete" value="deal-complete"> 
              <label class="flex text-sm px-2 p-1 rounded-2xl" for="complete">
                <div class="deal-filter-item_text">Завершен</div>
                <div class="deal-filter-item_count ml-1">1</div>
              </label>
            </div>
            <div class="deal-filter-item">
              <input type="radio" name="deal-filter" id="cancelled" value="deal-cancelled"> 
              <label class="flex text-sm px-2 p-1 rounded-2xl" for="cancelled">
                <div class="deal-filter-item_text">Отменен</div>
                <div class="deal-filter-item_count ml-1">1</div>
              </label>
            </div>

          
        </div>

        <!-- item deal -->
        <div class="flex flex-col rounded-md bg-light-grey">
          <span>Заказ</span>
          <div>
            <span>Исполнить до 31.05.2022</span>  
            <span>Осталось 10 дней</span>  
          </div>
          <!-- Иконки предмета заказа -->
          <div class="relative deal-subject_item">
            <!-- item -->
            <div class="deal-subject_item-img absolute top-0">
              <img src="../assets/images/deals/orders/wedding-cake.png" alt=""> 
            </div>
            <!-- item -->
            <div class="deal-subject_item-img absolute top-0 left-7">
              <img src="../assets/images/deals/orders/cake.png" alt=""> 
            </div>
            <!-- item -->
            <div class="deal-subject_item-img absolute top-0 left-14">
              <img src="../assets/images/deals/orders/cupcake.png" alt=""> 
            </div>
          </div>
          Оплачено
          В процессе
        </div>

        <!-- item deal -->
        <div class="flex flex-col rounded-md bg-light-grey">
          <span>Заказ</span>
          <div>
            <span>Исполнить до 31.05.2022</span>  
            <span>Осталось 10 дней</span>  
          </div>
          <!-- Иконки предмета заказа -->
          <div class="relative deal-subject_item">
            <!-- item -->
            <div class="deal-subject_item-img absolute top-0">
              <img src="../assets/images/deals/orders/wedding-cake.png" alt=""> 
            </div>
            <!-- item -->
            <div class="deal-subject_item-img absolute top-0 left-7">
              <img src="../assets/images/deals/orders/cake.png" alt=""> 
            </div>
            <!-- item -->
            <div class="deal-subject_item-img absolute top-0 left-14">
              <img src="../assets/images/deals/orders/cupcake.png" alt=""> 
            </div>
          </div>
          Частично оплачено
          В процессе
        </div>

        <!-- item deal -->
        <div class="flex flex-col rounded-md bg-light-grey">
          <span>Заказ</span>
          <div>
            <span>Исполнить до 31.05.2022</span>  
            <span>Осталось 10 дней</span>  
          </div>
          <!-- Иконки предмета заказа -->
          <div class="relative deal-subject_item">
            <!-- item -->
            <div class="deal-subject_item-img absolute top-0">
              <img src="../assets/images/deals/orders/wedding-cake.png" alt=""> 
            </div>
            <!-- item -->
            <div class="deal-subject_item-img absolute top-0 left-7">
              <img src="../assets/images/deals/orders/cake.png" alt=""> 
            </div>
            <!-- item -->
            <div class="deal-subject_item-img absolute top-0 left-14">
              <img src="../assets/images/deals/orders/cupcake.png" alt=""> 
            </div>
          </div>
          Не оплачен
          В процессе
        </div>

        <router-link 
          class="flex flex-col items-center bg-light-grey p-8 shadow-md cursor-pointer"
          :to="{ name: 'View-Deal', params: { dealId: deal.id } }"
          v-for="(deal, index) in data"
          :key="index"
        >
          <!-- Cardio Img -->
          <img 
            v-if="deal.workoutType === 'cardio'"
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
            {{ deal.workoutType }}
          </p>

          <h1 class="mt-8 mb-2 text-center text-xl text-at-light-green">
            {{ deal.workoutName }}
          </h1>
        </router-link>
      </div>


      <!-- Проверка парсит ли данные из deals -->
      <div class="flex flex-col">
        <router-link
          :to="{ name: 'View-Deal', params: { dealId: deal.id } }"
          v-for="(deal, index) in list"
          :key="index"
        >
          <div>
            <p>{{ deal.contactID }}</p>
            <p>{{ deal.dealType }}</p>
            <p>{{ deal.ordersList }}</p>
          </div>
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
  name: "Deals",
  components: {
    Navigation
  },
  setup() {
    // Create data / vars
    const data = ref([]);
    const list = ref([]);
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

    // Get deals
    const getDeals = async () => {
      try {
        const { data: deals, error } = await supabase.from('deals').select('*');
        if(error) throw error;
        list.value = deals;
        dataLoaded.value = true;
      } catch (error) {
        console.warn(error.message);
      }
    }

    // Run getDeals function
    getDeals();

    const router = useRouter();
    const title = router.currentRoute._value.meta.translation;
    // console.log(router)

    return {
      data, list, dataLoaded, title
    };
  },
};
</script>

<style scoped>
  .orders {
    height: 100vh;
  }

  .deal-subject_item {
    height: 50px;
  }

  .deal-subject_item-img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #f1f1f1;
    border-radius: 100%;
  }

  .deal-subject_item-img img {
    width: 80%;
    height: 80%;
  }

  .deal-filter-wrapper {
    overflow-x: scroll;
    padding: 10px 0;
    -ms-overflow-style: none;
  }

  .deal-filter-wrapper::-webkit-scrollbar {
      width: 0;
      height: 0;
  }

  .deal-filter-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    margin-left: 10px;
    color: #3d3d3d;
  }

  .deal-filter-item:first-child {
    margin-left: 0px;
  }

  input[type="radio"] {
    display: none;
  }

  input[type="radio"]:checked + label {
    background:#4785E7;
  }

  input[type="radio"] + label {
    border: 1px solid #f1f1f1;
  }

  .deal-filter-item_count {
    text-align: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  input[type="radio"] + label .deal-filter-item_count{
    background: #4785E7;
    color: #fff;
  }

  input[type="radio"]:checked + label .deal-filter-item_text {
    color: #fff
  }

  input[type="radio"]:checked + label .deal-filter-item_count {
    background: #fff;
    color: #4785E7;
  }
</style>
