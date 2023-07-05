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

export const translateRecipeID = (value, array) => {
    if(value === '111') {
        return 'Без рецепта';
    } else {
        // console.log(value)
        // console.log(array)
        let recipeName;
        array.forEach(recipe => {
            if(recipe.uid === value) {
                recipeName = recipe.name;
                return recipeName;
            }
        });
        console.log(recipeName)
        return recipeName;
    }
};