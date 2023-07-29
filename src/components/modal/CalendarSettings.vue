<template>
    <ion-modal>
        <!--  -->
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-title>Настройки</ion-title>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <!--  -->
        <ion-content
            :scroll-events="true"
            class="ion-page ion-margin-top"
            id="main"
            type="push"
            forceOverScroll="false"
        >
            <br>
            <br>

            <!-- Настройки загруженности дня -->
            <div class="ion-margin-horizontal">
                <br>
                <ion-text>
                    <h1>Загруженность дня</h1>
                </ion-text>

                <ion-grid v-for="(item, i) in settings.daySaturation" :key="i" class="ion-no-padding ion-margin-top">
                    <ion-row class="ion-align-items-center ion-justify-content-between">
                        <!--  -->
                        <ion-text color="primary">
                            {{translateDaySaturationName(item.name)}}
                        </ion-text>

                        <!--  -->
                        <div style="display: flex; align-items-center">
                            <!-- Substract -->
                            <ion-icon :color="setCountQtyButtonDecreaseColor(item)" :icon="removeCircleOutline" @click="changeDaySaturationQty('sub', item, i)" class="countQty_button"></ion-icon>
                            <!-- show data -->
                            <ion-text class="ion-padding-horizontal countQty_count" color="primary">{{item.qty}}</ion-text>
                            <!-- Add -->
                            <ion-icon :color="setCountQtyButtonAddColor(item)" :icon="addCircleOutline" @click="changeDaySaturationQty('add', item, i)" class="countQty_button"></ion-icon>
                        </div>
                    </ion-row>

                    <!--  -->
                    <ion-row class="ion-text-left ion-margin-top">
                        <ion-text v-if="item.name === 'low'">
                            Количество дел, которое вы с легкостью можете выполнить
                        </ion-text>
                        <ion-text v-else>
                            Количество дел, выполнить которое нужно очень постараться
                        </ion-text>
                    </ion-row>
                </ion-grid>
            </div>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted , watchEffect } from 'vue';
    import { IonModal, IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonText, IonGrid, IonRow, IonIcon } from '@ionic/vue';
    import { removeCircleOutline, addCircleOutline } from 'ionicons/icons';
    //
    import store from '../../store/index';
    //
    export default defineComponent({
        name: 'CalendarSettings',
        props: {
            userSettings: Object,
        },
        components: {
            IonModal, IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonText, IonGrid, IonRow, IonIcon
        },
        setup(props, { emit }) {
            const settings = ref([])
            //
            onMounted(() => {
                // daySaturation.value = store.state.userSettings.daySaturation
                // console.log(store.state.userSettings)
            })
            //
            const translateDaySaturationName = (itemName) => {
                if(itemName === 'low') {
                    return 'Низкая нагрузка'
                } else if (itemName === 'high') {
                    return 'Высокая нагрузка'   
                }
            }
            // меняем стили кнопок для уменьшения количества 
            const setCountQtyButtonDecreaseColor = (item) => {
                if(item.name === 'low') {
                    if(item.qty < 2) {
                        return 'light'
                    } else {
                        return 'primary'
                    }
                } else if (item.name === 'high') {
                    if(item.qty === settings.value.daySaturation[0].qty) {
                        return 'light'
                    } else {
                        return 'primary'
                    }
                }
            }
            // меняем стили кнопок для увеличения количества 
            const setCountQtyButtonAddColor = (item) => {
                if(item.name === 'low') {
                if(item.qty === settings.value.daySaturation[1].qty) {
                    return 'light'
                } else {
                    return 'primary'
                }
                } else if (item.name === 'high') {
                return 'primary'
                }
            }
            // массив загруженности дня, который на данный момент хранится в БД
            const changeDaySaturationQty = (action, item, i) => {
                // Если кликаем на варианту с нижним порогом загруженности
                if(item.name === 'low') {
                    if(action === 'sub' && item.qty > 1 ) {
                        item.qty--
                        settings.value.daySaturation[i].qty = item.qty
                        update()
                    } else if (action === 'add' && item.qty < settings.value.daySaturation[1].qty) {
                        item.qty++
                        settings.value.daySaturation[i].qty = item.qty
                        update()
                    }
                }
                // Если кликаем на варианту с верхним порогом загруженности
                else if (item.name === 'high') {
                    if(action === 'sub' && item.qty > settings.value.daySaturation[0].qty) {
                        item.qty--
                        settings.value.daySaturation[i].qty = item.qty
                        update()
                    } else if (action === 'add') {
                        item.qty++
                        settings.value.daySaturation[i].qty = item.qty
                        update()
                    }
                }
            }
            // Обновляем в БД массив с значениями загруженности дня
            const update = () => {
                // console.log('Данные обновлены в БД')
                emit('update', settings.value.daySaturation)
            }
            //
            watchEffect(() => {
                settings.value = props.userSettings
                // daySaturation.value = props.daySaturationBD
            })

            return {
                settings, removeCircleOutline, addCircleOutline, translateDaySaturationName, setCountQtyButtonDecreaseColor, changeDaySaturationQty, setCountQtyButtonAddColor, update
            }
        }
    })
</script>

<style scoped>
    .countQty_button {
        font-size: 32px;
    }
    .countQty_count {
        font-size: 24px;
    }
</style>