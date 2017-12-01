'use strict';

var exports = module.exports = {
  addSort: (klass, params) => {
    let forStudent = klass.id === 'student';
    let name = forStudent ? params.name : params.college;
    let saveParams = forStudent ? {college: params.college} : {name: params.name};
    saveParams.score = params.score;
    if (!klass[name]) {
      klass[name] = [];
    }
    klass[name].push(saveParams);
    klass[name] = klass[name].sort((a,b) => {
      if (a.score < b.score) {
        return 1;
      }
      if (a.score > b.score) {
        return -1;
      }
      return 0;
    });
    return klass;
  }
};