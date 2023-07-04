<template>
    <!-- https://antoniandre.github.io/vue-cal/ -->
    <vue-cal 
        locale="ru"
        today-button
        :special-hours="dailyHours"
        hide-weekends 
        :disable-views="['years', 'month', 'year', 'day']"  
        :events="events"
        :cell-click-hold="false"
        :drag-to-create-event="false"
        editable-events
        @cell-dblclick="$refs.vuecal.createEvent(
            $event,
            120,
            { title: 'New Event', class: 'blue-event' }
        )"
    >
    </vue-cal>

  </template>
  
<script>

import { defineComponent, ref } from 'vue';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default defineComponent({
    name: 'WeekPlanner',
    components: {
        VueCal
    },
    setup() {

        const dailyHours = { from: 9 * 60, to: 18 * 60, class: 'business-hours' }

        const events = [
            {
                start: '2023-07-04 10:30:00',
                end: '2023-07-04 14:30:00',
                // You can also define event dates with Javascript Date objects:
                // start: new Date(2018, 11 - 1, 16, 10, 30),
                // end: new Date(2018, 11 - 1, 16, 11, 30),
                title: 'Doctor appointment',
                content: '<i class="icon material-icons">local_hospital</i>',
                class: 'health'
            },
            {
                start: '2023-07-04 12:00:00',
                end: '2023-07-04 13:00:00',
                title: 'LUNCH',
                class: 'lunch',
                background: true
            },
        ]

        return {
            dailyHours, events
        }
    }
})
</script>

<style scoped>
    .lunch {
        background-color: black!important;
    }
</style>