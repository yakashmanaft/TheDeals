// Сортировщик списка предметов дела (Продажи, ЗАкупки) по алфавиту
// Оптимизировать (Чтобы функция стала более универсальной) sortMyContacts & sortDealSubject
export const sortAlphabetically = (arrayToSort) => {

    return arrayToSort.sort((a, b) => {
      let fa = a.name.toLowerCase(), fb = b.name.toLowerCase();
      if (fa < fb) {
        return -1;
      } 
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    
  }; 

  export const sortAlphabeticallyWarhouseItem = (arrayToSort) => {

    return arrayToSort.sort((a, b) => {
      let fa = a.toLowerCase(), fb = b.toLowerCase();
      if (fa < fb) {
        return -1;
      } 
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    
  }; 