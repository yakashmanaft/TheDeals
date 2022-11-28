<template>
  <div class="avatar">
    <!-- Спиннер как имитация загрузки -->
    <Spinner v-if="spinner"/>
    <!-- Если запись в БД есть -->
    <div v-if="avatarUrl" class="avatar_wrapper" @click="changeAvatarMenu()">
      <img :src="avatarUrl" />
    </div>
    <!-- Если нет -->
    <div v-else class="avatar_wrapper" @click="uploadAvatar">
      <ion-icon :icon="person" class="no-avatar" color="light"></ion-icon>
    </div>
    <!-- Меню удаления -->
    <ion-action-sheet
      :is-open="changeAvatarMenuIsOpened"
      @didDismiss="changeAvatarMenuIsOpened = false"
      :buttons="changeAvatarButtons"
    ></ion-action-sheet>
  </div>
</template>

<script>
import { ref, toRefs, watch, defineComponent, onMounted } from 'vue';
import { supabase } from '../supabase/init';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonIcon, IonActionSheet } from '@ionic/vue';
import { person } from 'ionicons/icons';
//
import Spinner from '../components/Spinner.vue'
//
import store from '../store/index';
export default defineComponent({
  name: 'AppAvatar',
  props: { path: String },
  emits: ['upload', 'update:path'],
  components: { IonIcon, IonActionSheet, Spinner },
  setup(prop, { emit }) {
    const { path } = toRefs(prop);
    const avatarUrl = ref('');
    const userSettings = ref(store.state.userSettings[0])
    const fileName = ref()
    fileName.value = userSettings.value.avatar_url
    const spinner = ref(null)
    onMounted(() => {
      // console.log(avatarUrl.value)
        // ИСКЛЮЧИТЬ ОШИБКУ УСЛОВИЕМ 
        downloadImage()
    })
    const downloadImage = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path.value);
          // console.log(avatarUrl.value)
        if (error) throw error;
        avatarUrl.value = URL.createObjectURL(data);
        // console.log(avatarUrl.value)
        spinner.value = false
      } catch (error) {
        console.error('Error downloading image: ', error.message);
      }
    };
    const uploadAvatar = async () => {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.DataUrl,
        });
        spinner.value = true
        if (photo.dataUrl) {
          const file = await fetch(photo.dataUrl)
            .then((res) => res.blob())
            .then(
              (blob) =>
                new File([blob], 'my-file', { type: `image/${photo.format}` })
            );
          const fileName = `${Math.random()}-${new Date().getTime()}.${
            photo.format
          }`;
          let { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file);

            // обновляем запись в table 
            await updateAccountSettings(fileName)
            // spinner.value = false
          if (uploadError) {
            throw uploadError;
          }
          emit('update:path', fileName);
          emit('upload', true);
          // spinner.value = false
        }
      } catch (error) {
        console.log(error);
      }
      // spinner.value = false
    };
    //
    const updateAccountSettings = async (fileName) => {
      try {
        //
        let { error } = await supabase.from('accountSettings').update({
          avatar_url: fileName
        }).eq('id', userSettings.value.id)
        // spinner.value = false
        if (error) throw error;
      } catch (error) {
        alert(`Error: ${error.message}`)
      }
    }
    watch(path, () => {
      if (path.value) downloadImage();
    });
    //
    const changeAvatarMenuIsOpened = ref(false)
    const changeAvatarMenu = () => {
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
    const deleteCurrentAvatar = async () => {
      // console.log(fileName.value)
      try {
        spinner.value = true
        const { error } = await supabase.storage.from('avatars').remove([`${fileName.value}`])
        const {  } = await supabase.from('accountSettings').update({ avatar_url: null }).eq('id', userSettings.value.id)
        fileName.value = ''
        avatarUrl.value = ''
        if(error) throw error
      } catch(error){
        alert(`Error: ${error.message}`)
      }
      spinner.value = false
    }
    //
    return { avatarUrl, uploadAvatar, person, userSettings, changeAvatarMenu, updateAccountSettings, changeAvatarMenuIsOpened, changeAvatarButtons, deleteCurrentAvatar, fileName, spinner };
  },
});
</script>
<style>
.avatar {
  display: block;
  margin: auto;
  min-height: 150px;
}
.avatar .avatar_wrapper {
  margin: 16px auto 16px;
  border-radius: 50%;
  overflow: hidden;
  height: 150px;
  aspect-ratio: 1;
  background: var(--ion-color-step-50);
  border: thick solid var(--ion-color-step-200);
}
.avatar .avatar_wrapper:hover {
  cursor: pointer;
}
.avatar .avatar_wrapper ion-icon.no-avatar {
  width: 100%;
  height: 115%;
  background-color: var(--ion-color-medium);
}
.avatar img {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>