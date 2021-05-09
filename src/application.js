import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';

const schema = yup.string().required();

const validate = (field) => {
  try {
    schema.validateSync(field, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

export default () => {
  const state = {
    rssForm: {
      state: 'valid',
      data: {
        email: '',
      },
      errors: [],
    },
  };

  alert('Enter!');

  const container = document.querySelector('container');
  const form = document.querySelector('form');
  const inputField = document.querySelector('[type="text"]');

  inputField.focus();

  const watchedState = onChange(state, (path, currValue, prevValue) => {
    console.log('Hello!');
  });

  inputField.addEventListener('input', (e) => {
    e.preventDefault();
    const email = e.target.name;
    watchedState.rssForm.data[email] = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('LOOOK!');
    // const { data } = watchedState.rssForm;
    const div = document.createElement('div');
    div.innerHTML = 'Clicked!';
    container.appendChild(div);
  });

  // console.log(validate(null));
  // if (validate('Hello')) {
  //   console.log('success');
  //   // eslint-disable-next-line no-alert
  //   alert(form.innerHTML);
  // } else console.log('feels Bad');
};
