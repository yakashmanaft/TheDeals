// translate deal type to rus
export const translateDealType = (dealType) => {
    if (dealType === 'order') {
        return 'Заказ';
    }
    if (dealType === 'supply') {
        return 'Поставка';
    }
    if (dealType === 'personal') {
        return 'Личное';
    }
};