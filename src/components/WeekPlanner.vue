<template>



    <!-- https://antoniandre.github.io/vue-cal/ -->
    <vue-cal 
        ref="vueCalendar"
        locale="ru"
        today-button
        small
        :special-hours="dailyHours"
        :disable-views="['years', 'month', 'weeks', 'year', 'day']"  
        :events="events"
        :cell-click-hold="false"
        :drag-to-create-event="false"
        editable-events
        :on-event-create="deleteTempCreation"
        @cell-dblclick="createNewDeal($event)"
        :on-event-click="onEventClick"
        :hideViewSelector="true"
        :disableDays="weekendDays"
    >
    </vue-cal>

    <!--  -->

  </template>
  
<script>

import { defineComponent, ref } from 'vue';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useRouter } from 'vue-router';
import { format, parseISO, formatISO9075   } from 'date-fns';

export default defineComponent({
    name: 'WeekPlanner',
    props: ['deals', 'weekendDays'],
    emits: ['openCreateModal'],
    components: {
        VueCal,
    },
    setup(props, {emit}) {
        // Setup ref to router
        const router = useRouter();
        //
        const vueCalendar = ref(VueCal)

        // ЧАСЫ РАБОТЫ
        const dailyHours = { from: 7 * 60, to: 18 * 60, class: 'business-hours' }

        // ФУНКЦИЯ ОТКРЫТИЯ ВЫБРАННОГО В ЕЖЕДНЕВНИКЕ ДЕЛА
        const onEventClick = (event) => {

            router.push({name: 'View-Deal', params: {
                    dealId: event.fullData.id,
                    dealUid: event.fullData.uid,
                    deal: JSON.stringify(event.fullData),
                    isMonth: false
                },
            })
        }

        // МАССИВ ДЕЛ
        const events = props.deals
        // const weekendDays = ['2023-07-09']
        const weekendDays = ref([])


        const formatDate = (days) => {
            days.forEach(element => {
                console.log(element.date)
            });
        }
        
        formatDate(props.weekendDays)
        // const events = [
        //     {
        //         start: '2023-07-04 10:30:00', // executionDate
        //         end: '2023-07-04 14:30:00', // executionDateEnd
        //         // You can also define event dates with Javascript Date objects:
        //         // start: new Date(2018, 11 - 1, 16, 10, 30),
        //         // end: new Date(2018, 11 - 1, 16, 11, 30),
        //         title: 'Doctor appointment', //contactID
        //         content: '<i class="icon material-icons">local_hospital</i>',
        //         class: 'health' //dealType
        //     },
        //     {
        //         start: '2023-07-04 15:00:00',
        //         end: '2023-07-04 17:00:00',
        //         title: 'LUNCH',
        //         class: 'lunch',
        //         background: true
        //     },
        //     {
        //         start: '2023-07-06 15:00:00',
        //         end: '2023-07-06 17:00:00',
        //         title: 'LUNCH',
        //         class: 'lunch',
        //         background: true
        //     },
        // ]

        const createNewDeal = (event) => {
            vueCalendar.value.createEvent(
                event,
                60,
                { title: 'New Event', class: 'blue-event' }
            )
            // console.log(event)
            emit('openCreateModal', event)
        }

        const deleteTempCreation = (event) => {
                console.log(event)
        }

        return {
            dailyHours, events, weekendDays, onEventClick, router, vueCalendar, createNewDeal, deleteTempCreation
        }
    }
})
</script>

<style scoped>
    .vuecal__event.lunch {
    background: repeating-linear-gradient(45deg, transparent, transparent 10px, #f2f2f2 10px, #f2f2f2 20px);/* IE 10+ */
    color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
    }
    .vuecal__event.lunch .vuecal__event-time {display: none;align-items: center;}

    .vuecal--week-view {
        /* background-color: black; */
    }

    .vuecal__menu {
        background-color: yellow;
    }

    .vuecal__event .blue-event {
        background-color: black;
    }
</style>