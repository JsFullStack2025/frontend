import boundaries from "eslint-plugin-boundaries";

export const eslintBoundariesConfig = {
  plugins: {
    boundaries,
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    "boundaries/elements": [
      {
        type: "app",
        pattern: "./src/app",
      },
      {
        type: "features",
        pattern: "./src/features/*",
      },
      {
        type: "shared",
        pattern: "./src/shared",
      },
    ],
  },
  rules: {
    "boundaries/element-types": [
      2,
      {
        default: "allow",
        rules: [
          {
            from: "shared",
            disallow: ["app", "features"],
            message:
              "Модуль вышележащего слоя (${dependency.type}) не может быть импортирован модулем нижележащего слоя (${file.type}). Шаблон импортов: [app < features < shared]",
          },
          {
            from: "features",
            disallow: ["app"],
            message:
              "Модуль вышележащего слоя (${dependency.type}) не может быть импортирован модулем нижележащего слоя (${file.type}). Шаблон импортов: [app < features < shared]",
          },
        ],
      },
    ],
    "boundaries/entry-point": [
      2,
      {
        default: "disallow",
        message:
          "Модуль (${file.type}) должен импортироваться через public API. Прямой импорт из ${dependency.source} запрещен",

        rules: [
          {
            target: ["shared", "app"],
            allow: "**",
          },
          {
            target: ["features"],
            allow: ["index.(ts|tsx)", "*.widget.tsx"],
          },
        ],
      },
    ],
  },
};
