import morgan from 'morgan';

export default (app) => {
  if (app.get('env') === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }
};
