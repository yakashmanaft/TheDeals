<template>
    <li
        class="calendar-day"
        :class="{
            'calendar-day--not-current': !day.isCurrentMonth,
            'calendar-day--today': isToday
        }"
    >
        <span>{{ label  }}</span>
    </li>
</template>

<script>

    //
    import { defineComponent, computed } from 'vue'

    //
    import dayjs from "dayjs";

    export default defineComponent({
        name: 'CalendarMonthDayItem',
        props: {
            day: {
                type: Object,
                required: true
            },
            isCurrentMonth: {
                type: Boolean,
                default: false
            },
            isToday: {
                type: Boolean,
                default: false
            }
        },
        emits: [],
        components: {},
        setup(props, { emit }){

            //
            const label = computed(() => dayjs(props.day.date).format('D'))

            return {
                label
            }
        }
    })
</script>

<style scoped>
    .calendar-day {
        position: relative;
        min-height: 3.5rem;
        font-size: 16px;
        /* background-color: #fff; */
        background-color: var(--ion-color-success);
        opacity: 0.4;
        color: var(--ion-color-white);
        padding: 5px;
        cursor: pointer;
        /* border-radius: 5px; */
    }
    .calendar-day > span {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 5px;
        /* width: var(--day-label-size); */
        /* height: var(--day-label-size); */
    }

    .calendar-day--not-current {
        background-color: var(--ion-color-light);
        color: var(--ion-color-medium);
    }

    .calendar-day--today {
        padding-top: 4px;
    }

    .calendar-day--today > span {
        color: #fff;
        border-radius: 9999px;
        font-weight: bold;
        font-size: 2rem;
        /* background-color: var(--ion-color-success); */
    }
    
</style>
