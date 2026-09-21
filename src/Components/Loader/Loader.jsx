import React from "react";
import "./Loader.css";

export function PageLoader() {
  return (
    <div className="page-loader">
      <span className="loader-spinner"></span>
      <span>Loading...</span>
    </div>
  );
}

export function ButtonLoader({ text = "Saving..." }) {
  return (
    <span className="button-loader-content">
      <span className="button-spinner"></span>
      {text}
    </span>
  );
}
