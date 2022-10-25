// Переводчик наименований из БД
// У каждого объекта есть value (латинское) и name (русский вариант)
export const translateValue = (value, array) => {
    // console.log(array)
    let currentName = '';
    array.forEach(item => {
        // console.log(item.value)
        if(item.value === value) {
            currentName = item.name;
            return currentName;
        }
    });
    return currentName;
};