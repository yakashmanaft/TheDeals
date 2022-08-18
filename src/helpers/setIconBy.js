import { bagHandleOutline, cubeOutline, constructOutline } from 'ionicons/icons';

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