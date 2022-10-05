export const setMarkerAttrColor = (dealSubject) => {
    let subjectAttributesArray = dealSubject.additionalAttributes;
    let isReturnedArray = subjectAttributesArray.flat();
    // console.log(isReturnedArray)
    let isReturnData = isReturnedArray.map(item => item.isReturned) ;
    // console.log(isReturnData)
    if(isReturnData.includes(false)) {
        return false;
    } else {
        return true;
    }
};

export const setMarkerCurrentAttrColor = (attribute) => {
    if(attribute.isReturned) {
        return true;
    } else {
        return false;
    }
}