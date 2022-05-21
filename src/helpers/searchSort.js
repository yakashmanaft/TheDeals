// Сортировщик списка контактов по алфавиту
// Оптимизировать contactInfo.surname (Чтобы функция стала более универсальной)
export const sortedArray = (arrayToSort) => {

  return arrayToSort.sort((a, b) => {
    let fa = a.contactInfo.surname.toLowerCase(), fb = b.contactInfo.surname.toLowerCase();
    if (fa < fb) {
      return -1;
    } 
    if (fa > fb) {
      return 1;
    }
    return 0;
  })
  
}; 
