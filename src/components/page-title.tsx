import React from "react";
import { Helmet } from "react-helmet-async";

interface IPageTitleProps {
  title: string;
}

const PageTitle: React.FC<IPageTitleProps> = ({ title }) => {
  return (
    <Helmet>
      <title> {title} | Uber Eats Clone</title>
    </Helmet>
  );
};

export default PageTitle;
