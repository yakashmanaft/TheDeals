import { bagHandleOutline, cubeOutline } from 'ionicons/icons';

export const setIconByDealType = (dealType) => {
    if(dealType === 'sale') {
        return bagHandleOutline;
    } else if(dealType === 'buy') {
        return cubeOutline;
    }
};