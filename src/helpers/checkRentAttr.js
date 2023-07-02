export const checkRentAttr = (item, dealType) => {
    if(dealType === 'sale') {
        if(item.additionalAttributes.length > 0) {
            // Если атрибут выбран
            return true;
        } else if (item.additionalAttributes.length === 0 ){
            // Если атрибутов в принципе не выбрано
            // console.log('без атрибутов')
            return false;
        } 
    } else if (dealType === 'buy') {
        return;
    }
};