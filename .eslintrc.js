module.exports = {
    "root": true,
    "env": {
        "jest": true,
        "browser": true,
        "es6": true,
        "node": true
    },
// default configuration for ec6
    "extends": [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "eslint:recommended"
    ],
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig.json",
        ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
        sourceType: "module",  // Allows for the use of imports
        ecmaFeatures: {
            jsx: true,  // Allows for the parsing of JSX
        },

    },
    //defining rules
    "rules": {
        "no-var": "error",
        "linebreak-style": [
            "error",
            "unix"
        ],
        //"no-multi-spaces": ["error"], // ovo mora da se iskljuci zbog imports
        "block-spacing": ["error", "always"],
        "space-before-blocks": ["error", "always"],
        "space-before-function-paren": [
            "error",
            {
                "anonymous": "never",
                "named": "always",
                "asyncArrow": "always"
            }
        ],
        "no-whitespace-before-property": ["error"],
        "func-call-spacing": ["error", "never"],
        "keyword-spacing": [
            "error",
            {
                "overrides":
                    {
                        "if": {"after": true},
                        "for": {"after": true},
                        "while": {"after": true},
                        "switch": {"after": true}
                    }
            }
        ],
        "spaced-comment": ["error", "always"],
        "space-unary-ops": [
            "error",
            {
                "words": true,
                "nonwords": false,
                "overrides": {
                    "void": false,

                }
            }
        ],
        "space-infix-ops": "error",
        "arrow-spacing": [
            "error",
            {
                "before": true,
                "after": true
            }
        ],
        "array-bracket-spacing": ["error", "never"],
        "padding-line-between-statements": [
            "error",
            {blankLine: "always", prev: "*", next: "class"},
            {blankLine: "always", prev: "*", next: "cjs-export"},
            {blankLine: "always", prev: "directive", next: "*"},
        ],
        "function-paren-newline": ["error", "never"],
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 1
            }
        ],
        "curly": ["error", "all"],
        "no-control-regex": 1, //	disallow control characters in regular expressions
        "newline-per-chained-call": 1,
        "no-useless-escape": 1,
        "no-cond-assign": "error",
        "no-console": "off",
        "react/prop-types": 0,
        "react-hooks/rules-of-hooks": 0,
        "react/display-name":0,
        "@typescript-eslint/indent": [
            "error",
            2,
            {
                "ignoreComments": true,
                "FunctionExpression": {
                    "body": 1,
                    "parameters": "off"
                },
                "CallExpression": {
                    "arguments": "off"
                },
                "ObjectExpression": 1,
                "ArrayExpression": 1,
                "SwitchCase": 1,
                "ImportDeclaration": 1,
                "VariableDeclarator": {"var": 2, "let": 2, "const": 3},
                "MemberExpression": 1,
                "outerIIFEBody": 1,
                "ignoredNodes": [ "JSXAttribute", "JSXSpreadAttribute" ]
            }
        ],
        "@typescript-eslint/quotes": ["error", "single"],
        "@typescript-eslint/semi": ["error", "never"],
        "@typescript-eslint/camelcase": [
            "error",
            {
                "properties": "never"
            }
        ],
        "@typescript-eslint/brace-style": [
            "error",
            "1tbs"
        ],
        "@typescript-eslint/no-unused-vars": 1, //	disallow declaration of variables that are not used in the code
        "@typescript-eslint/no-inferrable-types": 0,
        "@typescript-eslint/consistent-type-assertions": 0,
        "@typescript-eslint/class-name-casing": 0,
        "@typescript-eslint/func-call-spacing": ["error", "never"],
        "@typescript-eslint/interface-name-prefix": [
            "error",
            {
                "prefixWithI": "always"
            }
        ],
        "@typescript-eslint/no-array-constructor": "error",
        "@typescript-eslint/no-empty-function": ["error"],
        "@typescript-eslint/no-empty-interface": ["error"],
        "@typescript-eslint/no-for-in-array": 1,
        "@typescript-eslint/no-non-null-assertion": 1,
        "@typescript-eslint/no-require-imports": 1,
        "@typescript-eslint/no-use-before-define": 0,
        "@typescript-eslint/prefer-function-type": 1,
        "@typescript-eslint/prefer-regexp-exec": "error",
        "@typescript-eslint/prefer-string-starts-ends-with": "error",
        "@typescript-eslint/require-await": "error",
        "@typescript-eslint/restrict-plus-operands": 0,
        "@typescript-eslint/member-delimiter-style": 0,
        "@typescript-eslint/type-annotation-spacing": [
            "error",
            {
                "before": true,
                "after": true
            }
        ],
        "@typescript-eslint/unified-signatures": 1,
        "react/jsx-filename-extension": [
            1,
            {
                "extensions": [
                    ".js",
                    ".jsx",
                    ".ts",
                    ".tsx"
                ]
            }
        ],
    },
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [
                    ".js",
                    ".jsx",
                    ".ts",
                    ".tsx",
                    ".json"
                ]
            }
        },
        "react": {
            "pragma": "React",
            "version": "detect"
        }
    },
    "globals": {
        "window": true,
        "document": true
    }
}
