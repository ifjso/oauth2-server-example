import logger from 'morgan';

export default (app) => {
  if (app.get('env') === 'production') {
    app.use(logger('combined'));
  } else {
    app.use(logger('dev'));
  }
};
