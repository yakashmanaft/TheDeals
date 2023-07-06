<template>



    <!-- https://antoniandre.github.io/vue-cal/ -->
    <vue-cal 
        ref="vuecal"
        locale="ru"
        today-button
        small
        :special-hours="dailyHours"
        :disable-views="['years', 'month', 'weeks', 'year', 'day']"  
        :events="events"
        :cell-click-hold="false"
        :drag-to-create-event="false"
        editable-events
 
        @cell-dblclick="$refs.vuecal.createEvent(
            $event,
            120,
            { title: 'New Event', class: 'blue-event' }
        )"
        :on-event-click="onEventClick"
    >
    </vue-cal>

  </template>
  
<script>

import { defineComponent, ref } from 'vue';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'WeekPlanner',
    props: ['deals'],
    components: {
        VueCal
    },
    setup(props, {emit}) {
        // Setup ref to router
        const router = useRouter();

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
            // console.log(event.fullData.id)
            // console.log(event.fullData.uid)
            // console.log(JSON.stringify(event.fullData))
        }

        // МАССИВ ДЕЛ
        const events = props.deals
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

        return {
            dailyHours, events, onEventClick, router
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
</style>