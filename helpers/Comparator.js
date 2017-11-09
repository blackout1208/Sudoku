 module.exports = {
    ArrayComparator: function (arr1, arr2){
        if (arr1.length == arr2.length &&
            arr1.every(function (u, i) {
                return u === arr2[i];
            })
        ) {
            return true;
        } else {
            return false;
        }
    }
};