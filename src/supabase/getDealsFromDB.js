import { supabase } from './init';

export const getDeals = async (list, dataLoaded, errorMsg) => {
    try {
      const { data: deals, error } = await supabase.from('deals').select('*');
      if(error) throw error;
      list.value = deals;
      dataLoaded.value = true;
    } catch (error) {
      errorMsg.value = error.message;
      // setTimeout(() => {
      //   errorMsg.value = false;
      // }, 5000);
      // console.warn(error.message);
    }
};

export const getDealStatus = async (dealStatusArray, dataLoaded, errorMsg) => {
  try {
    let { data: deals, error } = await supabase.from('deals').select('dealStatus')
    if(error) throw error;
    dealStatusArray.value = deals;
    dataLoaded.value = true;
  } catch (error) {
    errorMsg.value = error.message;
    // setTimeout(() => {
    //   errorMsg.value = false;
    // }, 5000);
    // console.warn(error.message);
  }
};