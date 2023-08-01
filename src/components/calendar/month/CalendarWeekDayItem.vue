<template>
    <!-- 'calendar-day--not-current': !day.isCurrentMonth, -->
    <div 
    :key="day"
    class="grid-item" 
    :class="{
                'calendar-day--today': isToday
            }"
    >
        <span>{{ label  }} </span>
    </div>
</template>

<script>

    //
    import { defineComponent, computed } from 'vue'

    //
    import dayjs from "dayjs";

    export default defineComponent({
        name: 'CalendarWeekDatItem',
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
        emits: {},
        setup(props, { emit }) {
            
            const label = computed(() => dayjs(props.day.date).format('D'))
            console.log(props.day)

            return {
                label
            }
        }
    })
</script>

<style scoped>


    .grid-item {
        background-color: var(--ion-color-success);
        opacity: 0.4;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center
    }

    .calendar-day--today {
        /* color: black; */
        font-size: 2rem;
    }
    /* .calendar-day--not-current {
        background-color: var(--ion-color-light);
        color: var(--ion-color-medium);
    } */
</style>