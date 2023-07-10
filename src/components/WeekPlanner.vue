<template>



    <!-- https://antoniandre.github.io/vue-cal/ -->
    <vue-cal 
        ref="vueCalendar"
        :time-from="0 * 60"
        :time-to="24 * 60"
        locale="ru"
        today-button
        small
        :special-hours="dailyHours"
        :disable-views="['years', 'month', 'weeks', 'year', 'day']"  
        :events="events"
        :cell-click-hold="false"
        :drag-to-create-event="false"
        :editable-events="{titleEditable: false}"
        @cell-dblclick="createTempNewDeal($event)"
        :on-event-click="onEventClick"
        :hideViewSelector="true"
        :disableDays="weekendDays"
        show-time-in-cells
        >
        <!-- editable-events -->
        <!-- :on-event-create="deleteTempCreation" -->
    </vue-cal>
    <br>
    <br>
    <br>
    <!--  -->

  </template>
  
<script>

import { defineComponent, ref } from 'vue';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useRouter } from 'vue-router';
import { format, parseISO, formatISO9075   } from 'date-fns';
import { IonItem } from '@ionic/vue';

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
        const dailyHours = { from: 7 * 60, to: 19 * 60, class: 'business-hours' }

        // ФУНКЦИЯ ОТКРЫТИЯ ВЫБРАННОГО В ЕЖЕДНЕВНИКЕ ДЕЛА
        const onEventClick = (event) => {

            router.push({name: 'View-Deal', params: {
                    dealId: event.fullData.id,
                    dealUid: event.fullData.uid,
                    deal: JSON.stringify(event.fullData),
                    isMonth: false,
                    from: true
                },
            })
        }

        // МАССИВ ДЕЛ
        const events = props.deals
        // const weekendDays = ['2023-07-09']
        const weekendDays = ref([])
        const formatDate = (days) => {
            days.forEach(element => {
                let str = element.date.substr(0, 10)
                weekendDays.value.push(str)
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

        const createTempNewDeal = (event, deleteEventFunction) => {

            vueCalendar.value.createEvent(
                event,
                60,
                { 
                    // title: 'New Event', 
                    class: 'event new',
                    // content: '<span>3123</span>'
                }
            )
            // console.log(event)
            emit('openCreateModal', event)

        }

        let weekdayLabels = document.getElementsByClassName('weekday-label')
        console.log(weekdayLabels)
        // if(weekdayLabels) {
        //     weekdayLabels.forEach((item) => {
        //         item.addEventListener('click', () => {
        //             console.log(123)
        //         })
        //     })
        // }

        document.addEventListener('click', (e) => {
            console.log(e.target)
        })

        return {
            dailyHours, events, weekendDays, onEventClick, router, vueCalendar, createTempNewDeal
        }
    }
})
</script>

<style>
    .vuecal__event.lunch {
    background: repeating-linear-gradient(45deg, transparent, transparent 10px, #f2f2f2 10px, #f2f2f2 20px);/* IE 10+ */
    color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
    }

    .event {
        border-radius: 1rem;
        padding: 1rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .event.new {
        background-color: white; 
        color: var(--ion-color-system);
        border: 1px solid var(--ion-color-system)
    }

    .event.buy {
        background-color: var(--ion-color-warning);
    }
    .event.sale {
        background-color: var(--ion-color-success)
    }

    .vuecal__event-time {
        display: none;
    }
</style>