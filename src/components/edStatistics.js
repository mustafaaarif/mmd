import React from "react";
import PropTypes from "prop-types";

class EdStatistics extends React.Component {
  render() {
    const icon = (
      <img src={this.props.icon} alt="release-artwork" style={{ borderRadius: '50%', height: '70px', width: '70px'}} />
    );
    const title = <span>{this.props.title}</span>;
    const subtitle = <h4 className="font-medium mb-0">{this.props.subtitle}</h4>;
    return (
      <div className="d-flex align-items-center">
        <div className="mr-2">
          {icon}
        </div>
        <div>
          {title}
          {subtitle}
        </div>
      </div>
    );
  }
}

EdStatistics.defaultProps = {
  textColor: "default"
};

EdStatistics.propTypes = {
  textColor: PropTypes.oneOf([
    "primary",
    "success",
    "info",
    "danger",
    "warning",
    "orange",
    "cyan",
    "default"
  ]),
  icon: PropTypes.string,
  title: PropTypes.node,
  subtitle: PropTypes.node,
};

export default EdStatistics;
