import { bagHandleOutline, cubeOutline, constructOutline, checkmark, sync } from 'ionicons/icons';

export const setIconByDealType = (dealType) => {
    if(dealType === 'sale') {
        return bagHandleOutline;
    } else if(dealType === 'buy') {
        return cubeOutline;
    }
};

export const setIconByBlockToShow = (blockToShow) => {
    if(blockToShow === 'products') {
        return bagHandleOutline;
    } else if(blockToShow === 'attributes') {
        return constructOutline;
    }
};

export const setIconByIsReturned = (attrisReturned) => {
    if (attrisReturned === true) {
        return checkmark;
    } else if (attrisReturned === false) {
        return sync;
    }
}; 