<template>
    <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
                
        <div style="width: 320px; padding: 1rem;">

            <!--  -->
            <ion-text color="medium">

                <h3 style="font-size: 1rem;">Выберите профиль:</h3>
            </ion-text>

            <!--  -->
            <div style="margin-top: 2rem;">
                <swiper
                    v-if="userWorkProfileArray.length !== 0"
                    :pagination="true" 
                    @slideChange="onSlideChange"
                >
                    <swiper-slide
                        v-for="(slideContent, index) in userWorkProfileArray"
                        :key="index"
                        :virtualIndex="index"
                        style="margin: 1px" 
                    >

                        <ion-img
                            loading="lazy"
                            :src="`../img/profiles/${translateUserProfileToImg(slideContent)}.webp`"
                            style="width: 70%; height: 70%; object-fit: contain!important;"
                        />

                    </swiper-slide>

                </swiper>
            </div>

            <div style="margin-top: 3rem">

                <!--  -->
                <button-fill style="width: 100%" @click="register()" color="dark">Создать аккаунт</button-fill>
    
                <!-- Ссылка на экран логина -->
                <button-fill style="width: 100%" @click="$emit('toReg', false)" color="medium" fill="none">Назад</button-fill>
            </div>

        </div>
    </div>
</template>

<script>
    import { IonImg, IonText } from '@ionic/vue';
    //
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Virtual, Pagination } from 'swiper';
    import 'swiper/css';
    import 'swiper/css/pagination';
    import '@ionic/vue/css/ionic-swiper.css';
    //
    export default {
        name: 'set-user-profile',
        props: {
            userWorkProfileArray: {
                type: Array,
                required: true
            },
            userWorkProfile: {
                type: String,
                requitrf: true
            }
        },
        data() {
            return {
                accountProfile: 'Тортодилер',
            }
        },
        components: {
            Swiper, SwiperSlide,
            //
            IonImg, IonText,
        },
        methods: {
            translateUserProfileToImg (userProfile) {
                if(userProfile) {
                    if(userProfile === 'Тортодилер') {
                        return 'cake-backer'
                    } else if (userProfile === 'Автозапчасти') {
                        return 'auto-parts'
                    }
                }
            },
            onSlideChange (swiper){
                this.accountProfile = this.userWorkProfileArray[swiper.activeIndex]
            },
            register () {
                this.$emit('makeRegister', this.accountProfile)
            },
        },
    }
</script>

<style scoped>

</style>