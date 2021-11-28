"use strict";
const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

jest.setTimeout(20000);

const setUp = (prompts) =>
  helpers.run(path.join(__dirname, "../generators/app")).withPrompts(prompts);

describe("jsapp-jest:nm", () => {
  const prompts = {
    jsAppName: "foo",
    githubUsername: "my-nick",
    website: "https://mysite.com",
  };

  it("creates files", () =>
    setUp(prompts).then(() => {
      assert.file("index.js");
      assert.file("README.md");
      assert.file("package.json");
      assert.file(".gitignore");
    }));

  it("writes appropriate content to the files", () =>
    setUp({ ...prompts, description: "bar" }).then(() => {
      assert.fileContent("package.json", /"name": "foo"/);
      assert.fileContent("package.json", /"description": "bar"/);
      assert.fileContent("package.json", /"repository": "my-nick\/foo"/);
      assert.fileContent("package.json", /"url": "https:\/\/mysite.com"/);
      assert.fileContent("README.md", /# foo/);
      assert.fileContent(".gitignore", /node_modules/);
    }));
});
