import React from "react";
import { useTranslation } from "react-i18next";

const TipCard = ({ title, category, date, content }) => {
  const { t } = useTranslation();

  // Determine badge class based on category
  const getBadgeClass = () => {
    switch (category) {
      case "farmingTips":
        return "badge bg-success";
      case "alert":
        return "badge bg-danger";
      case "resources":
        return "badge bg-primary";
      default:
        return "badge bg-secondary";
    }
  };

  // Determine icon based on category
  const getIcon = () => {
    switch (category) {
      case "farmingTips":
        return "🌱";
      case "alert":
        return "🚨";
      case "resources":
        return "📚";
      default:
        return "ℹ";
    }
  };

  // Translate category name
  const getTranslatedCategory = () => {
    switch (category) {
      case "farmingTips":
        return t("tipsPage.categories.farmingTips");
      case "alert":
        return t("tipsPage.categories.alert");
      case "resources":
        return t("tipsPage.categories.resources");
      default:
        return t("tipsPage.categories.other");
    }
  };

  // Function to format relative time with month and year thresholds
  const getRelativeTime = (dateString) => {
    const now = new Date(); // Real-time current date and time (10:47 PM EAT, September 20, 2025)
    const tipDate = new Date(dateString);
    const diffMs = now - tipDate; // Difference in milliseconds

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 28); // Approximate 1 month as 4 weeks (28 days)
    const years = Math.floor(months / 12); // Approximate 1 year as 12 months

    if (years > 0)
      return `${years} ${t("time.year", { count: years })} ${t("common.ago")}`;
    if (months >= 1)
      return `${months} ${t("time.month", { count: months })} ${t(
        "common.ago"
      )}`; // After 4 weeks
    if (days > 0)
      return `${days} ${t("time.day", { count: days })} ${t("common.ago")}`;
    if (hours > 0)
      return `${hours} ${t("time.hour", { count: hours })} ${t("common.ago")}`;
    if (minutes > 0)
      return `${minutes} ${t("time.minute", { count: minutes })} ${t(
        "common.ago"
      )}`;
    return `${seconds} ${t("time.second", { count: seconds })} ${t(
      "common.ago"
    )}`;
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">
            {getIcon()} {title}
          </h5>
          <span className={getBadgeClass()}>{getTranslatedCategory()}</span>
        </div>
        <h6 className="card-subtitle mb-2 text-muted">
          {t("tipsPage.farmingTips.postedOn")} {getRelativeTime(date)}
        </h6>
        <p className="card-text">{content}</p>
      </div>
    </div>
  );
};

export default TipCard;
