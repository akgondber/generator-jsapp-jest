"use strict";
const Generator = require("yeoman-generator");
const yosay = require("yosay");
const slugify = require("slugify");

module.exports = class extends Generator {
  constructor(args, options, features) {
    super(args, options, features);

    this.option("useNpm", {
      type: Boolean,
      description: "Use npm package manager instead of yarn",
    });

    this.env.options.nodePackageManager = this.options.useNpm ? "npm" : "yarn";
  }

  prompting() {
    this.log(yosay(`Welcome to the fine generator-jsapp-jest generator!`));

    const prompts = [
      {
        name: "jsAppName",
        message: "What do you want to name your js app?",
        default: slugify(this.appname),
      },
      {
        name: "description",
        message: "What is your js app description?",
        default: "My awesome module",
      },
      {
        name: "githubUsername",
        message: "What is your Github username",
        store: true,
        validate: (x) =>
          x.length > 0 ? true : "You have to provide a username",
      },
      {
        name: "website",
        message: "What is the URL of your website?",
        store: true,
        validate: (x) =>
          x.length > 0 ? true : "You have to provide a website URL",
      },
    ];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    const plainFiles = ["index.js", ".gitignore"];
    const tplObjects = [
      {
        file: "_package.json",
        dest: "package.json",
      },
      {
        file: "README.md",
        dest: "README.md",
      },
    ];

    plainFiles.forEach((file) => {
      this.fs.copy(this.templatePath(file), this.destinationPath(file));
    });

    tplObjects.forEach((obj) => {
      this.fs.copyTpl(
        this.templatePath(obj.file),
        this.destinationPath(obj.dest || obj.file),
        {
          ...this.props,
          name: this.user.git.name(),
          email: this.user.git.email(),
        }
      );
    });
  }

  git() {
    this.spawnCommandSync("git", ["init"]);
  }
};
