export const setColorByIsReturned = (attrisReturned) => {
    if(attrisReturned === true) {
        return 'success';

    } else if (attrisReturned === false) {
        return 'warning';
    }
};

export const setColorByDealType = (dealType) => {
    if(dealType === 'sale') {
        return 'success';
    } else if (dealType === 'buy') {
        return 'warning';
    } else {
        return 'primary';
    }
};