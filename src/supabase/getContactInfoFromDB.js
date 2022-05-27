import { supabase } from './init';

export const getContactInfo = async (contactInfo) => {
    try {
    const { data: myContacts, error } = await supabase.from('myContacts').select('*');
    if(error) throw error;
    contactInfo.value = myContacts;
    
    } catch (error) {
    console.warn(error);
    }
};