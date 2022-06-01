<template>
  <div class="container text-dark">
    <!-- Navigation -->
    <nav class="fixed z-10 bg-white nav container py-2 px-4 flex gap-4 items-center sm:flex-row place-content-between">
      <div class="flex items-center">
        <div class="text-blue" v-if="edit" @click="cancelEdit">
          Отмена
        </div>
        <div v-else v-show="user" @click="$router.go(-1)" class="arrow-back">
          <img src="@/assets/images/common/arrow-right.svg" class="arrow-back_icon" alt="">
          <p class="text-dark text-2xl font-bold ml-2 arrow-back_text">Назад</p>
        </div>
      </div>
      <!-- а как же if dataLoaded?? -->
      <div v-if="edit" class="justify-self-end text-blue font-bold" @click="update">
        Готово
      </div>
      <div v-else class="justify-self-end text-blue" @click="editMode">
        <p>Править</p>
      </div>
    </nav>


    <!-- View current deal -->
    <div class="max-w-screen-sm mx-auto px-4 py-10">
      <!-- App Msg -->
      <div 
        v-if="statusMsg || errorMsg" 
        class="fixed z-20 flex left-0 top-0 w-full h-16 mb-10 px-8 py-4 rounded-b-md shadow-md bg-white items-center place-content-between"
      >
        <div>
          <p v-if="statusMsg" class="text-green">
            {{ statusMsg }}
            <!-- Контакт успешно обновлен -->
          </p>
          <p class="text-red-500">
            {{ errorMsg }}
          </p>
        </div>
        <div class="text-dark-gray" @click="statusMsg = !statusMsg">
          Оk
        </div>
      </div>

      <!--  -->
      <div v-if="dataLoaded" class="mt-10">
        <p>Дело № {{ data.id }}</p>
        <p>Тип дела: {{ translateDealType(data.dealType) }}</p>
        <p>Заказчик: {{ getNameId(data.contactID) }}</p>
        <p>Сумма заказа: 2579,00 руб.</p>
        <p>Оплачено: 1000,00 руб.</p>
        <p>Задолженность: 1579,00 руб.</p>
        <!-- General Workout Info -->
        <div 
          class="flex flex-col items-center p-8 rounded-md shadow-md bg-light-grey relative "
        >
        </div>

        <!-- Update -->
        <button 
          @click="update"
          v-if="edit"
          type="button"
          class="mt-10 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
        >
        Update Workout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { supabase } from '../supabase/init';
import { useRoute, useRouter } from 'vue-router';
import store from '../store/index';
import { uid } from 'uid';

import { getContactInfo } from '../supabase/getContactInfoFromDB';
import { showNameByID } from '../helpers/compareNameByID';
import { translateDealType } from '../helpers/translators';

export default {
  name: "view-deal",
  setup() {
    // Create data / vars
    const data = ref(null);
    const dataLoaded = ref(null);
    const errorMsg = ref(null);
    const statusMsg = ref(null);
    const route = useRoute();
    const router = useRouter();
    const user = computed(() => store.state.user)

    // Get current Id of route
    const currentId = route.params.dealId;

    // Get workout data
    const getData = async () => {
      try {
        const { data: deals, error } = await supabase.from('deals').select('*').eq('id', currentId);
        if(error) throw error;
        data.value = deals[0];
        dataLoaded.value = true;
        console.log(data.value)
      } catch (error) {
        errorMsg.value = error.message;
        setTimeout(() => {
          errorMsg.value = false;
        }, 5000);
      }
    };

    getData();

    // Delete workout
    const deleteWorkout = async () => {
      try {
        const { error } = await supabase.from('workouts').delete().eq('id', currentId);
        if (error) throw error;
        router.push({ name: 'Orders' })
      } catch (error) {
        errorMsg.value = `Error: ${error.message}`
        setTimeout(() => {
          errorMsg.value = false;
        }, 5000);
      }
    }

    // Edit mode
    const edit = ref(null);

    const editMode = () => {
      edit.value = !edit.value;
    }

    // Cancel editMode & cancel all changes
    const cancelEdit = () => {
      getData();
      edit.value = !edit.value;
    }

    // Get contactInfo from DB MyContacts
    const contactInfo = ref([]);
    getContactInfo(contactInfo, errorMsg, dataLoaded)
    
    
    // Show name of contact comparing by ID
    const getNameId = (contactID) => {
      // compare contactID form deals with contactInfo from MyContacts
      return showNameByID(contactInfo, contactID)
    }

    // Add exercise
    const addExercise = () => {
      if(data.value.workoutType === 'strength') {
        data.value.exercises.push({
          id: uid(),
          exercise: '',
          sets: '',
          reps: '',
          weight: '',
        });
        return
      }
      data.value.exercises.push({
        id: uid(),
        cardioType: '',
        distance: '',
        duration: '',
        pace: '',
      })
    }

    // Delete exercise
    const deleteExercise = (id) => {
      if(data.value.exercises.length > 1) {
        data.value.exercises = data.value.exercises.filter(exercise => exercise.id !== id);
        return;
      }
      errorMsg.value = 'Error. Cannot remove, need to at least have one exercise';
      setTimeout(() => {
        errorMsg.value = false;
      }, 5000);
    }

    // Update Workout
    const update = async () => {
      try {
        const { error } = await supabase.from('workouts').update({
          workoutName: data.value.workoutName,
          exercises: data.value.exercises
        }).eq('id', currentId);
        if(error) throw error;
        edit.value = false;
        statusMsg.value = 'Дело успешно обновили!'
        setTimeout(() => {
          statusMsg.value = false;
        }, 5000);
      } catch (error) {
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {
          errorMsg.value = false;
        }, 5000);
      }
    }

    return {
      statusMsg, data, dataLoaded, errorMsg, edit, cancelEdit, editMode, user, deleteWorkout, addExercise, deleteExercise, update, getNameId, translateDealType
    };
  },
};
</script>
<style lang="scss" scoped>
  .arrow-back {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .nav {
    height: 76px;
    padding: 0.5rem 1rem;
    // background-color: #ccc;
  }

  .arrow-back_icon {
    width: 60%;
    height: 60%;
    transform: rotate(180deg);
  }

  .event-item,
  .phone-item {
    padding: 10px 0;
  }

  .event-item:nth-child(n+2),
  .phone-item:nth-child(n+2) {
    border-top: 1px solid #f1f1f1;
  }

  .border-bottom {
    border-bottom: 1px solid #f1f1f1;
  }


  .icon-wrapper {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-wrapper img{
    width: 100%;
    height: 100%;
  }

  .webkit {
    -webkit-appearance:none;
  }

  .custom-checkbox {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  .custom-checkbox+label {
    display: inline-flex;
    align-items: center;
    user-select: none;
  }
  .custom-checkbox+label::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    flex-grow: 0;
    border: 1px solid #838383;
    border-radius: 0.25em;
    margin-right: 0.5em;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50% 50%;
  }

  .custom-checkbox:checked+label::before {
    border-color: #4785E7;
    background-color: #4785E7;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
  }
</style>
