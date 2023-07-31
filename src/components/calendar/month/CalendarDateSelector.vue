<template>

    <div class="calendar-date-selector">

        <!--  -->
        <ion-icon :icon="chevronBackOutline" @click="selectPrevious"></ion-icon>


        <!--  -->
        <div @click="selectCurrent" class="calendar-date__today">
            <span>Сегодня</span>
        </div>

        <!--  -->
        <ion-icon :icon="chevronForwardOutline" @click="selectNext"></ion-icon>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';

    //
    import dayjs from 'dayjs'

    //
    import { IonIcon } from '@ionic/vue';
    import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons'

    export default defineComponent({
        
        name: 'CalendarDateSelector',
        emits: ['dateSelected'],
        props: {
            currentDate: {
                type: String,
                required: true
            },
            selectedDate: {
                type: Object,
                required: true
            }
        },
        components: {
            
            //
            IonIcon 
        }, 
        setup(props, { emit }) {

            // 
            const selectPrevious = () => {
                let newSelectedDate =  dayjs(props.selectedDate).subtract(1, "month");
                // console.log(newSelectedDate)
                emit('dateSelected', newSelectedDate)
            }

            const selectCurrent = () => {
                let newSelectedDate = dayjs(props.currentDate);
                // console.log(newSelectedDate)
                emit('dateSelected', newSelectedDate)
            }

            const selectNext = () => {
                let newSelectedDate = dayjs(props.selectedDate).add(1, 'month');
                // console.log(newSelectedDate)
                emit('dateSelected', newSelectedDate)
            }

            return {
                selectPrevious, selectCurrent, selectNext, IonIcon, chevronBackOutline, chevronForwardOutline
            }
        }
    })
</script>

<style scoped>
    .calendar-date-selector {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--grey-800);
    }

    /* .calendar-date-selector > * {
        cursor: pointer;
        user-select: none;
    } */

    .calendar-date__today {
        margin: 0 1rem;
    }
</style>