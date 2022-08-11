// Переводчик наименований из БД
// У каждого объекта есть value (латинское) и name (русский вариант)
export const translateValue = (value, array) => {
    let currentName = '';
    array.forEach(item => {
        if(item.value === value) {
            currentName = item.name;
            return currentName;
        }
    });
    return currentName;
};