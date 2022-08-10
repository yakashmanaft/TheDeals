export const setColorByDealType = (dealType) => {
    if(dealType === 'sale') {
        return 'success';
    } else if (dealType === 'buy') {
        return 'warning';
    } else {
        return 'primary';
    }
};