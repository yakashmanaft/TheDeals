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
        :min-event-width="100"
        >
    </vue-cal>
    <!--  -->

  </template>
  
<script>

import { defineComponent, ref, onMounted } from 'vue';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useRouter } from 'vue-router';
import { format, parseISO, formatISO9075   } from 'date-fns';
import { IonItem } from '@ionic/vue';
import { bagHandleOutline } from 'ionicons/icons';
import store from '../store/index'

import { IonIcon } from '@ionic/vue'
import { setIconByDealType } from '../helpers/setIconBy'

export default defineComponent({
    name: 'WeekPlanner',
    props: ['deals', 'weekendDays'],
    emits: ['openCreateModal', 'openDayModal', 'spinnerOff'],
    components: {
        VueCal,
        //
        IonIcon,
    },
    setup(props, {emit}) {
        // Setup ref to router
        const router = useRouter();
        
        const deals = ref([])
        const vueCalendar = ref(VueCal)
        const myDeals = ref([]);
        const myContacts = ref([]);
        const availableBalance = ref(0)
        const events = deals.value
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
        // const events = props.deals
        
        // const weekendDays = ['2023-07-09']
        const weekendDays = ref([])
        const formatDate = (days) => {
            days.forEach(element => {
                let str = element.date.substr(0, 10)
                weekendDays.value.push(str)
            });
        }

        const userSettings = ref(store.state.userSettings[0])
        
        formatDate(props.weekendDays)

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

        onMounted(async () => {

            // 
            let weekdayLabels = document.querySelectorAll('.weekday-label')
            if(weekdayLabels) {
                // console.log(weekdayLabels)
                weekdayLabels.forEach(element => {
                    element.addEventListener('click', (e) => {
                        console.log(e.target)
                        emit('openDayModal', true)
                    })
                })
            }
            await loadWeekMode()
            let dealEvents = document.querySelectorAll('.vuecal__event')
            dealEvents.forEach(element => {

                element.insertAdjacentHTML("afterbegin", `
                    
                <img src="img/common/dealType/bag-outline.svg">

                `);
                // `img/subjects/sale/${item.selectedProduct}.webp`
            })
            // 
        })
        
        const loadWeekMode = async () => {

                // Подтягиваем настройки аккаунта пользователя
                await store.methods.getUserSettingsfromDB()
    
                // Дергаем из store выходные дни
                userSettings.value = store.state.userSettings[0]
                weekendDays.value = userSettings.value.weekendDays

                //
                await store.methods.getMyDealsFromBD()
                myDeals.value = store.state.myDealsArray

                await store.methods.getMyContactsFromDB()
                myContacts.value = store.state.myContactsArray
                // запускаем функцию расчета баланса кошелька из store
                store.methods.calculateBalance(myDeals.value)
                availableBalance.value = store.state.availableBalance
                
                let deal = {}
                // console.log(myDeals.value)
                if(myDeals.value) {
                    myDeals.value.forEach((item) => {
                        deal = {
                            // start: item.executionDate,
                            // start: '2023-07-07 08:14',
                            start: parseISO(item.executionDate),
                            // end: item.executionDateEnd,
                            // end: '2023-07-07 09:14',
                            end: parseISO(item.executionDateEnd),
                            // title: item.contactID,
                            // content: 'content'
                            class: `${item.dealType}`,

                            // Докидываем в объект общие данные по делу
                            fullData: item
                        }
                        deals.value.push(deal)
                    })
                }

                // Отключаем спинер после загрузки данных
                emit('spinnerOff', false)
                // Очищаем временный массив с данными
                deals.value = []
            }

        // document.addEventListener('click', (e) => {
        //     console.log(e.target)
        // })

        // vuecal__cell vuecal__cell--disabled
        // vuecal__cell vuecal__cell--has-events

        return {
            dailyHours, events, weekendDays, onEventClick, router, vueCalendar, createTempNewDeal, loadWeekMode, deals, myDeals, myDeals, myContacts, availableBalance, setIconByDealType, bagHandleOutline
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

    .vuecal__event {
        border-radius: 1rem;
        padding: 1rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .vuecal__event.new {
        background-color: white; 
        color: var(--ion-color-system);
        border: 1px solid var(--ion-color-system)
    }
    
    .vuecal__event.buy {
        background-color: var(--ion-color-warning);
    }
    
    .vuecal__event.buy::after {
        content: 'Покупка';
        font-size: 0.7rem;
    }

    .vuecal__event.sale {
        background-color: var(--ion-color-success)
    }

    .vuecal__event.sale::after {
        content: 'Продажа';
        font-size: 0.7rem;
    }

    .vuecal__event-time {
        display: none;
    }

    .vuecal__title-bar {
        background-color: white;
        font-size: 1rem;
    }

    .vuecal__today-btn {
        background-color: var(--ion-color-primary);
        border-radius: 1rem;
        padding: 0.5rem 1rem;
        color: white;
    }

    .vuecal__today-btn span.default {
        padding: 0;
    }

    .vuecal__weekdays-headings {
        margin-top: 1rem;
        border-bottom: none;
    }

    .weekday-label {
        flex-direction: column;
        justify-content: center;
        font-size: 0.8rem;
    }

    .weekday-label span:last-child {
        width: 2.5rem;
        height: 2.5rem;
        margin-top: 0.5rem;
        padding: 0.5rem;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .weekday-label span:last-child {
        color: white;
        background-color: var(--ion-color-medium)
    }

    .today .weekday-label span:last-child {
        color: white;
        background-color: var(--ion-color-primary)
    }

    .vuecal__heading {
        height: 100%;
    }
    
    .weekday-label span {
        text-align: center;
    }

    .vuecal__header {
        /* height: 10rem; */
    }

    .vuecal__body {
        margin-top: 1rem;
        /* position: relative; */
    }
    .vuecal__no-event {
        display: none;
    }
    .week-view {
        /* height: 91vh; */

    }
    .vuecal__time-column {
        /* position: absolute;
        opacity: 0; */
    }
</style>