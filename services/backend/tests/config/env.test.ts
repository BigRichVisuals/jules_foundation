import { getBaseConfig, getContactConfig, getNewsletterConfig } from "../../src/config/env.js";

describe("environment config", () => {
  it("parses base config with allowed origins", () => {
    const config = getBaseConfig({
      APP_ENV: "dev",
      LOG_LEVEL: "debug",
      ALLOWED_ORIGINS: "https://www.julesfoundation.com,http://localhost:3000"
    });

    expect(config.ALLOWED_ORIGINS).toEqual(["https://www.julesfoundation.com", "http://localhost:3000"]);
  });

  it("requires contact email settings for contact config", () => {
    expect(() =>
      getContactConfig({
        APP_ENV: "dev",
        LOG_LEVEL: "info",
        ALLOWED_ORIGINS: "https://www.julesfoundation.com"
      })
    ).toThrow("Invalid environment configuration");
  });

  it("requires newsletter table name for newsletter config", () => {
    expect(() =>
      getNewsletterConfig({
        APP_ENV: "dev",
        LOG_LEVEL: "info",
        ALLOWED_ORIGINS: "https://www.julesfoundation.com"
      })
    ).toThrow("Invalid environment configuration");
  });
});
