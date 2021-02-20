import Vue from 'vue';

export const snackbarEmitter = {
  success: (message) => {
    Vue.notify({
      group: 'success',
      title: 'Info',
      text: message
    });
  },
  error: (error) => {
    let message;
    if(error.data && error.data.error){
      message = error.data.error.message;
    }
    else {
      message = 'Something went wrong, try again later!';
    }
    Vue.notify({
      group: 'error',
      title: 'Error',
      text: message
    });
  }
};
