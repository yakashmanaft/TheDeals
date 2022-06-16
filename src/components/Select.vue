<template>
    <div class="v-select text-right text-sm text-blue border-b border-dashed border-blue">
        <p 
            class="title"
            @click="areOptionsVisible = !areOptionsVisible"
        >
            {{selected}}
        </p>
        <div 
            class="options flex flex-col items-center justify-center"
            v-if="areOptionsVisible"
        >
            <p
                class=""
                v-for="option in options"
                :key="option.name"
                @click.stop="$emit('select', option), areOptionsVisible = false"
            >
                {{option.title}}
            </p>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue'

    export default {
        name: 'Select',
        props: {
            options: {
                type: Array,
                default() {
                    return []
                }
            },
            selected: {
                type: String,
                default: ''
            }
        },
        setup() {
            const areOptionsVisible = ref(false)

            //
            const hideSelect = () => {
                areOptionsVisible.value = false;
            }


            //
            // onMounted(() => {
            //     document.addEventListener('click', this.hideSelect.bind(this), true)
            // })

            // //
            // onBeforeUnmount(() => {
            //     document.removeEventListener('click', hideSelect())
            // })

            return {
                areOptionsVisible, hideSelect
            }
        }
    }
</script>

<style scoped>
    .v-select {
        position: relative;
        /* width: 100%; */
        cursor: pointer;
    }
    /* Если не пригодится - удалить */
    .title {
        /* border: 1px solid #838383; */
    }
    .options {
        /* border: 1px solid #838383; */
        position: fixed;
        bottom: 0;
        height: 100vh;
        z-index: 30;
        right: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(2px);
    }
    .options p:hover {
        background: #000;
    }
</style>