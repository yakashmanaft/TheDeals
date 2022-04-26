<template>
  <nav class="nav w-full bg-white fixed z-10 py-2 px-4 flex items-center justify-between">
    <h1 class="text-dark text-2xl font-bold">Новый контакт</h1>
    <div @click="$router.go(-1)" class="text-blue">Отменить</div>
  </nav>
  
  <div class="max-w-screen-md mx-auto px-4 py-10">

<!--Порешать в том числе и со стилями статус и эрор месджа -->

    <!-- Status Message -->
    <div v-if="statusMsg || errorMsg" class="mb-10 p-4 bg-light-grey rounded-md shadow-lg">
      <p class="text-at-light-green">
        {{ statusMsg }}
      </p>
      <p class="text-red-500">
        {{ errorMsg }}
      </p>
    </div>

    <!-- Create -->
    <div class="mt-10 p-8 flex items-start bg-light-grey rounded-md shadow-lg">
      <!-- Form -->
      <form @submit.prevent="createWorkout" class="flex flex-col gap-y-5 w-full">

        <h1 class="text-2xl text-at-light-green">Record Workout</h1>

        <!-- Workout Name -->
        <div class="flex flex-col">
          <label for="workout-name" class="mb-1 text-sm text-at-light-green">Workout Name</label>
          <input 
            type="text" 
            required 
            class="p-2 text-gray-500 focus:outline-none" 
            id="workout-name"
            v-model="workoutName"
          >
        </div>

        <!-- Workout Type -->
        <div class="flex flex-col">
          <label for="workout-type" class="mb-1 text-sm text-at-light-green">Workout Type</label>
          <select 
            id="workout-type" 
            class="p-2 text-gray-500 focus:outline-none" 
            required
            @change="workoutChange"
            v-model="workoutType"
          >
            <option value="select-workout">Select Workout</option>
            <option value="strength">Strength Training</option>
            <option value="cardio">Cardio Training</option>
          </select>
        </div>

        <!-- Srength Training Inputs -->
        <div v-if="workoutType === 'strength'" class="flex flex-col gap-x-y-4"> 
          <div 
            class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row" 
            v-for="(item, index) in exercises"
            :key="index"
          >
            <div class="flex flex-col md:w-1/3">
              <label for="exercise-name" class="mb-1 text-sm text-at-light-green">Exercise</label>
              <input 
                type="text" 
                required 
                class="p-2 w-full text-gray-500 focus:outeline-none"
                v-model="item.exercise"
              >
            </div>
            <div class="flex flex-col flex-1">
              <label for="sets" class="mb-1 text-sm text-at-light-green">Sets</label>
              <input 
                type="text" 
                required 
                class="p-2 w-full text-gray-500 focus:outeline-none"
                v-model="item.sets"
              >
            </div>
            <div class="flex flex-col flex-1">
              <label for="reps" class="mb-1 text-sm text-at-light-green">Reps</label>
              <input 
                type="text" 
                required 
                class="p-2 w-full text-gray-500 focus:outeline-none"
                v-model="item.reps"
              >
            </div>
            <div class="flex flex-col flex-1">
              <label for="weight" class="mb-1 text-sm text-at-light-green">Weight (LB's)</label>
              <input 
                type="text" 
                required 
                class="p-2 w-full text-gray-500 focus:outeline-none"
                v-model="item.weight"
              >
            </div>
            <img 
              src="@/assets/images/trash-light-green.png" 
              class="h-4 w-auto absolute -left-5 cursor-pointer" 
              alt=""
              @click="deleteExercise(item.id)"
            >
          </div>
            <button 
              @click="addExercise"
              type="button" 
              class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
            >
              Add Exercise
            </button>
        </div>

        <!-- Cardio Inputs -->
        <div v-if="workoutType === 'cardio'" class="flex flex-col gap-x-y-4"> 
          <div 
            class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row" 
            v-for="(item, index) in exercises"
            :key="index"
          >
            <div class="flex flex-col md:w-1/3">
              <label for="cardio-type" class="mb-1 text-sm text-at-light-green">Type</label>
              <select 
                id="cardio-type" 
                class="p-2 w-full text-gray-500 focus:outline-none"
                v-model="item.cardioType"
              >
                <option value="#">Select Type</option>
                <option value="run">Runs</option>
                <option value="walk">Walk</option>
              </select>
            </div>
            <div class="flex flex-col flex-1">
              <label for="distance" class="mb-1 text-sm text-at-light-green">Distance</label>
              <input 
                type="text" 
                required 
                class="p-2 w-full text-gray-500 focus:outeline-none"
                v-model="item.distance"
              >
            </div>
            <div class="flex flex-col flex-1">
              <label for="duration" class="mb-1 text-sm text-at-light-green">Duration</label>
              <input 
                type="text" 
                required 
                class="p-2 w-full text-gray-500 focus:outeline-none"
                v-model="item.duration"
              >
            </div>
            <div class="flex flex-col flex-1">
              <label for="pace" class="mb-1 text-sm text-at-light-green">Pace</label>
              <input 
                type="text" 
                required 
                class="p-2 w-full text-gray-500 focus:outeline-none"
                v-model="item.pace"
              >
            </div>
            <img 
              @click="deleteExercise(item.id)"
              src="@/assets/images/trash-light-green.png" 
              class="h-4 w-auto absolute -left-5 cursor-pointer" 
              alt=""
            >
          </div>
            <button
              @click="addExercise" 
              type="button" 
              class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
            >
              Add Exercise
            </button>
        </div>

          <button 
            type="submit" 
            class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green"
          >
            Record Workout
          </button>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
      name: "createContact",
      setup() {
        return {

        }
      }
    
  }
</script>

<style lang="scss" scoped>
  .nav {
    height: 76px;
    padding: 0.5rem 1rem;

  }
</style>