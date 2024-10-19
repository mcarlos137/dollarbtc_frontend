import PropTypes from 'prop-types';
import { getContext } from 'recompose';

export default getContext({
  translate: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
});