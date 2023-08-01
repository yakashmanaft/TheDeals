<template>


  <!-- page header -->
  <Header
    :title="pageTitle"
    style="background-color: white"
    @calendarMode="calendarModeFunc"
    :isMonth="isMonthMode"
  />
    <!-- Спиннер как имитация загрузки -->
    <Spinner v-if="spinner"/>


    <!-- Navigation Menu -->
    <navigation-menu
        :title="pageTitle"
    />

    <ion-content
      :scroll-events="true"
      class="ion-page ion-margin-top" 
      id="main"
      type="push"
      forceOverscroll="false"
    >


    <br>
      <!-- Parent container for the calendar month -->
      <div class="calendar-month ion-margin-top">
        
        <!-- The calendar header -->
        <div class="calendar-month-header">
          
          <!-- Month -->
          <CalendarDateIndicator 
            :selected-date="selectedDate"
            class="calendar-month-header-selected-month"
          />

          <!-- Pagination -->
          <CalendarDateSelector 
            :isMonth="isMonthMode"
            :current-date="today"
            :selected-date="selectedDate"
            @dateSelected="selectDate"
          />
        </div>
    
        <!-- Calendar grid header -->
        <CalendarWeekdays />
    
        <!-- Calendar WEEK grid -->
        <div class="grid-container" v-if="!isMonthMode">

          <!--  -->
          <CalendarWeekDayItem
            v-for="day in weekdays" 
            :key="day.date"
            :day="day"
            :is-today="day.date === today"
            @click="openDayModal(day.date)"
          />
        </div>

        <!-- Calendar MONTH grid -->
        <ol class="days-grid" v-if="isMonthMode">

          <!--  -->
          <CalendarMonthDayItem 
            v-for="day in days"
            :key="day.date"
            :day="day"
            :is-today="day.date === today"
            @click="openDayModal(day.date)"
          />
          <!-- <br>
          <br>
          <br> -->
        </ol>
      </div>

    </ion-content>
    <!-- <br>
    <br>
    <br> -->

    <!-- page footer -->
    <Footer style="background-color: white"/>
  </template>

<script>
  import { defineComponent, computed, ref, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  //
  import store from '../../../store/index';
  import { supabase } from '@/supabase/init';

  //
  import dayjs from "dayjs";
  import weekday from "dayjs/plugin/weekday";
  import weekOfYear from "dayjs/plugin/weekOfYear";
  import 'dayjs/locale/ru';

  // 
  import Spinner from '@/components/Spinner.vue'
  import Header from '@/components/headers/Header.vue'
  import NavigationMenu from '@/components/NavigationMenu.vue'
  import Footer from '@/components/Footer.vue';

  //
  import CalendarDateIndicator from '../../../components/calendar/month/CalendarDateIndicator.vue'
  import CalendarDateSelector from '../../../components/calendar/month/CalendarDateSelector.vue'
  import CalendarWeekdays from '../../../components/calendar/month/CalendarWeekdays.vue'
  import CalendarMonthDayItem from '../../../components/calendar/month/CalendarMonthDayItem.vue'
  import CalendarWeekDayItem from '../../../components/calendar/month/CalendarWeekDayItem.vue'

  //
  import { IonContent } from '@ionic/vue'

  //
  dayjs.extend(weekday);
  dayjs.extend(weekOfYear);

  export default defineComponent({
    
    name: 'Calendar',
    emits: [],
    props: ['isMonthMode', 'nogi'],
    components: {

      //
      Spinner,
      Header,
      NavigationMenu,
      Footer,

      //
      CalendarDateIndicator,
      CalendarDateSelector,
      CalendarWeekdays,
      CalendarMonthDayItem,
      CalendarWeekDayItem,

      //
      IonContent
    },
    setup(props, { emit }) {

      //
      const spinner = ref(null)
      spinner.value = true

      console.log(props.nogi)

      // Setup ref to router
      const route = useRoute();
      const router = useRouter();

      //
      const user = computed(() => store.state.user);
      const userEmail = ref()
      const pageTitle = router.currentRoute._value.meta.translation;

      //
      const selectedDate = ref(dayjs())

      //
      const today = dayjs().locale('ru').format('YYYY-MM-DD')
      
      // текущий месяц      
      const month = ref(Number(selectedDate.value.format("M")));

      // текущий год
      const year = ref(Number(selectedDate.value.format("YYYY")));

      // текущая неделя
      // const week = ref(Number(selectedDate.value.week()))
      //
      const selectDate = (newSelectedDate) => {
        selectedDate.value = newSelectedDate
      }

      //
      // const startOfWeek = ref(dayjs(selectedDate.value).startOf("week").day(1))
      const startOfWeek = () => {
        // console.log(currentMonthDays.value.find(item => item.date === currentWeekdays[1]))

        // console.log(dayjs(selectedDate.value).startOf('isoWeek').day(1))
        // console.log(dayjs(selectedDate.value).endOf('isoWeek').day(7))
        return dayjs(selectedDate.value).startOf('isoWeek').day(1)
      }

      
      //
      const getWeekday = (date) => {
        return dayjs(date).weekday();
      }
      
      //
      const numberOfDaysInMonth = computed(() => dayjs(selectedDate.value).daysInMonth())
      
      // =========================================
      //
      const currentMonthDays = computed(() => {
        return [...Array(numberOfDaysInMonth.value)].map((day, index) => {
          return {
            date: dayjs(`${year.value}-${month.value}-${index + 1}`).format("YYYY-MM-DD"),
            isCurrentMonth: true
          }
        })
      })

      // 
      const currentWeekdays = computed(() => {
        return [...Array(7).fill(startOfWeek()).map((day, index) => {
          return {
            // day: day.add(index, "day").format("D"),
            // day: day.add(index, "day").format("YYYY-MM-DD"),
            // date: day.add(index, "day").format("YYYY-MM-DD"),
            day: day.add(index, "day").format("D"),
            date: day.add(index, "day").format("YYYY-MM-DD"),
            isCurrentMonth: true
            // date: dayjs(`${year.value}-${month.value}-${index}`).format("YYYY-MM-DD"),
          }
        })]
      })

      // ============================================
      // 
      // const  previousWeekdays = computed(() => {
      //   return [...Array(7).fill(dayjs(startOfWeek(selectedDate.value)).subtract(1, 'week')).map((day, index) => {
      //     return {
      //       day: day.add(index, "day").format("D"),
      //       date: day.add(index, "day").format("YYYY-MM-DD"),
      //       isCurrentWeek: false
      //     }
      //   })]

      // })

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
            date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index}`).format("YYYY-MM-DD"),
            isCurrentMonth: false
          }
        })
      })

      // =======================================
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
      // const  nextWeekdays = computed(() => {
      //   return [...Array(7).fill(dayjs(startOfWeek(selectedDate.value)).add(1, 'week')).map((day, index) => {
      //     return {
      //       day: day.add(index, "day").format("D"),
      //       date: day.add(index, "day").format("YYYY-MM-DD"),
      //       isCurrentWeek: false
      //     }
      //   })]

      // })

      //
      const weekdays = computed(() => {
        return [
          // ...previousWeekdays.value,
          ...currentWeekdays.value,
          // ...nextWeekdays.value
        ]
      })
      const days = computed(() => {
        return [
          ...previousMonthDays.value,
          ...currentMonthDays.value,
          ...nextMonthDays.value
        ]
      })

      onMounted(() => {
        console.log(weekdays.value)
        // Get user email
        store.methods.setUserEmail()
        userEmail.value = store.state.userEmail

        //
        spinner.value = false
      })

      
      let xDown = null;
      let yDown = null;

      const getTouches = (evt) => {
        return evt.touches
      };

      const handleTouchStart = (evt) => {
        const firstTouch = getTouches(evt)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
      }

      function handleTouchMove(evt) {

        // 
        if ( ! xDown || ! yDown ) {
          return;
        }

        // 
        let xUp = evt.touches[0].clientX;
        let yUp = evt.touches[0].clientY;

        // 
        let xDiff = xDown - xUp;
        let yDiff = yDown - yUp;

        // 
        if ( Math.abs(xDiff) > Math.abs(yDiff)) {
          if(isMonthMode.value) {
            ( xDiff > 0 ) ? selectedDate.value =  dayjs(selectedDate.value).add(1, "month") : selectedDate.value =  dayjs(selectedDate.value).subtract(1, "month");
          } else if(!isMonthMode.value) {
            ( xDiff > 0 ) ? selectedDate.value =  dayjs(selectedDate.value).add(1, "week") : selectedDate.value =  dayjs(selectedDate.value).subtract(1, "week");

          }
        } else {
          // ( Math.abs(xDiff) === 0) ? alert('Up') : alert('Duwn');
        }
        

        /* свайп был, обнуляем координаты */
        xDown = null;
        yDown = null;

      }


      // 
      document.addEventListener('touchstart', handleTouchStart, false);
      document.addEventListener('touchmove', handleTouchMove, false);
      
      // 
      const openDayModal = (day) => {
        console.log(day)
        alert(day)
      }

      watch(days, () => {

        month.value = Number(selectedDate.value.format("M"))
        year.value = Number(selectedDate.value.format("YYYY"))
      })
      
      watch(weekdays, () => {
        // console.log(currentMonthDays.value)
        if(currentWeekdays.value) {
          let date1 = dayjs(currentMonthDays.value[0].date)
          let date2 = dayjs(currentMonthDays.value[6].date)
          
          if(date2.diff(date1, 'day') === 7) {
            let arr = []
            for(let i = 0; i <= 5; i++) {
              arr.push({
                day: previousMonthDays.value[i].date.slice(-2),
                date: previousMonthDays.value[i].date,
                // isCurrentMonth: false
              })
            }
            arr.push({
              day: currentMonthDays.value[0].date.slice(-2).substring(1),
              date: currentMonthDays.value[0].date,
              // isCurrentMonth: true
            })
            
            // console.log(arr)
            // currentWeekdays.value.splice(0, currentWeekdays.value.length)
            // currentWeekdays.value.push(arr)
            // console.log(currentWeekdays.value)
            weekdays.value.splice(0, weekdays.value.length)
            arr.forEach(item => weekdays.value.push(item))

            // console.log(weekdays.value)
          }
        }
       
      })

      // const monthMode = ref(props.isMonthMode)
      // watch(monthMode, () => {
      //   console.log(monthMode.value)
      // })

      // Toggle calendar mode
      const isMonthMode = ref(true)

      const calendarModeFunc = (boolean) => {
          if(boolean === true) {
              isMonthMode.value = true
              // loadInMonthMode()
          } else {
              isMonthMode.value = false
          }
          // console.log(isMonthMode.value)
      }

      return {

        selectedDate, today, selectDate, getWeekday, days, month, year, numberOfDaysInMonth, currentMonthDays, currentWeekdays, previousMonthDays, nextMonthDays, openDayModal, handleTouchStart, handleTouchMove, getTouches, startOfWeek, weekdays, calendarModeFunc, isMonthMode, route, router, user, userEmail, pageTitle, spinner
      }
    }
  })
</script>

<style scoped>
  /* .calendar-month { */
    /* position: relative; */
    /* background-color: var(--ion-color-light); */
    /* border: solid 1px var(--ion-color-medium); */
  /* } */
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
    grid-column-gap: 0.2rem;
    grid-row-gap: 0.2rem;
    /* border-top: solid 1px var(--ion-color-primary); */
  }
  /* https://codesandbox.io/s/monthly-calendar-vue-wdv9y?file=/src/components/CalendarMonth.vue:1837-1875 */

  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    height: 3rem;
    /* grid-template-rows: repeat(3, 100px);
    grid-row-gap: 1px;
     */
    grid-column-gap: 0.2rem;
  }
</style>
