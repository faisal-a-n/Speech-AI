export const WordActions = {
  REPLACE: (list, index, content) => {
    list.splice(index, 1, content);
    return list;
  },
  CLEAR_WORD: (list, index) => {
    list.splice(index, 1);
    console.log(list);
    return list;
  },
  CLEAR_NEXT: (list, index) => {
    list.splice(index + 1);
    return list;
  },
};

export const removeDuplicates = (string1, string2) => {
  string2 = string2.replace(string1, "", 1).replace(/\\/g, "");
  return string2;
};
