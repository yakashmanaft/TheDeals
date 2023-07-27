
<template>

    <!-- https://antoniandre.github.io/vue-cal/ -->
    <vue-cal 
        ref="vueCalendar"
        :time-from="0 * 60"
        :time-to="24 * 60"
        locale="ru"
        today-button
        :special-hours="dailyHours"
        :disable-views="['years', 'month', 'weeks', 'year', 'day']"  
        :events="events"
        :cell-click-hold="false"
        :drag-to-create-event="false"
        @cell-dblclick="createTempNewDeal($event)"
        :on-event-click="onEventClick"
        :hideViewSelector="true"
        :disableDays="weekendDayArr"
        show-time-in-cells
        :min-event-width="100"
        :editable-events="{titleEditable: false}"
        >
    </vue-cal>
    <br>
    <br>
    <br>
    <br>
    <!--  -->

  </template>
  
<script>

import { defineComponent, ref, onMounted, watch } from 'vue';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useRouter } from 'vue-router';
import { format, parseISO, formatISO9075   } from 'date-fns';
import { IonItem } from '@ionic/vue';
import { bagHandleOutline, cubeOutline, checkmarkOutline } from 'ionicons/icons';
import store from '../store/index'

import {  } from '@ionic/vue'
import { setIconByDealType } from '../helpers/setIconBy'

export default defineComponent({
    name: 'WeekPlanner',
    props: ['deals', 'weekendDays', 'isMonthMode'],
    emits: ['openCreateModal', 'spinnerChangeStat', 'choosenDate'],
    components: {
        VueCal,
        //
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
        
        // const weekendDays = ['2023-07-12', '2023-07-14']
        const weekendDays = ref([])
        let weekendDayArr = []
        const formatDate = (days) => {
            days.forEach(element => {

                let str = element.date
                // let str = element.date.substr(0, 10)
                weekendDayArr.push(str)
            });
            // console.log(weekendDayArr)
            // return weekendDayArr
        }

        const userSettings = ref()
        userSettings.value = store.state.userSettings[0]
        if(userSettings.value) {
            
            formatDate(userSettings.value.weekendDays)
        }

        const createTempNewDeal = (event, deleteEventFunction) => {
            // console.log(formatDate(event))
            // vueCalendar.value.createEvent(
            //     event,
            //     60,
            //     { 
            //         // title: 'New Event', 
            //         class: 'event new',
            //         // content: '<span>3123</span>'
            //     }
            // )
            // console.log(event)
            emit('openCreateModal', event)

        }

        onMounted(async () => {
            
            // обновляем список дел в еженедельнике
            await loadWeekMode()
            // Обновляем стили в еженедельнике
            createElementStyle()           
            // оживляем клик по дням в неделе
            // clickOnChoosenDay() 

        })
        // console.log(props.isMonthMode)s
        const loadWeekMode = async () => {

                // Подтягиваем настройки аккаунта пользователя
                await store.methods.getUserSettingsfromDB()
    
                // Дергаем из store выходные дни
                userSettings.value = store.state.userSettings[0]
                weekendDays.value = userSettings.value.weekendDays
                formatDate(userSettings.value.weekendDays)
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
                            class: `${item.dealType} importance${item.dealImportance} ${item.dealStatus}`,
                            
                            // Докидываем в объект общие данные по делу
                            fullData: item,
                        }
                        deals.value.push(deal)
                    })
                }
                createElementStyle()    
                // Отключаем спинер после загрузки данных
                emit('spinnerChangeStat', false)
                // Очищаем временный массив с данными
                deals.value = []
            }

        document.addEventListener('click', (e) => {

            // обновляем контент при переключении недели
            if(e.target.classList != null) {

                if(e.target.classList.contains('vuecal__arrow') === true || e.target.classList.contains('default') === true || e.target.classList.contains('angle') === true || e.target.classList.contains('vuecal__today-btn') === true) {
    
                    // Включаем спиннер
                    emit('spinnerChangeStat', true)
                    // Обновляем данные по дням
                    loadWeekMode()    
    
                } 
            }
            // дергаем день из weekday-label
            if(e.target.parentNode) {
                    // let cellTimeLabel = e.target.parentNode
                    // let cellColumn = cellTimeLabel.parentNode
                if (e.target.parentNode.classList.contains('weekday-label')) {
    
                    console.log(e.target)
                    // Забираем строку значения выбранного дня
                    let choosenDay = e.target.textContent
                    clickOnChoosenDay(choosenDay)
                } else if (e.target.parentNode.parentNode.parentNode.classList.contains('vuecal__cell--disabled')) {
                    alert('WeekPlanner: выходной день')
                }
            }


            // 
            
        })

        const checkClass = (classList, element) => {

            if(classList.contains('deal-complete')) {
                element.insertAdjacentHTML('afterbegin', `
                    <img class="dealTypeImg" src="img/common/week-planner-marks/checkmark-outline.svg">
                `)
            } else if (classList.contains('sale')) {
                element.insertAdjacentHTML("afterbegin", `
                
                <img class="dealTypeImg" src="img/common/week-planner-marks/bag-outline.svg">
                
                `);
            } else if (classList.contains('buy')) {
                element.insertAdjacentHTML("afterbegin", `
                
                <img class="dealTypeImg" src="img/common/week-planner-marks/cube-outline.svg">
                
                `);
            }

        }

        const createElementStyle = () => {

            let dealEvents = document.querySelectorAll('.vuecal__event')

            dealEvents.forEach(element => {

                let dealTypeImgArr = element.querySelectorAll('.dealTypeImg')

                if(dealTypeImgArr.length === 0) {
                    checkClass(element.classList, element)
                } else {
                    let imgEl = element.querySelector('.dealTypeImg')

                    // if(imgEl) {
    
                        imgEl.remove(element)
                    // }

                    checkClass(element.classList, element)
                }
                
            })
        }

        //
        let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        //
        const clickOnChoosenDay = (day) => {
            let weekdayLabels = document.querySelectorAll('.weekday-label')
            let monthYearWrapper = document.querySelector('.vuecal__title')
            let monthYear;
            if(monthYearWrapper) {
                monthYear = monthYearWrapper.querySelector('span')
            }
            // if(weekdayLabels) {
            //     // console.log(weekdayLabels)
            //     weekdayLabels.forEach(element => {
            //         element.addEventListener('click', (e) => {
                        
            //             // Просим открыть окно установки иили отмены выходного
            //             // emit('openDayModal', true)
            //         })
            //     })
            // }
            if(!props.isMonthMode && monthYear && monthYear !== '') {
                if(day !== 'Месяцы' && day) {
                    let setMonthString = (month) => {
                        if(months.indexOf(month) + 1 < 10) {
                            return `0${months.indexOf(month) + 1}`
                        } else {
                            return `${months.indexOf(month) + 1}`
                        }
                    }
                    let setDatString = (day) => {
                        if(day < 10) {
                            return `0${day}`
                        } else {
                            return `${day}`
                        }
                    }
                    // Создаем форматированную дату
                    // '2023-07-14'
                    let dirtyDateString;
                    // Проверка на наличие двойных недель (задействовано два месяца)
                    if(monthYear.textContent.indexOf('-') === -1) {
                        dirtyDateString = `${monthYear.textContent} ${day.substring(1)}`
                    } else {
                        // Неделя 31 (Июль - Август 2023)
                        let tempStringArr = monthYear.textContent.split(' ')
                        // Если день состоит из ДВУХ символов - берем ПЕРВЫЙ (типа предыдущий который вот вот закончится) месяц из строки
                        if(day.substring(1).length === 2) {
                            dirtyDateString = `${tempStringArr[0]} ${tempStringArr[1]} (${tempStringArr[2]} ${tempStringArr[5]} ${day.substring(1)}`
                        }
                        // Если день состоит из ОДНОГО символов - берем ВТОРОЙ месяц из строки
                        else if (day.substring(1).length === 1) {
                            dirtyDateString = `${tempStringArr[0]} ${tempStringArr[1]} (${tempStringArr[4]} ${tempStringArr[5]} ${day.substring(1)}`
                        }

                    }
                    
                    let dirtyDateStringWoBrackets = dirtyDateString.replace(/[()]/g, "")
                    let dirtyDateArr =  dirtyDateStringWoBrackets.split(' ')
                    let date = `${dirtyDateArr[3]}-${setMonthString(dirtyDateArr[2])}-${setDatString(dirtyDateArr[4])}`

                    if (date) {
                        emit('choosenDate', date)
                        console.log(date)
                        date = ''
                    }

                }
            }
        }

        // window.addEventListener('click', (e) => {

        //         if(e.target.parentNode !== null) {

        //             let cellTimeLabel = e.target.parentNode
        //             let cellColumn = cellTimeLabel.parentNode

        //             if(cellColumn.parentNode.classList.contains('vuecal__cell--disabled')) {
        //                 alert('WeekPlanner: выходной день')
        //             }

        //         }
        // })

        // ЕСТЬ КУда ИСПОЛЬЗОВАТь???
        // vuecal__cell vuecal__cell--disabled
        // vuecal__cell vuecal__cell--has-events

        // watch(() => props.deals, (first, second) => {
        //     console.log(props.deals)
        // })

        return {
            dailyHours, events, weekendDays, onEventClick, router, vueCalendar, createTempNewDeal, loadWeekMode, deals, myDeals, myDeals, myContacts, availableBalance, setIconByDealType, bagHandleOutline, cubeOutline, createElementStyle, weekendDayArr, clickOnChoosenDay, checkmarkOutline, checkClass
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
    
    /*
    .vuecal__event.buy {
    }

    .vuecal__event.sale {
    }
    */

    /* Стили для раскраски важности делаа */
    .vuecal__event.importance1,
    .vuecal__event.importance2 {
        background-color: var(--ion-color-success);
    }

    .vuecal__event.importance3,
    .vuecal__event.importance4 {
        background-color: var(--ion-color-warning);
    }

    .vuecal__event.importance5 {
        background-color: var(--ion-color-danger)
    }

    /* Стили для раскраски по статусу дела */
    .vuecal__event.deal-complete {
        background-color: var(--ion-color-light);
    }

    .vuecal__event.new {
        background-color: transparent; 
        /* border: 1px solid var(--ion-color-medium) */
    }

    .dealTypeImg {
        color: white;
        max-width: 2rem;
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

    .vuecal__arrow {
        position: relative;
        padding: 0;
        margin: 0 1rem;
        height: 1rem;
        width: 1rem;
    }

    .vuecal__arrow--next {
        margin-right: 2rem;
    }

    .vuecal__arrow i {
        position: absolute;
        top: -0.3rem;
        left: 0;
        height: 1rem;
        width: 1rem;
        display: none;
        width: 1.5rem;
        height: 1.5rem;
        border: 0;
        border-radius: 2px;
    }

    .vuecal__arrow i::before {
        content: '';
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
</style>