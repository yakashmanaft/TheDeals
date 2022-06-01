import { supabase } from './init';

export const getContactInfo = async (contactInfo, errorMsg, dataLoaded) => {
    try {
        const { data: myContacts, error } = await supabase.from('myContacts').select('*');
        if(error) throw error;
        contactInfo.value = myContacts;
        dataLoaded.value = true;
    } catch (error) {
        // console.warn(error.message);
        errorMsg.value = error.message;
        setTimeout(() => {
            errorMsg.value = false;
          }, 5000);
    }
};
