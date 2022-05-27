export const showNameByID = (contactInfo, contactID) => {
      //создаем на их основании новый массив
      let arr = contactInfo.value.map(item => {
        return {...item};
      })
    let result = arr.filter(obj => {
      return obj.id === +contactID;
    })

    // Без проверки выдает еще и пустые массивы... почему?
    if(result.length !== 0) {
      // console.log(result[0].contactInfo)
      const nameByID = (result[0].contactInfo.surname + ' ' + result[0].contactInfo.name).toString().replace(/"/g, "");
      
      return nameByID;
    }
};