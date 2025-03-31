import PropTypes from 'prop-types';

export const exercizerPropTypes = {
  subject: PropTypes.string.isRequired,
  context: PropTypes.string,
  contentType: PropTypes.string,
  onComplete: PropTypes.func,
  themeColor: PropTypes.string,
  showBanner: PropTypes.bool,
};

export const exercizerDefaultProps = {
  context: "",
  contentType: "multiple_choice",
  onComplete: () => {},
  themeColor: "#0891b2",
  showBanner: true,
};
