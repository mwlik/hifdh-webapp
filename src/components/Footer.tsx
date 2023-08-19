import React from "react";
import Name from "../assets/name.png";
import Github from "../assets/github.png";

const Footer = () => {
  return (
    <footer>
      <img src={Name} className="name" alt="Developer's Name" />
      <a
        href="https://github.com/malikmouhiidine"
        target="_blank"
        rel="noreferrer"
      >
        <img src={Github} className="github" alt="Github Link" />
      </a>
    </footer>
  );
};

export default Footer;
