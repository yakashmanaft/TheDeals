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

// translate deal status to rus
export const translateDealStatus = (dealStatus) => {
    if (dealStatus === 'deal-in-booking') {
        return 'Бронь даты';
    }
    if (dealStatus === 'deal-in-process') {
        return 'В процессе';
    }
    if (dealStatus === 'deal-in-delivery') {
        return 'В доставке';
    }
    if (dealStatus === 'deal-in-debt') {
        return 'Долг';
    }
    if (dealStatus === 'deal-complete') {
        return 'Завершен';
    }
    if (dealStatus === 'deal-cancelled') {
        return 'Отменен';
    }
};