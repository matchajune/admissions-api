'use strict';

var exports = module.exports = {
  addSort: (object, params) => {
    let isStudentObject = object.id === 'student';
    let name            = isStudentObject ? params.name : params.college;
    let saveParams      = isStudentObject ? {college: params.college} : {name: params.name};
    saveParams.score    = params.score;
    // create new array container if one doesn't already exist
    object[name] = object[name] || [];
    // save the params into array
    object[name].push(saveParams);
    // sort by score
    object[name] = object[name].sort((a,b) => {
      if (a.score < b.score) {
        return 1;
      }
      if (a.score > b.score) {
        return -1;
      }
      return 0;
    });

    return object;
  },
  objectWithoutId: (object) => {
    let objectCopy = Object.assign({}, object);
    delete object.id;
    return objectCopy;
  }
};