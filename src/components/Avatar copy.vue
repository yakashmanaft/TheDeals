<template>
  <div>
    <!-- {{avatar_url}} -->
    <!-- Спиннер как имитация загрузки -->
    <Spinner v-if="spinner"/>
    <!-- Если запись в БД есть url -->
    <ion-avatar v-if="src !== ''" @click="changeAvatarMenu()">
      <img
        :src="src"
        alt="Avatar"
        class="avatar image"
        :style="{ height: size + 'em', width: size + 'em' }"
      />
    </ion-avatar>

    <!-- Если запись в БД === null -->
    <label v-else for="single">
      <ion-avatar class="no-avatar">
        <ion-icon style="font-size: 2rem;" color="light" :icon="person"></ion-icon>
      </ion-avatar>
    </label>

    <!--  -->
      <div :style="{ width: size + 'em' }">
        <!-- <label class="button primary block" for="single">
          {{ uploading ? "Uploading ..." : "Upload" }}
        </label> -->
        <input
          style="visibility: hidden; position: absolute"
          type="file"
          id="single"
          accept="image/*"
          @change="uploadAvatar"
          :disabled="uploading"
        />
      </div>
    </div>

    <ion-action-sheet
      :is-open="changeAvatarMenuIsOpened"
      @didDismiss="changeAvatarMenuIsOpened = false"
      :buttons="changeAvatarButtons"
    ></ion-action-sheet>
  </template>

<script setup>
  import { ref, toRefs, watch, onMounted } from 'vue'
  //
  import store from '../store/index';
  import { supabase } from '../supabase/init'
  //
  import Spinner from '../components/Spinner.vue'
  //
  import { IonIcon, IonAvatar, IonActionSheet } from '@ionic/vue'
  import { person } from 'ionicons/icons'


  const prop = defineProps(['path', 'size'])
  const { path, size } = toRefs(prop)

  const emit = defineEmits(['upload', 'update:path'])
  const uploading = ref(false)
  const src = ref('')
  const files = ref()
  //
  const userSettings = ref(store.state.userSettings[0])
  const avatar_url = ref('')
  //
  const spinner = ref(null)

  onMounted(() => {
        avatar_url.value = userSettings.value.avatar_url
        console.log(avatar_url.value)
        if(avatar_url.value) {
            src.value = `https://vpgbroyeiswutvsserbi.supabase.co/storage/v1/object/public/avatars/${avatar_url.value}`
        }
  })

  const downloadImage = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path.value)
      if (error) throw error
      src.value = URL.createObjectURL(data)
      spinner.value = false
    } catch (error) {
      console.error('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (evt) => {
    files.value = evt.target.files
    try {
      spinner.value = true
      uploading.value = true
      if (!files.value || files.value.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = files.value[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      console.log(filePath)
      
      let { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)
      
      // обновляем запись в table 
      updateAccountSettings(filePath)
      //
      if (uploadError) throw uploadError
      emit('update:path', filePath)
      emit('upload')
    } catch (error) {
      alert(error.message)
    } finally {
      uploading.value = false
    }
  }

  const updateAccountSettings = async (filePath) => {
    try {
        //
        let { error } = await supabase.from('accountSettings').update({
            avatar_url: filePath
        }).eq('id', userSettings.value.id)
        if (error) throw error;
    } catch (error) {
            alert(`Error: ${error.message}`)
          }
  }

  watch(path, () => {
    if (path.value) downloadImage()
  })
  //
  const changeAvatarMenuIsOpened = ref(false)
  const changeAvatarMenu= () => {
    changeAvatarMenuIsOpened.value = true
  }
  const changeAvatarButtons = [
    {
        text: 'Удалить',
        role: 'destructive',
        data: {
            type: 'delete'
        },
        handler: () => {
            deleteCurrentAvatar()
        }
    },
    {
        text: 'Отменить',
        role: 'cancel',
        handler: () => {
            console.log('Cancel clicked')
        }
    }
  ]
  //
  const deleteCurrentAvatar = async () => {
    console.log('click delete avatar')
    console.log(avatar_url.value)
    // удалить файл из storage
    // удалить avatar_url из accountSettings
    try {
      // console.log(data)
      // const { data, error } = await supabase.storage.from('avatars').remove(['folder/avatar1.png'])
      const { error } = await supabase.storage.from('avatars').remove([`${avatar_url.value}`])
      //
      const {  } = await supabase.from('accountSettings').update({ avatar_url: null }).eq('id', userSettings.value.id)
      avatar_url.value = ''
      src.value = ''
      // console.log(avatar_url.value)
      if(error) throw error
      // alert('Avatar: аватар удален')
      // return data
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }
</script>

<style scoped>
  /* .avatar {
    display: block;
    margin: auto;
    min-height: 150px;
  } */
  .avatar .avatar_wrapper {
    margin: 0.8rem auto 0.8rem;
    border-radius: 50%;
    overflow: hidden;
    height: 8rem;
    aspect-ratio: 1;
    background: var(--ion-color-step-50);
    border: thick solid var(--ion-color-step-200);
  }
  .avatar .avatar_wrapper:hover {
    cursor: pointer;
  }
  /* .avatar .avatar_wrapper ion-icon.no-avatar {
    width: 100%;
    height: 115%;
  } */
  .avatar img {
    display: block;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  ion-avatar {
    height: 7rem;
    width: 7rem;
    display: block
  }
  .no-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--ion-color-medium)
  }
</style>