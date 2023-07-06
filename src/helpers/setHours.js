// Добавляем час к execution date
export const setExecutionHours = (executionDate) => {

    const date = new Date(executionDate);
    date.setHours(date.getHours() + 6);

    return date;

};