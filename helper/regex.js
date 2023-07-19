export const regex = {
  numeric: (val, len = 0, replacer = '') => {
    return val?.replace(/[^0-9]/g, replacer)?.substring(0, len);
  },
  alpha: (val, len = 0, replacer = '') => {
    return val?.replace(/\d/g, replacer)?.substring(0, len);
  },
};
