<template>
    <!-- Parent container for the calendar month -->
    <div class="calendar-month">
       
      <!-- The calendar header -->
      <div class="calendar-month-header">
        
        <!-- Month -->
        <CalendarDateIndicator 
          :selected-date="selectedDate"
          class="calendar-month-header-selected-month"
        />

        <!-- Pagination -->
        <CalendarDateSelector 
          :current-date="today"
          :selected-date="selectedDate"
          @dateSelected="selectDate"
        />
      </div>
  
      <!-- Calendar grid header -->
      <CalendarWeekdays />
  
      <!-- Calendar grid -->
      <ol class="days-grid">

        <!--  -->
        <CalendarMonthDayItem 
          v-for="day in days"
          :key="day.date"
          :day="day"
          :is-today="day.date === today"
        />
      </ol>

    </div>
  </template>

<script>
  import { defineComponent, computed, ref, watch } from 'vue';

  //
  import dayjs from "dayjs";
  import weekday from "dayjs/plugin/weekday";
  import weekOfYear from "dayjs/plugin/weekOfYear";
  import 'dayjs/locale/ru';

  //
  import CalendarDateIndicator from './CalendarDateIndicator'
  import CalendarDateSelector from './CalendarDateSelector.vue'
  import CalendarWeekdays from './CalendarWeekdays.vue'
  import CalendarMonthDayItem from './CalendarMonthDayItem.vue'

  //
  dayjs.extend(weekday);
  dayjs.extend(weekOfYear);

  export default defineComponent({
    
    name: 'CalendarMonth',
    emits: [],
    props: {},
    components: {

      //
      CalendarDateIndicator,
      CalendarDateSelector,
      CalendarWeekdays,
      CalendarMonthDayItem
    },
    setup(props, { emit }) {

      //
      const selectedDate = ref(dayjs())
      console.log(selectedDate.value)
      //
      const today = dayjs().locale('ru').format('YYYY-MM-DD')
      
      //
      const month = ref(Number(selectedDate.value.format("M")));

      //
      const year = ref(Number(selectedDate.value.format("YYYY")));

      //
      const selectDate = (newSelectedDate) => {
        selectedDate.value = newSelectedDate
        // console.log(selectedDate.value)
      }

      //
      const getWeekday = (date) => {
        return dayjs(date).weekday();
      }

      //
      const numberOfDaysInMonth = computed(() => dayjs(selectedDate.value).daysInMonth())
      // console.log(`numberOfDaysInMonth: ${numberOfDaysInMonth.value}`)

      //
      const currentMonthDays = computed(() => {
        return [...Array(numberOfDaysInMonth.value)].map((day, index) => {
          return {
            date: dayjs(`${year.value}-${month.value}-${index + 1}`).format("YYYY-MM-DD"),
            isCurrentMonth: true
          }
        })
      })
      // console.log(currentMonthDays.value)

      //
      const previousMonthDays = computed(() => {

        const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays.value[0].date)
        
        const previousMonth = dayjs(`${year.value}-${month.value}-01`).subtract(
          1,
          "month"
        );

        // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
        const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday ? firstDayOfTheMonthWeekday - 1 : 6;

        const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays.value[0].date).subtract(visibleNumberOfDaysFromPreviousMonth, "day").date();

        return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
          return {
            date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index}`
            ).format("YYYY-MM-DD"),
            isCurrentMonth: false
          }
        })
      })

      //
      const nextMonthDays = computed(() => {

        const lastDayOfTheMonthWeekday = getWeekday(`${year.value}-${month.value}-${currentMonthDays.value.length}`)

        const nextMonth = dayjs(`${year.value}-${month.value}-01`).add(1, "month");

        const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday ? 7 - lastDayOfTheMonthWeekday : lastDayOfTheMonthWeekday
        
        return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
          return {
              date: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format("YYYY-MM-DD"),
              isCurrentMonth: false
          }
        })
      })

      //
      const days = computed(() => {
        return [
          ...previousMonthDays.value,
          ...currentMonthDays.value,
          ...nextMonthDays.value
        ]
      })

      watch(days, () => {

        month.value = Number(selectedDate.value.format("M"))
        year.value = Number(selectedDate.value.format("YYYY"))
        // console.log(selectedDate.value)
        // console.log(year.value)
        // console.log(month.value)
      })

      return {

        selectedDate, today, selectDate, getWeekday, days, month, year, numberOfDaysInMonth, currentMonthDays, previousMonthDays, nextMonthDays
      }
    }
  })
</script>

<style scoped>
  .calendar-month {
    position: relative;
    /* background-color: var(--ion-color-light); */
    /* border: solid 1px var(--ion-color-medium); */
  }
  .calendar-month-header {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 10px;
  }
  .day-of-week {
    color: var(--ion-color-medium);
    font-size: 18px;
    background-color: #fff;
    padding-bottom: 5px;
    padding-top: 10px;
  }

  .day-of-week,
  .days-grid {
    display: grid;
    padding: 0;
    grid-template-columns: repeat(7, 1fr);
  }

  .day-of-week > * {
    text-align: right;
    padding-right: 5px;
  }

  .days-grid {
    height: calc(100vh - 220px);
    position: relative;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    /* border-top: solid 1px var(--ion-color-primary); */
  }
</style>
