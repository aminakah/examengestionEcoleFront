{
  "testEnvironment": "jsdom",
  "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"],
  "moduleNameMapping": {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "jest-transform-stub"
  },
  "collectCoverageFrom": [
    "src/**/*.{js,jsx}",
    "!src/index.js",
    "!src/reportWebVitals.js",
    "!src/setupTests.js",
    "!src/**/*.test.js",
    "!src/**/__tests__/**"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 70,
      "lines": 70,
      "statements": 70
    }
  },
  "testMatch": [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx}"
  ],
  "transform": {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  "moduleFileExtensions": ["js", "jsx", "json"],
  "verbose": true,
  "clearMocks": true,
  "restoreMocks": true
}
